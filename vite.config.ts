import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  build: {
    rollupOptions: {
      input: { main: "index.html", glitch: "glitch.html", scope: "scope.html", sim: "sim.html", slit: "slit.html", redesign: "redesign.html" },
    },
  },
});
