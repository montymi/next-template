import { cookies } from 'next/headers'
import { createHash } from 'node:crypto'
import {
	githubConfig,
	authCookie,
	receiptCookie,
	unseal,
	seal,
	cookieOptions,
} from '@/lib/github/auth'
import { githubClient, GitHubError } from '@/lib/github/client'
import { createConfiguredFork } from '@/lib/github/fork'
import { validateSnapshot } from '@/lib/github/snapshot'
import site from '@/config/site.json'
export const runtime = 'nodejs'
export const maxDuration = 60
export async function POST(request: Request) {
	if (request.headers.get('origin') !== new URL(request.url).origin)
		return Response.json(
			{ error: 'Same-origin requests only.' },
			{ status: 403 },
		)
	const config = githubConfig()
	if (!config)
		return Response.json(
			{ error: 'The site owner needs to configure GitHub sign-in first.' },
			{ status: 503 },
		)
	const jar = await cookies()
	const session = unseal(jar.get(authCookie)?.value, config.secret)
	if (typeof session?.token !== 'string')
		return Response.json(
			{ error: 'Connect your GitHub account first.' },
			{ status: 401 },
		)
	if (!request.headers.get('content-type')?.startsWith('application/json'))
		return Response.json({ error: 'JSON required.' }, { status: 415 })
	try {
		const reader = request.body?.getReader()
		if (!reader) throw Error('Missing configuration.')
		let size = 0
		const chunks: Uint8Array[] = []
		while (true) {
			const { value, done } = await reader.read()
			if (done) break
			size += value.length
			if (size > 3000000) {
				await reader.cancel()
				return Response.json(
					{ error: 'Configuration is too large. Use smaller artwork.' },
					{ status: 413 },
				)
			}
			chunks.push(value)
		}
		const input = JSON.parse(Buffer.concat(chunks).toString())
		const snapshot = validateSnapshot(input.snapshot)
		if (typeof input.repositoryName !== 'string')
			throw Error('Enter a repository name.')
		const hash = createHash('sha256')
			.update(JSON.stringify(snapshot))
			.digest('hex')
		const receipt = unseal(jar.get(receiptCookie)?.value, config.secret)
		const retry =
			receipt?.hash === hash &&
			typeof receipt.login === 'string' &&
			typeof receipt.name === 'string'
				? { login: receipt.login, name: receipt.name }
				: null
		const source = /^https:\/\/github.com\/([\w-]+\/[\w.-]+)\/?$/.exec(
			site.repository,
		)?.[1]
		if (!source) throw Error('Invalid source repository.')
		const result = await createConfiguredFork(
			githubClient(session.token),
			source,
			input.repositoryName,
			snapshot,
			retry,
			async (login, name) => {
				jar.set(
					receiptCookie,
					seal({ login, name, hash, exp: Date.now() + 3600000 }, config.secret),
					cookieOptions(3600),
				)
			},
		)
		return Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
	} catch (error) {
		const status =
			error instanceof GitHubError
				? error.status >= 500
					? 502
					: error.status
				: 422
		return Response.json(
			{
				error:
					error instanceof GitHubError
						? error.message
						: 'Could not apply the saved configuration. Check your settings and try again.',
			},
			{ status },
		)
	}
}
