import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Sur Netlify : CONTEXT=production en prod, deploy-preview/branch-deploy sinon.
// On utilise URL en prod (domaine custom une fois configuré),
// DEPLOY_PRIME_URL pour les déploiements non-prod (canonical aligné sur l'URL réelle),
// fallback sur le domaine cible final pour le dev local.
const netlifyContext = process.env.CONTEXT;
const isProduction = netlifyContext === "production";
const siteUrl =
  (isProduction ? process.env.URL : process.env.DEPLOY_PRIME_URL) ||
  "https://hdm-menuiserie.fr";

export default defineConfig({
  site: siteUrl,
  integrations: [sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  vite: {
    build: { cssMinify: true },
  },
});
