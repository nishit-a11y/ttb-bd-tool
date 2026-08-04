/**
 * compress-assets.js
 * One-time script: converts all .jpg and .png assets to WebP (quality 78).
 * Originals are kept untouched — only .webp siblings are added.
 * Run: node compress-assets.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ASSET_DIR = path.join(__dirname, "public", "assets");
const QUALITY = 78;

function getAllImages(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllImages(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function compress() {
  const images = getAllImages(ASSET_DIR);
  console.log(`Found ${images.length} images to convert.\n`);

  let saved = 0;
  let totalOriginal = 0;
  let totalWebP = 0;

  for (const src of images) {
    const dest = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    if (fs.existsSync(dest)) {
      console.log(`  SKIP (already exists): ${path.relative(ASSET_DIR, dest)}`);
      continue;
    }
    try {
      await sharp(src).webp({ quality: QUALITY }).toFile(dest);
      const origSize = fs.statSync(src).size;
      const webpSize = fs.statSync(dest).size;
      const pct = Math.round((1 - webpSize / origSize) * 100);
      totalOriginal += origSize;
      totalWebP += webpSize;
      saved++;
      console.log(
        `  OK  ${path.relative(ASSET_DIR, src).padEnd(55)} ${(origSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB  (-${pct}%)`
      );
    } catch (err) {
      console.error(`  ERR ${src}: ${err.message}`);
    }
  }

  console.log(`\n✓ Converted ${saved} files`);
  console.log(
    `  Total original : ${(totalOriginal / 1024).toFixed(1)} KB`
  );
  console.log(
    `  Total WebP     : ${(totalWebP / 1024).toFixed(1)} KB`
  );
  console.log(
    `  Saved          : ${((totalOriginal - totalWebP) / 1024).toFixed(1)} KB  (${Math.round((1 - totalWebP / totalOriginal) * 100)}%)`
  );
}

compress().catch(console.error);
