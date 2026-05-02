export type Service = {
  icon: "door" | "window" | "layers" | "tool" | "box" | "quote";
  name: string;
  desc: string;
  items: string[];
};

export const services: Service[] = [
  {
    icon: "door",
    name: "Menuiserie<br>intérieure",
    desc: "Portes, cloisons, placards et escaliers fabriqués sur mesure pour s'adapter parfaitement à votre espace.",
    items: [
      "Portes & huisseries",
      "Escaliers bois",
      "Placards & dressings",
      "Cloisons & boiseries",
    ],
  },
  {
    icon: "window",
    name: "Menuiserie<br>extérieure",
    desc: "Fenêtres, volets et portails : isolation thermique et sécurité renforcées, esthétique soignée.",
    items: [
      "Fenêtres double / triple vitrage",
      "Volets battants & coulissants",
      "Portails & clôtures bois",
      "Véranda & pergola",
    ],
  },
  {
    icon: "layers",
    name: "Agencement<br>sur mesure",
    desc: "Mobilier et rangements fabriqués à la mesure exacte de votre intérieur. Cuisine, bureau, bibliothèque.",
    items: [
      "Cuisine sur mesure",
      "Dressing & rangements",
      "Bibliothèques & étagères",
      "Bureau & mobilier",
    ],
  },
  {
    icon: "tool",
    name: "Rénovation<br>& restauration",
    desc: "Redonner vie à vos sols, parquets et boiseries existants. Ponçage, vitrification, remplacement.",
    items: [
      "Parquet massif & flottant",
      "Bardage & terrasse bois",
      "Réparation menuiseries",
      "Traitement & finition bois",
    ],
  },
  {
    icon: "box",
    name: "Fabrication<br>atelier",
    desc: "Pièces uniques réalisées en atelier selon vos plans ou vos idées. Du prototype à la pièce finie.",
    items: [
      "Meubles uniques",
      "Déco & objets bois",
      "Habillage mural",
      "Pièces architecturales",
    ],
  },
];
