import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Isse Cloudinary ke saare images allowed ho jayenge
      },
    ],
  },
};

export default nextConfig;