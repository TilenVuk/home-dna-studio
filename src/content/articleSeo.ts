import { articlePath, type AiSearchArticle } from "./aiSearchArticles";
import type { Locale } from "@/lib/i18n";

const SITE_URL = "https://nuvelistudio.com";
const MAX_TITLE_LENGTH = 60;

function clampSeoTitle(title: string): string {
  if (title.length <= MAX_TITLE_LENGTH) return title;

  const limit = MAX_TITLE_LENGTH - 1;
  const slice = title.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  const shortened = lastSpace >= 36 ? slice.slice(0, lastSpace) : slice;
  return `${shortened.trim()}…`;
}

export function buildArticleSeo(article: AiSearchArticle, locale: Locale) {
  const content = article.localized[locale];
  const canonicalUrl = `${SITE_URL}${articlePath(article, locale)}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.description,
    inLanguage: locale,
    author: { "@type": "Organization", name: "Nuveli Studio" },
    publisher: { "@type": "Organization", name: "Nuveli Studio" },
    mainEntityOfPage: canonicalUrl,
  };
  const faqSchema = content.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return {
    title: clampSeoTitle(content.title),
    canonicalUrl,
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(articleSchema) },
      ...(faqSchema ? [{ type: "application/ld+json", children: JSON.stringify(faqSchema) }] : []),
    ],
  };
}
