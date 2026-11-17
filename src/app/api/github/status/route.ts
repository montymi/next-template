import { cookies } from 'next/headers'
import { authCookie, githubConfig, unseal } from '@/lib/github/auth'
export async function GET() {
	const config = githubConfig()
	const session = config
		? unseal((await cookies()).get(authCookie)?.value, config.secret)
		: null
	return Response.json(
		{
			configured: !!config,
			connected: typeof session?.token === 'string',
			login: session?.login ?? null,
		},
		{ headers: { 'Cache-Control': 'no-store' } },
	)
}
