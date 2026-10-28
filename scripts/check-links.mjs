// Build-time internal link checker. Runs after Eleventy in `npm run build`.
// Fails the build (exit 1) if any page in _site links to an internal URL
// that doesn't exist, or to a #fragment that has no matching id.
// That stops the deploy, so a broken link never reaches production.
//
// Links to old URLs covered by src/_redirects also fail. Pages should link
// straight to the real page, not lean on a redirect.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SITE = process.argv[2] || "_site";
const HOSTS = ["https://www.brainardsgreenscapes.com", "https://brainardsgreenscapes.com"];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}

// Map a URL path to the file Cloudflare Pages would serve, or null.
function resolve(path) {
  let clean = decodeURIComponent(path);
  const candidates = clean.endsWith("/")
    ? [join(SITE, clean, "index.html")]
    : [join(SITE, clean), join(SITE, clean + ".html"), join(SITE, clean, "index.html")];
  // eleventy-img always writes to _site/img/ (hardcoded outputDir), even when
  // Eleventy builds elsewhere, so fall back to _site for /img/ paths.
  if (SITE !== "_site" && clean.startsWith("/img/")) candidates.push(join("_site", clean));
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) || null;
}

const idCache = new Map();
function ids(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    const set = new Set();
    for (const m of html.matchAll(/\s(?:id|name)\s*=\s*["']([^"']+)["']/g)) set.add(m[1]);
    idCache.set(file, set);
  }
  return idCache.get(file);
}

const problems = [];
const pages = walk(SITE);
for (const file of pages) {
  const html = readFileSync(file, "utf8")
    .replace(/<script[\s\S]*?<\/script>/gi, "")   // skip JS strings
    .replace(/<!--[\s\S]*?-->/g, "");             // skip comments
  const pageUrl = "/" + relative(SITE, file).replace(/index\.html$/, "").replace(/\\/g, "/");
  for (const m of html.matchAll(/<(a|link|img|source|script)\b[^>]*?\s(href|src)\s*=\s*["']([^"']+)["']/gi)) {
    let url = m[3].trim();
    for (const h of HOSTS) if (url.startsWith(h)) url = url.slice(h.length) || "/";
    if (/^(mailto:|tel:|sms:|javascript:|data:|https?:|\/\/)/i.test(url)) continue;
    if (!url.startsWith("/") && !url.startsWith("#")) continue; // relative links: none on this site
    let [path, frag] = url.split("#");
    path = path.split("?")[0];
    const target = path ? resolve(path) : file;
    if (!target) { problems.push(`${pageUrl}  ->  ${url}   (page not found)`); continue; }
    if (frag && m[1].toLowerCase() === "a" && target.endsWith(".html") && !ids(target).has(decodeURIComponent(frag)))
      problems.push(`${pageUrl}  ->  ${url}   (no element with id="${frag}")`);
  }
}

if (problems.length) {
  console.error(`\n✗ Link check FAILED: ${problems.length} broken internal link(s):\n`);
  for (const p of [...new Set(problems)]) console.error("  " + p);
  console.error("\nFix the links in src/ (link to the real page, not an old/redirected URL).\n");
  process.exit(1);
}
console.log(`✓ Link check passed: ${pages.length} pages, no broken internal links.`);
