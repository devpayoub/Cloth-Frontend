import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The pnpm workspace root is the parent folder (frontend + backend).
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  images: {
    // Medusa-served images (uploaded site content lives on the backend).
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
