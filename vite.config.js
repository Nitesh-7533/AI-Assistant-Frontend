import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
   preview: {
    host: true,
    port: 10000,
    allowedHosts: ["ai-assistant-frontend-9qg8.onrender.com"]
  }
});
