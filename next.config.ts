import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // Pin the root so stray lockfiles in parent folders aren't picked up as the workspace.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
