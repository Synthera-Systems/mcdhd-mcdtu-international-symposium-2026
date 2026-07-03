import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Instruct the Next.js file tracer to explicitly bundle pg-cloudflare binaries
  outputFileTracingIncludes: {
    "**/*": [
      "./node_modules/pg-cloudflare/dist/**",
      "./node_modules/pg-cloudflare/esm/**",
    ],
  },
};

export default nextConfig;