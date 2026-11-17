import { cookies } from 'next/headers'
import { randomBytes, createHash } from 'node:crypto'
import {
	githubConfig,
	stateCookie,
	seal,
	cookieOptions,
	returnPath,
} from '@/lib/github/auth'
export async function GET(request: Request) {
	const config = githubConfig()
	if (!config)
		return Response.json(
			{ error: 'GitHub sign-in is not configured on this deployment.' },
			{ status: 503 },
		)
	const state = randomBytes(24).toString('base64url')
	const verifier = randomBytes(32).toString('base64url')
	const from = returnPath(new URL(request.url).searchParams.get('returnTo'))
	;(await cookies()).set(
		stateCookie,
		seal({ state, verifier, from, exp: Date.now() + 600000 }, config.secret),
		cookieOptions(600),
	)
	const url = new URL('https://github.com/login/oauth/authorize')
	url.search = new URLSearchParams({
		client_id: config.clientId,
		redirect_uri: config.callback,
		scope: 'public_repo',
		state,
		code_challenge: createHash('sha256').update(verifier).digest('base64url'),
		code_challenge_method: 'S256',
	}).toString()
	return Response.redirect(url)
}
