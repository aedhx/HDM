import { site } from "./site";
import type { FaqItem } from "./faq";

// Liste extensible des profils externes vérifiés (signal d'autorité Google + IA)
// TODO: ajouter au fil des inscriptions :
//   - Google Business Profile (cf. site.googleBusiness.profileUrl)
//   - Pages Jaunes (cf. site.pagesJaunes)
//   - Houzz, Chambre des Métiers, Bing Places, Apple Maps Connect
const sameAs: string[] = [];
if (site.instagram.url) sameAs.push(site.instagram.url);
if (site.pagesJaunes) sameAs.push(site.pagesJaunes);
if (site.googleBusiness.profileUrl) sameAs.push(site.googleBusiness.profileUrl);

const personId = `${site.url}/#hugo`;
const businessId = `${site.url}/#business`;
const websiteId = `${site.url}/#website`;

export const personSchema = {
  "@type": "Person",
  "@id": personId,
  name: site.legal.director,
  givenName: "Hugo",
  familyName: "Di Murro",
  jobTitle: "Artisan menuisier",
  image: `${site.url}/images/hugo-portrait.jpg`,
  url: site.url,
  worksFor: { "@id": businessId },
  knowsAbout: [
    "Menuiserie bois",
    "Fabrication sur mesure",
    "Agencement intérieur",
    "Pose de fenêtres",
    "Escaliers bois",
    "Rénovation menuiseries",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    postalCode: site.postalCode,
    addressCountry: site.country,
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": websiteId,
  url: site.url,
  name: site.shortName,
  inLanguage: "fr-FR",
  publisher: { "@id": businessId },
};

export const localBusinessSchema = {
  "@type": "LocalBusiness",
  "@id": businessId,
  name: site.name,
  legalName: site.legalName,
  alternateName: site.shortName,
  description:
    "Artisan menuisier basé à Givors. Fabrication sur mesure, pose de fenêtres, agencement intérieur, rénovation bois. Devis gratuit sous 48h.",
  url: site.url,
  telephone: site.phone,
  email: site.email,
  logo: `${site.url}/logo/HDM-LOGO.png`,
  image: [
    `${site.url}/images/og-hdm.jpg`,
    `${site.url}/images/hugo-portrait.jpg`,
  ],
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Virement, Chèque, Espèces",
  vatID: site.legal.vatId,
  taxID: site.legal.siret,
  foundingDate: site.legal.foundedAt,
  founder: { "@id": personId },
  employee: { "@id": personId },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.street,
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
          description: "Parquet, terrasse, bardage, restauration menuiseries",
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
  "@type": "FAQPage",
  mainEntity: items.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const breadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

// Helper : construit un graphe Schema.org cohérent (tous les nœuds liés via @id)
export const buildGraph = (extras: object[] = []) => ({
  "@context": "https://schema.org",
  "@graph": [websiteSchema, localBusinessSchema, personSchema, ...extras],
});
