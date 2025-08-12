import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack handles PostCSS automatically
  // No additional configuration needed
  
  // Configure allowed image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        port: '',
        pathname: '/logos/**',
      },
    ],
  },
};

export default nextConfig;
