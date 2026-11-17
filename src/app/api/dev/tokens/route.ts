import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { saveDesignTokens } from '@/lib/dev-tokens'
import { validateTokens } from '@/design-system/format.mjs'

export const runtime = 'nodejs'
const unavailable = () => Response.json({ error: 'Not found' }, { status: 404 })

export async function GET() {
	if (process.env.NODE_ENV !== 'development') return unavailable()
	const tokens = validateTokens(
		JSON.parse(
			await readFile(
				path.join(process.cwd(), 'src/design-system/tokens.json'),
				'utf8',
			),
		),
	)
	return Response.json(tokens, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
	if (process.env.NODE_ENV !== 'development') return unavailable()
	if (request.headers.get('origin') !== new URL(request.url).origin)
		return Response.json(
			{ error: 'Same-origin requests only.' },
			{ status: 403 },
		)
	if (!request.headers.get('content-type')?.includes('application/json'))
		return Response.json({ error: 'JSON is required.' }, { status: 415 })
	const reader = request.body?.getReader()
	if (!reader)
		return Response.json(
			{ error: 'A token document is required.' },
			{ status: 400 },
		)
	try {
		const decoder = new TextDecoder()
		let bytes = 0
		let text = ''
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			bytes += value.byteLength
			if (bytes > 32768) {
				await reader.cancel()
				return Response.json(
					{ error: 'Token document is too large.' },
					{ status: 413 },
				)
			}
			text += decoder.decode(value, { stream: true })
		}
		text += decoder.decode()
		await saveDesignTokens(JSON.parse(text))
		return Response.json(
			{ saved: true },
			{ headers: { 'Cache-Control': 'no-store' } },
		)
	} catch (error) {
		if (
			error instanceof SyntaxError ||
			(error instanceof Error && error.name === 'TokenValidationError')
		)
			return Response.json({ error: error.message }, { status: 422 })
		return Response.json(
			{
				error:
					'Could not save the token files. Check that the project is writable.',
			},
			{ status: 500 },
		)
	}
}
