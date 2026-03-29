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
  integrations: [react(), mdx(), ...(noIndex ? [] : [sitemap()])],
});
