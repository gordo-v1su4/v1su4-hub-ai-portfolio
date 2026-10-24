import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  build: {
    rollupOptions: {
      // Alternate 1 ships beside the main site at /alternate1.
      input: { main: "index.html", alternate1: "alternate1.html" },
    },
  },
});
