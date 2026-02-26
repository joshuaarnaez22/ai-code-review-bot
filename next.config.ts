import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow dev tunnel origins (e.g. VS Code port forwarding, ngrok).
      // Set ALLOWED_ORIGINS=host1,host2 in .env.local — no protocol, no trailing slash.
      allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
        : [],
    },
  },
};

export default nextConfig;
