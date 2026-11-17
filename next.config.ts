import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    formats: ["image/avif", "image/webp"],
    imageSizes: [32, 40, 64, 80, 96, 128, 168, 224],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Pin the root so stray lockfiles in parent folders aren't picked up as the workspace.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
