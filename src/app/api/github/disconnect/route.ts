import { cookies } from 'next/headers'
import { authCookie, receiptCookie, cookieOptions } from '@/lib/github/auth'
export async function POST(request: Request) {
	if (request.headers.get('origin') !== new URL(request.url).origin)
		return Response.json(
			{ error: 'Same-origin requests only.' },
			{ status: 403 },
		)
	const jar = await cookies()
	jar.set(authCookie, '', cookieOptions(0))
	jar.set(receiptCookie, '', cookieOptions(0))
	return Response.json({ disconnected: true })
}
