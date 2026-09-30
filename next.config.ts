import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The pnpm workspace root is the parent folder (frontend + backend).
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
