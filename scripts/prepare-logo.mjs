// Prepares web-ready logo files from the official source artwork.
// The artwork itself is never redrawn: we only trim surrounding whitespace
// and convert the white background to transparency (luminance knockout),
// so the logo renders identically on light surfaces.
import sharp from "sharp";

const SRC = "assets/brand/darien-corporation-logo-source.jpg";

const { data, info } = await sharp(SRC).greyscale().raw().toBuffer({ resolveWithObject: true });

const { width, height } = info;
const THRESHOLD = 235; // treat near-white (JPEG noise) as background
let minX = width,
  minY = height,
  maxX = 0,
  maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (data[y * width + x] < THRESHOLD) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}
const pad = 2;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);
const w = Math.min(width, maxX + pad + 1) - left;
const h = Math.min(height, maxY + pad + 1) - top;

// Luminance -> alpha knockout. Pixel value g on white is reproduced exactly by
// black at alpha (255 - g) / 255 composited over white.
const out = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const g = data[(y + top) * width + (x + left)];
    const clean = g >= 250 ? 255 : g; // remove JPEG haze in the background
    const i = (y * w + x) * 4;
    out[i] = 0;
    out[i + 1] = 0;
    out[i + 2] = 0;
    out[i + 3] = 255 - clean;
  }
}

await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile("public/brand/darien-corporation-logo.png");

// Square app icon: the full logo, uncropped, centered on white with clear space.
const iconSize = 512;
const logoW = Math.round(iconSize * 0.84);
const logo = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .resize({ width: logoW })
  .png()
  .toBuffer();
await sharp({
  create: { width: iconSize, height: iconSize, channels: 4, background: "#ffffff" },
})
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toFile("app/icon.png");

console.log(`logo: ${w}x${h} (aspect ${(w / h).toFixed(4)})`);
