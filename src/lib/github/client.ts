export class GitHubError extends Error {
	constructor(
		message: string,
		public status = 502,
	) {
		super(message)
	}
}
export type GitHubCall = (
	path: string,
	method?: string,
	body?: unknown,
) => Promise<Record<string, unknown>>
export function githubClient(token: string): GitHubCall {
	return async (path, method = 'GET', body) => {
		const response = await fetch(`https://api.github.com${path}`, {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json',
				'Content-Type': 'application/json',
				'X-GitHub-Api-Version': '2022-11-28',
			},
			body: body ? JSON.stringify(body) : undefined,
			cache: 'no-store',
			signal: AbortSignal.timeout(15000),
		})
		if (!response.ok)
			throw new GitHubError(
				response.status === 401
					? 'GitHub sign-in expired. Connect again.'
					: response.status === 403
						? 'GitHub denied this operation. Check your account permissions.'
						: response.status === 404
							? 'GitHub repository or branch was not found.'
							: 'GitHub could not complete the request. Try again.',
				response.status,
			)
		return response.status === 204 ? {} : await response.json()
	}
}
