export type GalleryCat =
  | "agencement"
  | "intérieur"
  | "fabrication"
  | "rénovation";

export type GalleryItem = {
  src: string;
  alt: string;
  cat: GalleryCat;
  titre: string;
  lieu: string;
};

export const galleryItems: GalleryItem[] = [
  {
    src: "/images/gallery/meuble-tv-noyer.jpg",
    alt: "Meuble TV sur mesure en lattes de noyer réalisé par HDM Menuiserie à Givors",
    cat: "fabrication",
    titre: "Meuble TV — lattes noyer",
    lieu: "Givors",
  },
  {
    src: "/images/gallery/cuisine-chene.jpg",
    alt: "Cuisine avec étagères ouvertes en chêne sur mesure — HDM Menuiserie Chasse-sur-Rhône",
    cat: "agencement",
    titre: "Cuisine chêne ouverte",
    lieu: "Chasse-sur-Rhône",
  },
  {
    src: "/images/gallery/habillage-mural.jpg",
    alt: "Habillage mural bois et cheminée encastrée — menuiserie intérieure à Vienne",
    cat: "intérieur",
    titre: "Habillage mural bois & cheminée",
    lieu: "Vienne",
  },
  {
    src: "/images/gallery/escalier-chene-metal.jpg",
    alt: "Escalier suspendu chêne et métal avec éclairage LED — HDM Menuiserie Loire sur Rhône",
    cat: "intérieur",
    titre: "Escalier chêne & métal suspendu",
    lieu: "Loire sur Rhône",
  },
  {
    src: "/images/gallery/boite-noyer.jpg",
    alt: "Boîte de rangement en noyer massif fabriquée en atelier HDM Menuiserie",
    cat: "fabrication",
    titre: "Boîte noyer — pièce unique",
    lieu: "Atelier HDM",
  },
  {
    src: "/images/gallery/cuisine-ilot.jpg",
    alt: "Cuisine avec îlot central bois massif sur mesure — menuisier Grigny Rhône",
    cat: "agencement",
    titre: "Cuisine avec îlot bois massif",
    lieu: "Grigny",
  },
  {
    src: "/images/gallery/escalier-pose.jpg",
    alt: "Escalier en cours de pose par Hugo Di Murro — menuisier Saint-Symphorien-d'Ozon",
    cat: "rénovation",
    titre: "Escalier en cours de pose",
    lieu: "Saint-Symphorien",
  },
  {
    src: "/images/gallery/trace-artisan.jpg",
    alt: "Artisan menuisier traçant une pièce en bois dans l'atelier HDM à Givors",
    cat: "fabrication",
    titre: "Précision de tracé & découpe",
    lieu: "Atelier HDM",
  },
  {
    src: "/images/gallery/escalier-dessous.jpg",
    alt: "Vue dessous d'un escalier flottant chêne réalisé par HDM Menuiserie Vienne",
    cat: "intérieur",
    titre: "Escalier flottant — vue dessous",
    lieu: "Vienne",
  },
];

export const galleryFilters: { key: "tous" | GalleryCat; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "intérieur", label: "Intérieur" },
  { key: "agencement", label: "Agencement" },
  { key: "fabrication", label: "Fabrication" },
  { key: "rénovation", label: "Rénovation" },
];
