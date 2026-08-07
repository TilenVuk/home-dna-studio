module.exports = {
  ci: {
    collect: {
      url: [
        "https://nuvelistudio.com/",
        "https://nuvelistudio.com/home-dna",
      ],
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        "categories:seo": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:performance": ["warn", { minScore: 0.75 }],

        "document-title": "error",
        "meta-description": "error",
        canonical: "error",
        "robots-txt": "error",
        "is-crawlable": "error",
        "http-status-code": "error",
        viewport: "error",
      },
    },
  },
};
