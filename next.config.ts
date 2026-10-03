import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The pnpm workspace root is the parent folder (frontend + backend).
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  images: {
    // Uploaded site content images live in Neon Object Storage.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "https", hostname: "storage.us-east-2.aws.neon.tech" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
