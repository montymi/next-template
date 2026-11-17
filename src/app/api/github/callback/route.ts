import { cookies } from 'next/headers'
import {
	authCookie,
	stateCookie,
	githubConfig,
	unseal,
	seal,
	cookieOptions,
	returnPath,
} from '@/lib/github/auth'
import { githubClient } from '@/lib/github/client'
export async function GET(request: Request) {
	const config = githubConfig()
	if (!config)
		return Response.json(
			{ error: 'GitHub sign-in is not configured.' },
			{ status: 503 },
		)
	const jar = await cookies()
	const pending = unseal(jar.get(stateCookie)?.value, config.secret)
	jar.set(stateCookie, '', cookieOptions(0))
	const url = new URL(request.url)
	if (!pending || pending.state !== url.searchParams.get('state'))
		return Response.json(
			{
				error: 'GitHub sign-in expired or could not be verified. Start again.',
			},
			{ status: 400 },
		)
	const destination = new URL(
		returnPath(typeof pending.from === 'string' ? pending.from : null),
		config.callback,
	)
	destination.searchParams.set('github', 'failed')
	if (!url.searchParams.get('code') || url.searchParams.has('error'))
		return Response.redirect(destination)
	try {
		const response = await fetch(
			'https://github.com/login/oauth/access_token',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					client_id: config.clientId,
					client_secret: config.clientSecret,
					code: url.searchParams.get('code'),
					redirect_uri: config.callback,
					code_verifier: pending.verifier,
				}),
				cache: 'no-store',
				signal: AbortSignal.timeout(15000),
			},
		)
		const result = await response.json()
		if (
			!response.ok ||
			typeof result.access_token !== 'string' ||
			!String(result.scope)
				.split(/[ ,]+/)
				.some((s) => s === 'public_repo' || s === 'repo')
		)
			throw Error('Sign-in denied')
		const user = await githubClient(result.access_token)('/user')
		jar.set(
			authCookie,
			seal(
				{
					token: result.access_token,
					login: user.login,
					exp: Date.now() + 1800000,
				},
				config.secret,
			),
			cookieOptions(1800),
		)
		destination.searchParams.set('github', 'connected')
	} catch {}
	return Response.redirect(destination)
}
