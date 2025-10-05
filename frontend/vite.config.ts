import path from "node:path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./src/modules/common"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
      "@coordinates": path.resolve(__dirname, "./src/modules/coordinates"),
      "@events": path.resolve(__dirname, "./src/modules/events"),
      "@locations": path.resolve(__dirname, "./src/modules/locations"),
      "@persons": path.resolve(__dirname, "./src/modules/persons"),
      "@tickets": path.resolve(__dirname, "./src/modules/tickets"),
      "@users": path.resolve(__dirname, "./src/modules/users"),
      "@venues": path.resolve(__dirname, "./src/modules/venues"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
});
