import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { unzipSync, strFromU8 } from 'fflate'
import { validateTokens } from '../src/design-system/format.mjs'
import path from 'node:path'
export async function applyKit(filename, root = process.cwd()) {
	const archive = await readFile(filename)
	if (archive.length > 10 * 1024 * 1024) throw Error('Kit must be under 10 MB.')
	const allowed = new Set([
		'src/design-system/tokens.json',
		'src/config/site.json',
		'src/config/brand.json',
		'public/brand/logo.png',
		'public/brand/avatar.png',
		'START-HERE.md',
		'PERSONALIZE.md',
	])
	const files = unzipSync(archive, {
		filter: (file) => {
			if (!allowed.has(file.name) || file.originalSize > 5 * 1024 * 1024)
				throw Error('Unexpected or oversized kit file.')
			return true
		},
	})
	for (const required of [
		'src/design-system/tokens.json',
		'src/config/site.json',
		'src/config/brand.json',
	])
		if (!files[required]) throw Error('Incomplete starter kit.')
	validateTokens(JSON.parse(strFromU8(files['src/design-system/tokens.json'])))
	const site = JSON.parse(strFromU8(files['src/config/site.json']))
	if (
		typeof site.name !== 'string' ||
		!site.name.trim() ||
		site.name.length > 80 ||
		typeof site.shortName !== 'string' ||
		site.shortName.length > 24 ||
		site.repository !== 'https://github.com/montymi/next-template'
	)
		throw Error('Invalid site configuration.')
	const brand = JSON.parse(strFromU8(files['src/config/brand.json']))
	for (const key of ['logo', 'avatar'])
		if (brand[key] !== '' && brand[key] !== `/brand/${key}.png`)
			throw Error('Invalid artwork path.')
	for (const key of ['logo', 'avatar']) {
		const file = files[`public/brand/${key}.png`]
		if (brand[key] && !file) throw Error('Artwork is missing.')
		if (
			file &&
			Buffer.from(file).subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
		)
			throw Error('Artwork must be PNG.')
	}
	for (const [name, data] of Object.entries(files)) {
		const destination = path.join(root, name)
		await mkdir(path.dirname(destination), { recursive: true })
		await writeFile(destination, data)
	}
}
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) ===
		path.resolve(new URL(import.meta.url).pathname)
) {
	if (!process.argv[2])
		throw Error('Usage: npm run customize -- /path/to/coast-starter.zip')
	await applyKit(process.argv[2])
	execFileSync('npm', ['run', 'brand'], { stdio: 'inherit' })
	console.log(
		'Applied starter kit. Review locally, then commit and deploy your fork. PERSONALIZE.md is excluded from Git.',
	)
}
