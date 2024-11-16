import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  },
};

export default nextConfig;
