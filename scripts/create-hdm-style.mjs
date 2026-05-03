// Crée OU met à jour un style Mapbox Studio personnalisé "HDM Zone".
//
// Usage :
//   - Création : MAPBOX_SECRET_TOKEN=sk.xxx node scripts/create-hdm-style.mjs
//   - Update   : MAPBOX_SECRET_TOKEN=sk.xxx STYLE_ID=cmop... node scripts/create-hdm-style.mjs

const TOKEN = process.env.MAPBOX_SECRET_TOKEN;
const STYLE_ID = process.env.STYLE_ID;
if (!TOKEN || !TOKEN.startsWith("sk.")) {
  console.error("Manque MAPBOX_SECRET_TOKEN (sk.*) avec scope styles:write");
  process.exit(1);
}

const username = JSON.parse(
  Buffer.from(TOKEN.split(".")[1], "base64").toString()
).u;
console.log(`Username Mapbox : ${username}`);

// Toujours repartir de dark-v11 (clean state)
const baseStyle = await (
  await fetch(
    `https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=${TOKEN}`
  )
).json();
console.log(`Base dark-v11 chargée : ${baseStyle.layers.length} layers`);

const HDM = {
  charbon: "#1a1210",
  brunFonce: "#2a1f1c",
  brun: "#503c32",
  bois: "#8b5e3c",
  boisClair: "#c4956a",
  rouge: "#bf1b2c",
  creme: "#f7f2ea",
  cremeFonce: "#ede6d8",
  gris: "#6b6259",
};

// Matchers explicites identifiés depuis l'inspection de la structure dark-v11
const HIDE_LABELS = new Set([
  "road-label-simple",
  "waterway-label",
  "water-line-label",
  "water-point-label",
  "natural-line-label",
  "natural-point-label",
  "poi-label",
  "airport-label",
  "transit-label",
  "settlement-subdivision-label",
  "country-label",
  "continent-label",
  "state-label",
]);

const SHOW_CITY_LABELS = new Set([
  "settlement-major-label",
  "settlement-minor-label",
]);

const HIDE_LAYERS = new Set([
  "building",
  "admin-1-boundary-bg",
  "admin-0-boundary-bg",
  "admin-1-boundary",
  "admin-0-boundary",
  "admin-0-boundary-disputed",
  "land-structure-line",
  "land-structure-polygon",
  "aeroway-polygon",
  "aeroway-line",
]);

let patched = 0;
const setPaint = (l, k, v) => {
  if (!l.paint) l.paint = {};
  l.paint[k] = v;
  patched++;
};

for (const layer of baseStyle.layers) {
  const id = layer.id;
  const t = layer.type;

  // Cacher complètement
  if (HIDE_LAYERS.has(id)) {
    if (t === "fill") setPaint(layer, "fill-opacity", 0);
    if (t === "line") setPaint(layer, "line-opacity", 0);
    continue;
  }

  // Background → charbon HDM
  if (id === "land" || t === "background") {
    setPaint(layer, "background-color", HDM.charbon);
    continue;
  }

  // Eau (Rhône, lacs) → brun marqué
  if (id === "water") {
    setPaint(layer, "fill-color", HDM.brun);
    setPaint(layer, "fill-opacity", 0.95);
    continue;
  }
  if (id === "waterway") {
    setPaint(layer, "line-color", HDM.brun);
    setPaint(layer, "line-opacity", 0.85);
    continue;
  }

  // Parcs / espaces verts → ton très subtil
  if (id === "national-park" || id === "landuse") {
    setPaint(layer, "fill-color", HDM.brunFonce);
    setPaint(layer, "fill-opacity", 0.5);
    continue;
  }

  // Routes principales (road-simple porte la hiérarchie via data-driven)
  // → on remplace par bois-clair lumineux pour qu'elles ressortent vraiment
  if (id === "road-simple" || id === "bridge-simple") {
    setPaint(layer, "line-color", HDM.boisClair);
    setPaint(layer, "line-opacity", 0.9);
    continue;
  }
  if (id === "tunnel-simple") {
    setPaint(layer, "line-color", HDM.boisClair);
    setPaint(layer, "line-opacity", 0.55);
    continue;
  }
  // Variantes de routes secondaires
  if (
    id.startsWith("road-") ||
    id.startsWith("bridge-") ||
    id.startsWith("tunnel-")
  ) {
    if (t === "line") {
      setPaint(layer, "line-color", HDM.bois);
      setPaint(layer, "line-opacity", 0.4);
    }
    continue;
  }

  // Labels de villes principales → crème lisible avec halo charbon
  if (SHOW_CITY_LABELS.has(id)) {
    setPaint(layer, "text-color", HDM.creme);
    setPaint(layer, "text-halo-color", HDM.charbon);
    setPaint(layer, "text-halo-width", 1.6);
    setPaint(layer, "text-halo-blur", 0.5);
    setPaint(layer, "icon-opacity", 0);
    continue;
  }

  // Tous les autres labels (POI, routes, transit…) → masqués
  if (t === "symbol" || HIDE_LABELS.has(id)) {
    setPaint(layer, "text-opacity", 0);
    setPaint(layer, "icon-opacity", 0);
    continue;
  }
}

console.log(`${patched} propriétés peintes/masquées`);

// Préparation payload
const payload = {
  ...baseStyle,
  name: "HDM Zone",
  metadata: {
    ...(baseStyle.metadata || {}),
    "mapbox:origin": "dark-v11-patched-hdm",
    "mapbox:autocomposite": true,
  },
};
delete payload.id;
delete payload.created;
delete payload.modified;
delete payload.owner;
delete payload.visibility;
delete payload.draft;

const url = STYLE_ID
  ? `https://api.mapbox.com/styles/v1/${username}/${STYLE_ID}?access_token=${TOKEN}`
  : `https://api.mapbox.com/styles/v1/${username}?access_token=${TOKEN}`;
const method = STYLE_ID ? "PATCH" : "POST";
console.log(`${method} ${STYLE_ID || "(nouveau)"}…`);

const res = await fetch(url, {
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const out = await res.json();
if (!res.ok) {
  console.error("Erreur API :", res.status, out);
  process.exit(1);
}

console.log("\n✓ OK");
console.log(`  Style ID : ${out.id}`);
console.log(`  Reference : ${out.owner}/${out.id}`);
