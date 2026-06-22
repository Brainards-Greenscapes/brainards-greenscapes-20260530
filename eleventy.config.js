import Image from "@11ty/eleventy-img";
import markdownItAnchor from "markdown-it-anchor";

// Build timestamp for cache-busting static assets
const buildTime = Date.now();

export default function (eleventyConfig) {
  // Cache-bust filter — appends ?v=<timestamp> to asset URLs
  eleventyConfig.addFilter("cacheBust", function (url) {
    return `${url}?v=${buildTime}`;
  });
  // Date filter for copyright year and blog dates
  eleventyConfig.addFilter("date", function (value, format) {
    const d = value === "now" ? new Date() : new Date(value);
    if (format === "Y") return d.getFullYear().toString();
    if (format === "iso") return d.toISOString().split("T")[0];
    if (format === "readable") {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return d.toLocaleDateString();
  });

  // Blog collection — all files tagged "blog", sorted by date
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByTag("blog").sort((a, b) => a.date - b.date);
  });

  // JSON stringify filter for JSON-LD
  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  // BreadcrumbList JSON-LD generator
  // Takes page.url and site.url, returns a full <script> block (or empty string for homepage)
  eleventyConfig.addFilter("breadcrumbJsonLd", function (pageUrl, siteUrl) {
    // Skip homepage — it IS the root, no breadcrumb needed
    if (!pageUrl || pageUrl === "/") return "";

    // Slug → readable name mapping for known segments
    const nameMap = {
      "services": "Services",
      "drainage": "Drainage",
      "service-areas": "Service Areas",
      "portfolio": "Portfolio",
      "about": "About",
      "contact": "Contact",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "blog": "Blog",
      "landscape-design": "Landscape Design",
      "landscaping": "Landscaping",
      "hardscaping": "Hardscaping",
      "irrigation": "Irrigation",
      "landscape-maintenance": "Landscape Maintenance",
      "xeriscaping": "Xeriscaping",
      "artificial-turf": "Artificial Turf",
      "sod-installation": "Sod Installation",
      "planting-gardening": "Planting & Gardening",
      "raised-garden-beds": "Raised Garden Beds",
      "gravel-rock": "Gravel & Decorative Rock",
      "turf-cleaning": "Turf Cleaning",
      "patios": "Patios",
      "walkways": "Walkways",
      "driveways": "Driveways",
      "pavers": "Pavers",
      "stone-borders": "Stone Borders",
      "retaining-walls": "Retaining Walls",
      "sprinkler-systems": "Sprinkler Systems",
      "sprinkler-repair": "Sprinkler Repair",
      "drip-irrigation": "Drip Irrigation",
      "smart-controllers": "Smart Controllers",
      "french-drains": "French Drains",
      "erosion-control": "Erosion Control",
      "stormwater-mitigation": "Stormwater Mitigation",
      "seasonal-tune-ups": "Seasonal Tune-Ups",
      "thank-you": "Thank You",
      // Service area slugs
      "las-cruces-nm": "Las Cruces, NM",
      "mesilla-nm": "Mesilla, NM",
      "mesilla-park-nm": "Mesilla Park, NM",
      "dona-ana-nm": "Doña Ana, NM",
      "organ-nm": "Organ, NM",
      "anthony-nm": "Anthony, NM",
      "sunland-park-nm": "Sunland Park, NM",
      "picacho-hills-nm": "Picacho Hills, NM",
      "sonoma-ranch-nm": "Sonoma Ranch, NM",
      "east-mesa-nm": "East Mesa, NM",
      "las-alturas-nm": "Las Alturas, NM",
      "talavera-nm": "Talavera, NM",
      "university-hills-nm": "University Hills, NM",
      "dripping-springs-nm": "Dripping Springs, NM",
    };

    // Fallback: capitalize each word, replace hyphens with spaces
    function slugToName(slug) {
      if (nameMap[slug]) return nameMap[slug];
      return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }

    // Build path segments: "/services/landscaping/xeriscaping/" → ["services","landscaping","xeriscaping"]
    const segments = pageUrl.split("/").filter(Boolean);

    // Build items array — Home is always position 1
    const items = [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl + "/"
    }];

    let path = "";
    for (let i = 0; i < segments.length; i++) {
      path += "/" + segments[i];
      const entry = {
        "@type": "ListItem",
        "position": i + 2,
        "name": slugToName(segments[i])
      };
      // Last item = current page — no "item" URL per Google spec
      if (i < segments.length - 1) {
        entry.item = siteUrl + path + "/";
      }
      items.push(entry);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };

    return `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>`;
  });

  // Add anchor IDs to markdown headings (enables #hash links in blog posts)
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: false,
      slugify: (s) =>
        s
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
    });
  });

  // Responsive image shortcode
  // Usage: {% image "src/assets/images/photo.webp", "Alt text", "class-names", "eager", "high" %}
  eleventyConfig.addShortcode("image", async function (src, alt, classes = "", loading = "lazy", fetchpriority = "") {
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

    if (fetchpriority) {
      imageAttributes.fetchpriority = fetchpriority;
    }

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
