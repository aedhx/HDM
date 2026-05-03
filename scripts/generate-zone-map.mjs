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

// Givors = centre. Coordonnées des villes du secteur.
const cities = {
  Givors: { lat: 45.5765, lon: 4.7891, main: true },
  Vienne: { lat: 45.5230, lon: 4.8742 },
  "Loire-sur-Rhône": { lat: 45.6014, lon: 4.7891 },
  Grigny: { lat: 45.6021, lon: 4.7882 },
  "Chasse-sur-Rhône": { lat: 45.5810, lon: 4.7956 },
  Ternay: { lat: 45.6113, lon: 4.8120 },
  "Saint-Symphorien-d'Ozon": { lat: 45.6346, lon: 4.8290 },
  Millery: { lat: 45.6420, lon: 4.7560 },
  "Chonas-l'Amballan": { lat: 45.4773, lon: 4.8425 },
  "Reventin-Vaugris": { lat: 45.4843, lon: 4.8421 },
};

const RADIUS_KM = 30;
const center = cities.Givors;

// Cercle ~30 km sous forme de polygone GeoJSON (64 segments).
function circleFeature(lat, lon, radiusKm, points = 64) {
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
    properties: {
      stroke: "#C4956A",
      "stroke-width": 2,
      "stroke-opacity": 0.7,
      fill: "#BF1B2C",
      "fill-opacity": 0.06,
    },
    geometry: { type: "Polygon", coordinates: [coords] },
  };
}

const circle = circleFeature(center.lat, center.lon, RADIUS_KM);

// Markers — pin-l (large) rouge pour Givors, pin-s (small) crème pour les autres.
const overlays = [];
overlays.push(`geojson(${encodeURIComponent(JSON.stringify(circle))})`);
overlays.push(`pin-l-circle+BF1B2C(${center.lon},${center.lat})`);
for (const [name, city] of Object.entries(cities)) {
  if (city.main) continue;
  overlays.push(`pin-s+C4956A(${city.lon},${city.lat})`);
}

// Style sombre pour matcher la section Zone (fond --noir).
const style = "mapbox/dark-v11";
const W = 1200;
const H = 675; // ratio 16:9
const ZOOM = 9.4; // cadrage tel que le cercle 30 km tient bien à l'écran
const BEARING = 0;
const PITCH = 0;

const url =
  `https://api.mapbox.com/styles/v1/${style}/static/` +
  `${overlays.join(",")}/` +
  `${center.lon},${center.lat},${ZOOM},${BEARING},${PITCH}/` +
  `${W}x${H}@2x` +
  `?access_token=${TOKEN}&logo=false&attribution=false`;

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
