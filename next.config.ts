import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env: {
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "asdf234as2342asdf2i;lk342342;$23423",
  },
};

export default nextConfig;
