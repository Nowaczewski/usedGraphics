const fs = require("fs");
const path = require("path");

const siteUrl = "https://usedgraphics.com";

const rootDir = path.join(__dirname, "..");
const buildsPath = path.join(rootDir, "data", "builds.json");
const componentsPath = path.join(rootDir, "data", "components.json");
const sitemapPath = path.join(rootDir, "sitemap.xml");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createUrlBlock(loc, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <priority>${priority}</priority>
  </url>`;
}

const buildsData = readJson(buildsPath);
const componentsData = readJson(componentsPath);

const builds = buildsData.builds || [];
const components = componentsData.components || [];

const staticPages = [
  {
    loc: `${siteUrl}/`,
    priority: "1.00",
  },
  {
    loc: `${siteUrl}/builds.html`,
    priority: "0.90",
  },
  {
    loc: `${siteUrl}/components.html`,
    priority: "0.85",
  },
  {
    loc: `${siteUrl}/how-to-buy.html`,
    priority: "0.75",
  },
  {
    loc: `${siteUrl}/youtube.html`,
    priority: "0.70",
  },
  {
    loc: `${siteUrl}/contact.html`,
    priority: "0.65",
  },
  {
    loc: `${siteUrl}/contact-success.html`,
    priority: "0.20",
  },
];

const buildPages = builds
  .filter((build) => build.id)
  .map((build) => ({
    loc: `${siteUrl}/build-detail.html?id=${encodeURIComponent(build.id)}`,
    priority: "0.85",
  }));

const componentPages = components
  .filter((component) => component.id)
  .map((component) => ({
    loc: `${siteUrl}/component-detail.html?id=${encodeURIComponent(
      component.id,
    )}`,
    priority: "0.80",
  }));

const allPages = [...staticPages, ...buildPages, ...componentPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => createUrlBlock(page.loc, page.priority)).join("\n\n")}
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemap, "utf8");

console.log(`Sitemap generated with ${allPages.length} URLs.`);
