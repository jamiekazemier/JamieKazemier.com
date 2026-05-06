import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceRoot = path.join(root, "images");
const outputRoot = path.join(root, "public", "images");

const galleries = [
  {
    slug: "head-of-the-river",
    sourceDir: "head of the river",
    files: [
      "Untitled-6.jpg",
      "Untitled-30.jpg",
      "Untitled-31.jpg",
      "Untitled-32.jpg",
      "Untitled-33.jpg",
      "Untitled-92.jpg",
      "Untitled-93.jpg",
      "Untitled-94.jpg",
      "Untitled-95.jpg",
      "Untitled-96.jpg",
      "Untitled-101.jpg"
    ]
  },
  {
    slug: "herfstregatta",
    sourceDir: "Herfstregatta",
    files: [
      "IMG_2463.jpg",
      "IMG_2535.jpg",
      "IMG_3183.jpg",
      "IMG_4471.jpg",
      "IMG_4839.jpg",
      "IMG_5234.jpg",
      "IMG_6823.jpg",
      "IMG_7467.jpg",
      "IMG_7487.jpg",
      "IMG_8525.jpg",
      "IMG_8717.jpg",
      "IMG_8885.jpg"
    ]
  },
  {
    slug: "traika-tilburg",
    sourceDir: "traika tilburg",
    files: [
      "IMG_7495.jpg",
      "IMG_7498.jpg",
      "IMG_7503.jpg",
      "IMG_7537.jpg",
      "IMG_7542.jpg",
      "IMG_7545.jpg",
      "IMG_7941.jpg",
      "IMG_8046.jpg",
      "IMG_8056.jpg",
      "IMG_8152.jpg"
    ]
  }
];

async function ensureCleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

const responsiveWidths = [640, 960, 1400, 1800, 2200];

async function writeFormatSet(image, outputBase) {
  await image.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(`${outputBase}.jpg`);
  await image.clone().webp({ quality: 78 }).toFile(`${outputBase}.webp`);
  await image.clone().avif({ quality: 55 }).toFile(`${outputBase}.avif`);
}

async function writeFormats(inputPath, outputBase, width = 1800) {
  const baseImage = sharp(inputPath).rotate();
  const full = baseImage.clone().resize({ width, withoutEnlargement: true });

  await writeFormatSet(full, outputBase);

  for (const responsiveWidth of responsiveWidths.filter((candidate) => candidate < width)) {
    const resized = baseImage.clone().resize({ width: responsiveWidth, withoutEnlargement: true });
    await writeFormatSet(resized, `${outputBase}-${responsiveWidth}`);
  }
}

await ensureCleanDir(outputRoot);

await writeFormats(path.join(sourceRoot, "hero.jpg"), path.join(outputRoot, "hero"), 2200);

for (const gallery of galleries) {
  const outDir = path.join(outputRoot, "galleries", gallery.slug);
  await fs.mkdir(outDir, { recursive: true });

  for (const [index, file] of gallery.files.entries()) {
    const number = String(index + 1).padStart(2, "0");
    const input = path.join(sourceRoot, "galleries", gallery.sourceDir, file);
    await writeFormats(input, path.join(outDir, number), 1800);
  }
}

console.log("Prepared optimized rowing image assets in public/images.");
