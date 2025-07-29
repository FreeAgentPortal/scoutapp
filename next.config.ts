import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Try the standard approach first
    domains: [
      "res.cloudinary.com",
      "api.thefreeagentportal.com",
      "thefreeagentportal.com",
      // Add specific domains you know about
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // If the above doesn't work, uncomment the custom loader below:
    // loader: 'custom',
    // loaderFile: './src/utils/customImageLoader.ts',

    // Image optimization settings
    minimumCacheTTL: 60,
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || "http://localhost:5000/api/v1",
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "asdf234as2342asdf2i;lk342342;$23423",
  },
};

export default nextConfig;
