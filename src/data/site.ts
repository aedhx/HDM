export const site = {
  domain: "hdm-menuiserie.fr",
  url: "https://hdm-menuiserie.fr",
  name: "HDM Hugo Di Murro Menuiserie",
  shortName: "HDM Menuiserie",
  city: "Givors",
  postalCode: "69700",
  region: "Auvergne-Rhône-Alpes",
  country: "FR",
  geo: { lat: 45.5901, lng: 4.7698 },

  // TODO: remplacer par le vrai numéro d'Hugo (format E.164 avec +33)
  phone: "+33600000000",
  // TODO: remplacer par le vrai numéro WhatsApp (chiffres uniquement, sans + ni 0 initial)
  whatsappNumber: "33600000000",
  whatsappMessage:
    "Bonjour Hugo, je souhaite un devis pour un projet de menuiserie.",

  email: "hugo@hdm-menuiserie.fr",

  instagram: {
    handle: "hdmmenuiserie",
    url: "https://www.instagram.com/hdmmenuiserie/",
  },

  // TODO: ajouter URL Pages Jaunes après inscription
  pagesJaunes: "",

  // TODO: ajouter Place ID Google Business + URL embed iframe Maps
  // Récupérer l'URL embed sur https://www.google.com/maps après avoir créé la fiche
  googleBusiness: {
    placeId: "",
    mapsEmbedUrl: "",
    profileUrl: "",
  },
} as const;

export const heroPhone = (): string => {
  // formate +33600000000 → 06 00 00 00 00 pour affichage
  const p = site.phone.replace(/^\+33/, "0");
  return p.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
};

export const whatsappLink = (msg: string = site.whatsappMessage): string =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
