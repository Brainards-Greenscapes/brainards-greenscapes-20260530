export default function (eleventyConfig) {
  // Date filter for copyright year
  eleventyConfig.addFilter("date", function (value, format) {
    const d = value === "now" ? new Date() : new Date(value);
    if (format === "Y") return d.getFullYear().toString();
    return d.toLocaleDateString();
  });

  // JSON stringify filter for JSON-LD
  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

  // Watch for changes in CSS (Tailwind recompile)
  eleventyConfig.addWatchTarget("src/assets/css/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
