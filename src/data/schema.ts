import { site } from "./site";
import type { FaqItem } from "./faq";

const sameAs: string[] = [];
if (site.instagram.url) sameAs.push(site.instagram.url);
if (site.pagesJaunes) sameAs.push(site.pagesJaunes);
if (site.googleBusiness.profileUrl) sameAs.push(site.googleBusiness.profileUrl);

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  alternateName: site.shortName,
  description:
    "Artisan menuisier indépendant basé à Givors. Fabrication sur mesure, pose de fenêtres, agencement intérieur, rénovation bois. Devis gratuit sous 48h.",
  url: site.url,
  telephone: site.phone,
  email: site.email,
  logo: `${site.url}/logo/HDM-LOGO.png`,
  image: `${site.url}/images/og-hdm.jpg`,
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Virement, Chèque, Espèces",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    postalCode: site.postalCode,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  areaServed: [
    {
      "@type": "City",
      name: "Givors",
      sameAs: "https://www.wikidata.org/wiki/Q213547",
    },
    { "@type": "City", name: "Vienne" },
    { "@type": "City", name: "Loire sur Rhône" },
    { "@type": "City", name: "Grigny" },
    { "@type": "City", name: "Chasse-sur-Rhône" },
    { "@type": "City", name: "Ternay" },
    { "@type": "City", name: "Saint-Symphorien-d'Ozon" },
    { "@type": "City", name: "Millery" },
    { "@type": "City", name: "Chonas-l'Amballan" },
    { "@type": "City", name: "Reventin-Vaugris" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Prestations HDM Menuiserie",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Menuiserie intérieure",
          description: "Portes, escaliers, placards, cloisons sur mesure",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Menuiserie extérieure",
          description: "Fenêtres bois double vitrage, volets, portails",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Agencement sur mesure",
          description: "Cuisine, dressing, bibliothèque, bureau",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Rénovation bois",
          description:
            "Parquet, terrasse, bardage, restauration menuiseries",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Fabrication atelier",
          description: "Mobilier unique, pièces architecturales",
        },
      },
    ],
  },
  ...(sameAs.length > 0 ? { sameAs } : {}),
};

export const faqSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});
