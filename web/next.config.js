const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack config for local dev
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, 'node_modules/tailwindcss'),
    },
  },

  // Allow external images (Clerk avatars, chain icons)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'images.clerk.dev' },
      { protocol: 'https', hostname: '*.walletconnect.com' },
    ],
  },

  // Suppress specific warnings in production build
  typescript: {
    // We handle types via custom declarations (recharts.d.ts)
    ignoreBuildErrors: false,
  },

  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;