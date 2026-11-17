import { configurationFiles, validateSnapshot } from './snapshot'
import type { GitHubCall } from './client'
import { GitHubError } from './client'
export async function createConfiguredFork(
	call: GitHubCall,
	source: string,
	name: string,
	input: unknown,
	receipt: { login: string; name: string } | null,
	onCreated: (login: string, name: string) => Promise<void>,
	pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
) {
	if (!/^[\w.-]{1,80}$/.test(name) || name === '.' || name === '..')
		throw new GitHubError(
			'Use a repository name with letters, numbers, dots, underscores, or hyphens.',
			422,
		)
	const snapshot = validateSnapshot(input)
	const user = await call('/user')
	const login = user.login
	if (typeof login !== 'string' || !/^[-\w]+$/.test(login))
		throw new GitHubError('Could not identify your GitHub account.')
	if (source.split('/')[0].toLowerCase() === login.toLowerCase())
		throw new GitHubError(
			'GitHub cannot fork into the source repository owner’s account. Visitors can use their own accounts.',
			409,
		)
	const target = `${login}/${name}`
	let exists = false
	try {
		await call(`/repos/${target}`)
		exists = true
	} catch (error) {
		if (!(error instanceof GitHubError) || error.status !== 404) throw error
	}
	let fork: Record<string, unknown>
	if (exists) {
		if (receipt?.login !== login || receipt?.name !== name)
			throw new GitHubError(
				'That repository already exists. Choose another name; existing repositories are never overwritten.',
				409,
			)
		fork = await call(`/repos/${target}`)
	} else {
		fork = await call(`/repos/${source}/forks`, 'POST', {
			name,
			default_branch_only: true,
		})
		if (fork.full_name !== target)
			throw new GitHubError(
				'GitHub returned an existing fork. Choose a different account or use your existing fork manually. No configuration was written.',
				409,
			)
		await onCreated(login, name)
	}
	if (
		fork.full_name !== target ||
		fork.fork !== true ||
		(fork.parent as { full_name?: string } | undefined)?.full_name !== source
	)
		throw new GitHubError(
			'GitHub returned an unexpected repository. No configuration was written.',
			409,
		)
	const branch =
		typeof fork.default_branch === 'string' ? fork.default_branch : 'main'
	const encoded = encodeURIComponent(branch)
	let head: Record<string, unknown> | null = null
	for (let attempt = 0; attempt < 7; attempt++) {
		try {
			head = await call(`/repos/${target}/git/ref/heads/${encoded}`)
			break
		} catch (error) {
			if (!(error instanceof GitHubError) || ![404, 409].includes(error.status))
				throw error
			await pause(Math.min(300 * (attempt + 1), 1500))
		}
	}
	const sha = (head?.object as { sha?: string } | undefined)?.sha
	if (!sha)
		throw new GitHubError(
			'GitHub is still preparing your fork. Your saved configuration is safe; retry this action.',
			503,
		)
	const commit = await call(`/repos/${target}/git/commits/${sha}`)
	const baseTree = (commit.tree as { sha?: string })?.sha
	if (!baseTree) throw new GitHubError('Could not read the fork’s source tree.')
	const repository = `https://github.com/${target}`
	const entries: { path: string; mode: string; type: string; sha: unknown }[] =
		[]
	for (const [path, content] of Object.entries(
		configurationFiles(snapshot, repository),
	)) {
		const blob = await call(`/repos/${target}/git/blobs`, 'POST', {
			content,
			encoding: 'utf-8',
		})
		entries.push({ path, mode: '100644', type: 'blob', sha: blob.sha })
	}
	for (const kind of ['logo', 'avatar'] as const) {
		const image = snapshot.brand[kind]
		if (!image.startsWith('data:')) continue
		const content = image.split(',')[1]
		const bytes = Buffer.from(content, 'base64')
		if (
			bytes.length < 24 ||
			bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
			bytes.readUInt32BE(16) > 4096 ||
			bytes.readUInt32BE(20) > 4096
		)
			throw new GitHubError('Invalid PNG artwork.', 422)
		const blob = await call(`/repos/${target}/git/blobs`, 'POST', {
			content,
			encoding: 'base64',
		})
		entries.push({
			path: `public/brand/${kind}.png`,
			mode: '100644',
			type: 'blob',
			sha: blob.sha,
		})
	}
	const tree = await call(`/repos/${target}/git/trees`, 'POST', {
		base_tree: baseTree,
		tree: entries,
	})
	const saved = await call(`/repos/${target}/git/commits`, 'POST', {
		message: 'feat: apply saved website configuration',
		tree: tree.sha,
		parents: [sha],
	})
	await call(`/repos/${target}/git/refs/heads/${encoded}`, 'PATCH', {
		sha: saved.sha,
		force: false,
	})
	return {
		repository,
		commit: `${repository}/commit/${saved.sha}`,
		deploy: `https://vercel.com/new/git/external?repository-url=${encodeURIComponent(repository)}`,
	}
}
