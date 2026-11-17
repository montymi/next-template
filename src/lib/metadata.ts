export function siteOrigin() {
	const host =
		process.env.NEXT_PUBLIC_SITE_URL ||
		process.env.VERCEL_PROJECT_PRODUCTION_URL ||
		process.env.VERCEL_URL
	return host
		? new URL(host.includes('://') ? host : `https://${host}`)
		: new URL('http://localhost:3000')
}
