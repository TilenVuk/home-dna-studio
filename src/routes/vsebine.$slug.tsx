import { createFileRoute } from "@tanstack/react-router";
import { AiSearchArticlePage } from "@/components/content/AiSearchArticlePage";
import { articlePath, getArticleBySlug } from "@/content/aiSearchArticles";
import { buildArticleSeo } from "@/content/articleSeo";

export const Route = createFileRoute("/vsebine/$slug")({
  head: ({ params }) => {
    const article = getArticleBySlug("sl", params.slug);
    if (!article) return {};
    const content = article.localized.sl;
    const seo = buildArticleSeo(article, "sl");
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: content.description },
        { property: "og:title", content: content.title },
        { property: "og:description", content: content.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: seo.canonicalUrl },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: seo.canonicalUrl },
        {
          rel: "alternate",
          hrefLang: "sl",
          href: `https://nuvelistudio.com${articlePath(article, "sl")}`,
        },
        {
          rel: "alternate",
          hrefLang: "hr",
          href: `https://nuvelistudio.com${articlePath(article, "hr")}`,
        },
        {
          rel: "alternate",
          hrefLang: "en",
          href: `https://nuvelistudio.com${articlePath(article, "en")}`,
        },
        {
          rel: "alternate",
          hrefLang: "x-default",
          href: `https://nuvelistudio.com${articlePath(article, "sl")}`,
        },
      ],
      scripts: seo.scripts,
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { slug } = Route.useParams();
  const article = getArticleBySlug("sl", slug);
  if (!article)
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl">Vsebina ni najdena.</h1>
      </main>
    );
  return <AiSearchArticlePage article={article} locale="sl" />;
}
