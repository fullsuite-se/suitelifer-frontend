import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import withMT from "@material-tailwind/react/utils/withMT";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      // remove this on production
      selfDestroying: true,
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: "Suitelifer",
        short_name: "Suitelifer",
        description:
          "Suitelifer is a streamlined platform for job applications and employee engagement at FullSuite. It automates hiring, document submissions, and communication while providing training, company updates, and event management—all in one secure and scalable system.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/app/blogs-feed",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
