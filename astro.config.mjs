import { defineConfig } from "astro/config";

const base = process.env.SITE_BASE ?? "/";

export default defineConfig({
  base,
  site: "https://jamiekazemier.com",
  output: "static",
  trailingSlash: "always"
});
