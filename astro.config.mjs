import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hdm-menuiserie.fr",
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
