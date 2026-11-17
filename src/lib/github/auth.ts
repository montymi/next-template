import {
	createCipheriv,
	createDecipheriv,
	createHash,
	randomBytes,
} from 'node:crypto'
export const authCookie = 'coast-github-session'
export const stateCookie = 'coast-github-state'
export const receiptCookie = 'coast-github-fork'
export function githubConfig() {
	const clientId = process.env.GITHUB_CLIENT_ID
	const clientSecret = process.env.GITHUB_CLIENT_SECRET
	const secret = process.env.GITHUB_SESSION_SECRET
	const callback = process.env.GITHUB_CALLBACK_URL
	if (!clientId || !clientSecret || !secret || secret.length < 32 || !callback)
		return null
	try {
		const url = new URL(callback)
		if (
			url.pathname !== '/api/github/callback' ||
			url.search ||
			url.hash ||
			url.username ||
			url.password ||
			!(
				url.protocol === 'https:' ||
				(process.env.NODE_ENV === 'development' &&
					url.protocol === 'http:' &&
					['localhost', '127.0.0.1'].includes(url.hostname))
			)
		)
			return null
	} catch {
		return null
	}
	return { clientId, clientSecret, secret, callback: callback! }
}
export function seal(value: object, secret: string) {
	const iv = randomBytes(12)
	const cipher = createCipheriv(
		'aes-256-gcm',
		createHash('sha256').update(secret).digest(),
		iv,
	)
	const content = Buffer.concat([
		cipher.update(JSON.stringify(value)),
		cipher.final(),
	])
	return Buffer.concat([iv, cipher.getAuthTag(), content]).toString('base64url')
}
export function unseal(
	value: string | undefined,
	secret: string,
): Record<string, unknown> | null {
	try {
		if (!value) return null
		const data = Buffer.from(value, 'base64url')
		const decipher = createDecipheriv(
			'aes-256-gcm',
			createHash('sha256').update(secret).digest(),
			data.subarray(0, 12),
		)
		decipher.setAuthTag(data.subarray(12, 28))
		const decoded = JSON.parse(
			Buffer.concat([
				decipher.update(data.subarray(28)),
				decipher.final(),
			]).toString(),
		)
		return decoded &&
			typeof decoded.exp === 'number' &&
			decoded.exp > Date.now()
			? decoded
			: null
	} catch {
		return null
	}
}
export function cookieOptions(maxAge: number) {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/api/github',
		maxAge,
	}
}
export function returnPath(value: string | null) {
	const allowed = [
		'/',
		'/es',
		'/it',
		'/design-system',
		'/getting-started',
		'/es/design-system',
		'/it/design-system',
		'/es/getting-started',
		'/it/getting-started',
	]
	return value && allowed.includes(value) ? value : '/'
}
