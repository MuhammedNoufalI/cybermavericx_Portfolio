import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gRPC-based SDK: load from node_modules at runtime instead of bundling
  serverExternalPackages: ['@google-cloud/recaptcha-enterprise'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
