// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const noIndex = process.env.PUBLIC_NO_INDEX !== "false";

export default defineConfig({
  site: "https://www.solvantapay.com",
  output: "static",
  build: {
    inlineStylesheets: "always",
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4, chromaSubsampling: "4:2:0" },
      },
    },
  },
  integrations: [react(), mdx(), ...(noIndex ? [] : [sitemap()])],
});
