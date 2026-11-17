import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
const require = createRequire(import.meta.url)
const sharp = createRequire(require.resolve('next/package.json'))('sharp')
const site = JSON.parse(await readFile('src/config/site.json', 'utf8'))
const tokens = JSON.parse(
	await readFile('src/design-system/tokens.json', 'utf8'),
)
const { primary, primaryText, accent } = tokens.light
const escape = (value) =>
	value.replace(
		/[&<>"']/g,
		(c) =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&apos;',
			})[c],
	)
// Replace these neutral sail shapes with your own artwork, then run npm run brand.
const shapes = `<path d="M5 32 19 5v27H5Z" fill="${primaryText}"/><path d="M23 32V11a22 22 0 0 1 13 21H23Z" fill="${primaryText}" opacity=".65"/><path d="M4 36h32" stroke="${primaryText}" stroke-width="1.2"/>`
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${primary}"/><g transform="translate(12 10)">${shapes}</g></svg>`
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="${primary}" d="M0 0h64v64H0z"/><g transform="translate(16 14) scale(.8)">${shapes}</g></svg>`
const render = (svg, size) =>
	sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()
await mkdir('public/manifests', { recursive: true })
await writeFile('public/favicon.svg', icon)
for (const [file, size, svg] of [
	['apple-touch-icon.png', 180, icon],
	['pwa-192x192.png', 192, icon],
	['pwa-512x512.png', 512, icon],
	['pwa-maskable-512x512.png', 512, maskable],
])
	await writeFile(`public/${file}`, await render(svg, size))
const images = await Promise.all([16, 32, 48].map((size) => render(icon, size)))
const header = Buffer.alloc(6 + images.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(images.length, 4)
let offset = header.length
for (let index = 0; index < images.length; index++) {
	const at = 6 + index * 16
	const size = [16, 32, 48][index]
	header[at] = size
	header[at + 1] = size
	header.writeUInt16LE(1, at + 4)
	header.writeUInt16LE(32, at + 6)
	header.writeUInt32LE(images[index].length, at + 8)
	header.writeUInt32LE(offset, at + 12)
	offset += images[index].length
}
await writeFile('public/favicon.ico', Buffer.concat([header, ...images]))
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${tokens.light.background}"/><path d="M70 90h1060M70 540h1060" stroke="${tokens.light.border}"/><text x="76" y="312" font-family="Georgia,serif" font-size="132" fill="${primary}">${escape(site.name)}</text><text x="80" y="376" font-family="sans-serif" font-size="24" fill="${tokens.light.muted}">SPACE FOR WHAT’S NEXT.</text><rect x="800" y="156" width="260" height="320" rx="130" fill="${primary}"/><path d="M916 476V290l190-140v326Z" fill="${tokens.light.surfaceAlt}"/><circle cx="1070" cy="164" r="40" fill="${accent}"/></svg>`
await writeFile(
	'public/social-card.png',
	await sharp(Buffer.from(social)).png().toBuffer(),
)
for (const [locale, description] of [
	['en', 'Space for what’s next.'],
	['es', 'Espacio para lo que viene.'],
	['it', 'Spazio per ciò che verrà.'],
]) {
	const manifest = {
		id: '/',
		name: site.name,
		short_name: site.shortName,
		description,
		lang: locale,
		dir: 'ltr',
		start_url: locale === 'en' ? '/' : `/${locale}`,
		scope: '/',
		display: 'standalone',
		background_color: tokens.light.background,
		theme_color: primary,
		icons: [
			{
				src: '/pwa-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/pwa-maskable-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
	const json = JSON.stringify(manifest, null, '\t') + '\n'
	await writeFile(`public/manifests/${locale}.webmanifest`, json)
	if (locale === 'en') await writeFile('public/manifest.json', json)
}
await writeFile(
	'public/robots.txt',
	'User-agent: *\nAllow: /\nDisallow: /api/\n',
)
console.log(
	`Generated ${site.name} icons, social image, and localized manifests.`,
)
