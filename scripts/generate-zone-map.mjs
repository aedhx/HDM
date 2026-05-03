// Génère src/assets/images/zone-map.png via Mapbox Static API.
// Exécuté manuellement (pas en build CI) — l'image est commit dans le repo.
// Usage : node --env-file=.env scripts/generate-zone-map.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const TOKEN = process.env.MAPBOX_TOKEN;
if (!TOKEN) {
  console.error("Manque MAPBOX_TOKEN — `node --env-file=.env scripts/generate-zone-map.mjs`");
  process.exit(1);
}

// Centré sur Givors. Pas de pins sur les autres villes : on veut que la carte
// communique un *périmètre d'intervention*, pas une liste finie de chantiers.
// La liste de villes affichée à côté de la carte reste la référence textuelle.
const center = { lat: 45.5765, lon: 4.7891 };
const RADIUS_KM = 30;

// Cercle ~30 km sous forme de polygone GeoJSON (64 segments).
function circleFeature(lat, lon, radiusKm, points = 96, props = {}) {
  const earthRadius = 6371;
  const coords = [];
  const cosLat = Math.cos((lat * Math.PI) / 180);
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dLat = ((radiusKm * Math.sin(angle)) / earthRadius) * (180 / Math.PI);
    const dLon =
      ((radiusKm * Math.cos(angle)) / earthRadius) * (180 / Math.PI) / cosLat;
    coords.push([lon + dLon, lat + dLat]);
  }
  return {
    type: "Feature",
    properties: props,
    geometry: { type: "Polygon", coordinates: [coords] },
  };
}

// Cercle 30 km : remplissage rouge transparent + contour bois-clair plus marqué.
const ringOuter = circleFeature(center.lat, center.lon, RADIUS_KM, 96, {
  stroke: "#C4956A",
  "stroke-width": 3,
  "stroke-opacity": 0.85,
  fill: "#BF1B2C",
  "fill-opacity": 0.1,
});

// Pin Givors uniquement : signal "centre", pas une liste finie.
const overlays = [];
overlays.push(`geojson(${encodeURIComponent(JSON.stringify(ringOuter))})`);
overlays.push(`pin-l-circle+BF1B2C(${center.lon},${center.lat})`);

// Style HDM custom (créé via scripts/create-hdm-style.mjs sur le compte adx-hdm).
// Patch de mapbox/dark-v11 aux couleurs charte : charbon, brun, bois-clair, crème.
const style = "adx-hdm/cmopnzcve006v01so8fqsfnqi";
const W = 1200;
const H = 675; // ratio 16:9
const ZOOM = 9.4; // cadrage tel que le cercle 30 km tient bien à l'écran
const BEARING = 0;
const PITCH = 0;

// Cache-buster pour forcer un nouveau rendu après une update du style.
const cacheBust = Date.now();
const url =
  `https://api.mapbox.com/styles/v1/${style}/static/` +
  `${overlays.join(",")}/` +
  `${center.lon},${center.lat},${ZOOM},${BEARING},${PITCH}/` +
  `${W}x${H}@2x` +
  `?access_token=${TOKEN}&logo=false&attribution=false&fresh=true&_=${cacheBust}`;

console.log(`URL length: ${url.length} chars`);
console.log("Fetching map…");

const res = await fetch(url);
if (!res.ok) {
  console.error(`Mapbox HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
const out = join(ROOT, "src/assets/images/zone-map.png");
await writeFile(out, buf);

console.log(`Generated ${out} (${(buf.length / 1024).toFixed(1)} KB, ${W * 2}×${H * 2})`);
