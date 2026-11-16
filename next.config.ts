import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build estático em out/: o app não tem backend e o Tauri empacota esses arquivos.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
