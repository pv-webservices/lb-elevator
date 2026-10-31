import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.lbelevators.com',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
