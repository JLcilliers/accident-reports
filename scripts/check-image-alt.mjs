// Fails the build when any prerendered page has an <img> with a missing or empty alt attribute.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".next/server/app";
if (!existsSync(root)) {
  console.error(`check-image-alt: ${root} not found; run next build first`);
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".html")) files.push(path);
  }
})(root);

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

console.log(`check-image-alt: ${images} images on ${files.length} prerendered pages`);
if (missing.length > 0) {
  console.error(`check-image-alt: ${missing.length} image(s) have a missing or empty alt:\n${missing.join("\n")}`);
  process.exit(1);
}
