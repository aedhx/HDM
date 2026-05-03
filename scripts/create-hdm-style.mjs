// Crée un style Mapbox Studio personnalisé "HDM Zone" aux couleurs de la charte.
// Méthode : fetch du style mapbox/dark-v11 comme base, patch des couleurs des
// principales couches (background, eau, routes, labels) vers la palette HDM,
// puis POST sur l'endpoint Styles API du compte de l'utilisateur.
//
// Prérequis : variable d'env MAPBOX_SECRET_TOKEN (sk.*) avec le scope
// "styles:write". Crée-le sur mapbox.com → Account → Tokens, scope unique
// styles:write, name "hdm-style-creation". Tu peux le révoquer après usage.
//
// Usage : MAPBOX_SECRET_TOKEN=sk.xxx node scripts/create-hdm-style.mjs

const TOKEN = process.env.MAPBOX_SECRET_TOKEN;
if (!TOKEN || !TOKEN.startsWith("sk.")) {
  console.error("Manque MAPBOX_SECRET_TOKEN (sk.*) avec scope styles:write");
  process.exit(1);
}

// Décode le username depuis le payload JWT du token
const username = JSON.parse(
  Buffer.from(TOKEN.split(".")[1], "base64").toString()
).u;
console.log(`Username Mapbox : ${username}`);

// 1. Fetch du style dark-v11 (en lecture publique, accessible avec sk. token)
const baseStyle = await (
  await fetch(
    `https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=${TOKEN}`
  )
).json();

if (!baseStyle.layers) {
  console.error("Échec du fetch dark-v11 :", baseStyle);
  process.exit(1);
}
console.log(`Base style chargé : ${baseStyle.layers.length} layers`);

// 2. Palette HDM
const HDM = {
  charbon: "#1a1210",
  brun: "#503c32",
  bois: "#8B5E3C",
  boisClair: "#C4956A",
  rouge: "#bf1b2c",
  creme: "#F7F2EA",
  cremeFonce: "#EDE6D8",
  blanc: "#FDFAF5",
  gris: "#6B6259",
};

// 3. Patch des layers — heuristique par id
const patchPaint = (layer, key, value) => {
  if (!layer.paint) layer.paint = {};
  layer.paint[key] = value;
};
const setOpacity = (layer, key, value) => patchPaint(layer, key, value);

for (const layer of baseStyle.layers) {
  const id = layer.id;
  const type = layer.type;

  // Fond global
  if (id === "background" || id === "land") {
    patchPaint(layer, "background-color", HDM.charbon);
    if (type === "fill") patchPaint(layer, "fill-color", HDM.charbon);
  }

  // Eau (Rhône, lacs)
  if (id.includes("water") || id === "water") {
    if (type === "fill") {
      patchPaint(layer, "fill-color", HDM.brun);
      patchPaint(layer, "fill-opacity", 0.85);
    }
  }

  // Parcs, espaces verts → ton brun chaud très subtil
  if (id.includes("landuse") || id.includes("park") || id.includes("national")) {
    if (type === "fill") patchPaint(layer, "fill-color", "#241915");
  }

  // Routes
  if (id.includes("road") || id.includes("highway") || id.includes("motorway")) {
    if (type === "line") {
      // Hiérarchie : majeures = bois-clair lumineux, secondaires = bois moyen
      if (id.includes("motorway") || id.includes("primary") || id.includes("trunk")) {
        patchPaint(layer, "line-color", HDM.boisClair);
        patchPaint(layer, "line-opacity", 0.9);
      } else if (id.includes("secondary") || id.includes("street-major")) {
        patchPaint(layer, "line-color", HDM.bois);
        patchPaint(layer, "line-opacity", 0.55);
      } else {
        patchPaint(layer, "line-color", HDM.bois);
        patchPaint(layer, "line-opacity", 0.25);
      }
    }
  }

  // Bâtiments → invisibles (la map doit être épurée)
  if (id.includes("building")) {
    patchPaint(layer, "fill-opacity", 0);
  }

  // Frontières administratives → très discrètes
  if (id.includes("admin") || id.includes("boundary")) {
    if (type === "line") {
      patchPaint(layer, "line-color", HDM.brun);
      patchPaint(layer, "line-opacity", 0.4);
    }
  }

  // Labels — villes principales en crème clair, le reste invisible
  if (type === "symbol") {
    if (
      id.includes("place-city") ||
      id.includes("settlement-major") ||
      id.includes("settlement-subdivision-label") ||
      id === "place-city-lg-n" ||
      id === "place-city-lg-s"
    ) {
      patchPaint(layer, "text-color", HDM.creme);
      patchPaint(layer, "text-halo-color", HDM.charbon);
      patchPaint(layer, "text-halo-width", 1.4);
    } else if (id.includes("place") || id.includes("settlement")) {
      patchPaint(layer, "text-color", HDM.cremeFonce);
      patchPaint(layer, "text-opacity", 0.45);
      patchPaint(layer, "text-halo-color", HDM.charbon);
    } else {
      // POI, road labels, transit, etc. → masqués
      patchPaint(layer, "text-opacity", 0);
      patchPaint(layer, "icon-opacity", 0);
    }
  }
}

// 4. Préparation du payload de création
const newStyle = {
  ...baseStyle,
  name: "HDM Zone",
  metadata: {
    ...(baseStyle.metadata || {}),
    "mapbox:origin": "dark-v11-patched-hdm",
    "mapbox:autocomposite": true,
  },
};
delete newStyle.id;
delete newStyle.created;
delete newStyle.modified;
delete newStyle.owner;
delete newStyle.visibility;
delete newStyle.draft;

// 5. POST sur l'API
console.log(`Création du style sur ${username}…`);
const res = await fetch(
  `https://api.mapbox.com/styles/v1/${username}?access_token=${TOKEN}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStyle),
  }
);

const out = await res.json();
if (!res.ok) {
  console.error("Erreur API :", res.status, out);
  process.exit(1);
}

console.log("\n✓ Style créé !");
console.log(`  ID      : ${out.id}`);
console.log(`  Owner   : ${out.owner}`);
console.log(`  URL     : mapbox://styles/${out.owner}/${out.id}`);
console.log(`  Reference (à coller dans generate-zone-map.mjs) :`);
console.log(`  const style = "${out.owner}/${out.id}";`);
