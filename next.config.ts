import type { NextConfig } from 'next'
import locales from './src/locales.json'

// next.js config
const nextConfig: NextConfig = {
	reactStrictMode: true,
	i18n: {
		locales,
		defaultLocale: 'en',
		localeDetection: false,
	},
}

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
})

export default withPWA(nextConfig)
