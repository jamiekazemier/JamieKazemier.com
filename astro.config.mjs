import { defineConfig } from "astro/config";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.SITE_BASE ?? (repositoryName ? `/${repositoryName}/` : "/");

export default defineConfig({
  base,
  output: "static",
  trailingSlash: "always"
});

