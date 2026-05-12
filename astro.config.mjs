// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },

  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['gpt.kidiepie.web.id']
    },
    preview: {
      allowedHosts: ['gpt.kidiepie.web.id']
    }
  },

  adapter: node({
    mode: 'standalone'
  })
});