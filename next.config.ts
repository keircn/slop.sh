import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic'
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      "~/": "./src/",
    },
    resolveExtensions: [".js", ".ts", ".jsx", ".tsx"]
  }
};

export default nextConfig;
