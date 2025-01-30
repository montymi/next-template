import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development",
});

// next.js config
const nextConfig: NextConfig = {
  reactStrictMode: false,
  i18n: {
      locales: ['en', 'de'],
      defaultLocale: 'en',
  },
};

module.exports = withPWA(nextConfig);
