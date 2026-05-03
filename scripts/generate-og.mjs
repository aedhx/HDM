// Génère public/images/og-hdm.jpg (1200x630) à partir du logo et de la charte HDM
// Usage : node scripts/generate-og.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const W = 1200;
const H = 630;

const logoBuffer = await readFile(join(ROOT, "public/logo/HDM-LOGO.png"));
const logoMeta = await sharp(logoBuffer).metadata();
const logoTargetWidth = 360;
const logoTargetHeight = Math.round(
  (logoMeta.height / logoMeta.width) * logoTargetWidth
);
const logoResized = await sharp(logoBuffer)
  .resize(logoTargetWidth, logoTargetHeight, { fit: "contain" })
  .png()
  .toBuffer();

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDFAF5"/>
      <stop offset="100%" stop-color="#F7F2EA"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="${H - 12}" width="${W}" height="12" fill="#BF1B2C"/>
  <text x="80" y="155" font-family="-apple-system, system-ui, sans-serif"
        font-size="20" font-weight="500" fill="#BF1B2C"
        letter-spacing="4">HDM MENUISERIE</text>
  <line x1="80" y1="178" x2="200" y2="178" stroke="#BF1B2C" stroke-width="2"/>
  <text x="80" y="380" font-family="Georgia, 'Cormorant Garamond', serif"
        font-size="76" font-weight="300" fill="#503C32"
        font-style="italic">Le bois, façonné</text>
  <text x="80" y="460" font-family="Georgia, 'Cormorant Garamond', serif"
        font-size="76" font-weight="300" fill="#503C32"
        font-style="italic">à votre image</text>
  <text x="80" y="520" font-family="-apple-system, system-ui, sans-serif"
        font-size="28" font-weight="500" fill="#BF1B2C"
        letter-spacing="3">MENUISIER ARTISAN — GIVORS &amp; VIENNE</text>
  <text x="80" y="565" font-family="-apple-system, system-ui, sans-serif"
        font-size="18" font-weight="400" fill="#6B6259">
    hdm-menuiserie.fr · Devis gratuit, sans engagement
  </text>
</svg>
`;

const result = await sharp(Buffer.from(svg))
  .composite([
    {
      input: logoResized,
      top: 90,
      left: W - logoTargetWidth - 80,
    },
  ])
  .jpeg({ quality: 88, progressive: true })
  .toFile(join(ROOT, "public/images/og-hdm.jpg"));

console.log(`Generated public/images/og-hdm.jpg (${W}x${H})`);
console.log(`File size: ${result.size} bytes`);
