import { createInterface } from 'node:readline/promises'
import { Writable } from 'node:stream'
import { readFile, writeFile, rename, lstat } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
export function setupUrls(input) {
	const url = new URL(input)
	if (
		url.username ||
		url.password ||
		url.search ||
		url.hash ||
		url.pathname !== '/' ||
		!(
			url.protocol === 'https:' ||
			(url.protocol === 'http:' &&
				['localhost', '127.0.0.1'].includes(url.hostname))
		)
	)
		throw Error(
			'Use your public HTTPS site origin, or http://localhost:3000 for local development.',
		)
	const callback = new URL('/api/github/callback', url).href
	const registration = new URL('https://github.com/settings/applications/new')
	registration.search = new URLSearchParams({
		name: 'Coast website forks',
		url: url.origin,
		callback_url: callback,
		description:
			'Let visitors fork this website with their saved design configuration.',
	}).toString()
	return { origin: url.origin, callback, registration: registration.href }
}
async function run() {
	const output = new Writable({
		write(chunk, encoding, done) {
			process.stdout.write(chunk, encoding)
			done()
		},
	})
	let secretMode = false
	const rl = createInterface({
		input: process.stdin,
		output: new Writable({
			write(chunk, encoding, done) {
				if (!secretMode) output.write(chunk, encoding)
				done()
			},
		}),
		terminal: !!process.stdin.isTTY,
	})
	try {
		const urls = setupUrls(
			process.argv[2] || (await rl.question('Public site URL: ')),
		)
		console.log(
			`\nCreate the OAuth app on GitHub:\n${urls.registration}\n\nHomepage URL: ${urls.origin}\nCallback URL: ${urls.callback}\n\nAfter creating the app, copy its Client ID and generate a client secret.\n`,
		)
		const clientId = (await rl.question('GitHub Client ID: ')).trim()
		if (!/^[a-zA-Z0-9_]+$/.test(clientId)) throw Error('Invalid Client ID.')
		process.stdout.write('GitHub Client Secret (hidden): ')
		secretMode = true
		const clientSecret = (await rl.question('')).trim()
		secretMode = false
		console.log()
		if (!/^[a-zA-Z0-9_-]{20,200}$/.test(clientSecret))
			throw Error('Invalid client secret.')
		const filename = path.resolve('.env.local')
		try {
			if ((await lstat(filename)).isSymbolicLink())
				throw Error('Refusing to replace a linked .env.local file.')
		} catch (error) {
			if (error.code !== 'ENOENT') throw error
		}
		try {
			execFileSync('git', ['check-ignore', '--quiet', '.env.local'], {
				stdio: 'ignore',
			})
		} catch {
			throw Error(
				'.env.local must be ignored by Git before credentials can be saved.',
			)
		}
		let previous = ''
		try {
			previous = await readFile(filename, 'utf8')
		} catch (error) {
			if (error.code !== 'ENOENT') throw error
		}
		const keys = [
			'GITHUB_CLIENT_ID',
			'GITHUB_CLIENT_SECRET',
			'GITHUB_SESSION_SECRET',
			'GITHUB_CALLBACK_URL',
		]
		const preserved = previous
			.split('\n')
			.filter(
				(line) =>
					!keys.some((key) =>
						new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`).test(line),
					),
			)
			.join('\n')
			.trimEnd()
		const content =
			preserved +
			'\n\n# GitHub OAuth — server only\n' +
			Object.entries({
				GITHUB_CLIENT_ID: clientId,
				GITHUB_CLIENT_SECRET: clientSecret,
				GITHUB_SESSION_SECRET: randomBytes(32).toString('hex'),
				GITHUB_CALLBACK_URL: urls.callback,
			})
				.map(([key, value]) => `${key}=${value}`)
				.join('\n') +
			'\n'
		const temporary = filename + `.${randomBytes(6).toString('hex')}.tmp`
		await writeFile(temporary, content, { mode: 0o600, flag: 'wx' })
		await rename(temporary, filename)
		console.log(
			'\nSaved .env.local with private file permissions. Credentials were not printed.\nFor local use, restart npm run dev. For Vercel, add the four GITHUB_ variables from this file to the project’s environment settings and redeploy. Keep this file out of Git.',
		)
	} finally {
		rl.close()
	}
}
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) ===
		path.resolve(new URL(import.meta.url).pathname)
)
	run().catch((error) => {
		console.error(error.message)
		process.exitCode = 1
	})
