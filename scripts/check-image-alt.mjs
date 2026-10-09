// Fails the build when any prerendered page has an <img> with a missing or empty alt attribute.
// Next.js writes prerendered pages to .next/server/app; on Vercel the build adapter also places them in .vercel/output.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const roots = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [".next/server/app", ".vercel/output/static", ".vercel/output/functions"];

const files = new Set();
const perRoot = [];
for (const root of roots) {
  if (!existsSync(root)) {
    perRoot.push(`${root}: not present`);
    continue;
  }
  let count = 0;
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const stat = statSync(path);
      if (stat.isDirectory()) walk(path);
      else if (path.endsWith(".html")) {
        files.add(path);
        count++;
      }
    }
  })(root);
  perRoot.push(`${root}: ${count} pages`);
}

let images = 0;
const missing = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    images++;
    const match = tag.match(/\salt=(?:"([^"]*)"|'([^']*)')/i);
    const alt = match ? (match[1] ?? match[2] ?? "") : null;
    if (alt === null || alt.trim() === "") missing.push(`${file}: ${tag.slice(0, 160)}`);
  }
}

console.log(`check-image-alt: ${perRoot.join(" | ")}`);
console.log(`check-image-alt: ${images} images on ${files.size} prerendered pages`);
if (files.size === 0) {
  console.error("check-image-alt: no prerendered pages found, so nothing was checked");
  process.exit(1);
}
if (missing.length > 0) {
  console.error(`check-image-alt: ${missing.length} image(s) have a missing or empty alt:\n${missing.join("\n")}`);
  process.exit(1);
}
