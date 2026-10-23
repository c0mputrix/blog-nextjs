import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // O projeto não usa ESLint; evita aviso durante o build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
