import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const withMT = require("@material-tailwind/react/utils/withMT");

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [react(), tailwindcss()],
});
