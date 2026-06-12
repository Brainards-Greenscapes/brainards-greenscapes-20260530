import Image from "@11ty/eleventy-img";

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

  // Responsive image shortcode
  // Usage: {% image "src/assets/images/photo.webp", "Alt text", "class-names", "eager" %}
  eleventyConfig.addShortcode("image", async function (src, alt, classes = "", loading = "lazy") {
    if (!alt) {
      throw new Error(`Missing alt text for image: ${src}`);
    }

    let metadata = await Image(src, {
      widths: [400, 800, 1200],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
      filenameFormat: function (id, src, width, format) {
        const name = src.split("/").pop().split(".")[0];
        return `${name}-${width}w.${format}`;
      },
    });

    let imageAttributes = {
      alt,
      sizes: "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 600px",
      loading,
      decoding: loading === "eager" ? "sync" : "async",
      class: classes,
    };

    return Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline",
    });
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/js");

  // Cloudflare Pages config files
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

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
