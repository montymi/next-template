import { test, expect } from '@playwright/test'
import { seal, unseal, returnPath } from '../src/lib/github/auth'
import { createConfiguredFork } from '../src/lib/github/fork'
import { GitHubError, type GitHubCall } from '../src/lib/github/client'
import tokens from '../src/design-system/tokens.json' with { type: 'json' }
const snapshot = {
	version: 1,
	tokens: { ...tokens, light: { ...tokens.light, primary: '#205A79' } },
	brand: { name: 'Alex', logo: '', avatar: '' },
}
test('GitHub session cookies reject tampering and expiry; return URLs stay on the site', () => {
	const secret = 'test-only-cookie-key-with-more-than-32-characters'
	const value = seal(
		{ token: 'private-oauth-token', exp: Date.now() + 60000 },
		secret,
	)
	expect(value).not.toContain('private-oauth-token')
	expect(unseal(value, secret)?.token).toBe('private-oauth-token')
	expect(unseal(value.slice(0, -4) + 'xxxx', secret)).toBeNull()
	expect(unseal(value, 'other-secret')).toBeNull()
	expect(unseal(seal({ exp: Date.now() - 1 }, secret), secret)).toBeNull()
	expect(returnPath('https://evil.test')).toBe('/')
	expect(returnPath('//evil.test')).toBe('/')
	expect(returnPath('/es/design-system')).toBe('/es/design-system')
	expect(returnPath('/design-system')).toBe('/design-system')
})
test('a new fork receives one atomic commit containing the saved configuration', async () => {
	const calls: { path: string; method: string; body: unknown }[] = []
	let created = false
	const blobs: string[] = []
	const call: GitHubCall = async (path, method = 'GET', body) => {
		calls.push({ path, method, body })
		if (path === '/user') return { login: 'alex' }
		if (path === '/repos/alex/personal-site')
			throw new GitHubError('Not found', 404)
		if (path.endsWith('/forks'))
			return {
				full_name: 'alex/personal-site',
				fork: true,
				parent: { full_name: 'montymi/next-template' },
				default_branch: 'main',
			}
		if (path.endsWith('/git/ref/heads/main')) return { object: { sha: 'head' } }
		if (path.endsWith('/git/commits/head')) return { tree: { sha: 'base' } }
		if (path.endsWith('/git/blobs')) {
			blobs.push((body as { content: string }).content)
			return { sha: `blob-${blobs.length}` }
		}
		if (path.endsWith('/git/trees')) return { sha: 'tree' }
		if (path.endsWith('/git/commits')) return { sha: 'saved-commit' }
		if (path.endsWith('/git/refs/heads/main')) return {}
		throw Error(`Unexpected call ${path}`)
	}
	const result = await createConfiguredFork(
		call,
		'montymi/next-template',
		'personal-site',
		snapshot,
		null,
		async () => {
			created = true
		},
		async () => {},
	)
	expect(created).toBe(true)
	expect(result.repository).toBe('https://github.com/alex/personal-site')
	expect(blobs.join('\n')).toContain('#205A79')
	expect(blobs.join('\n')).toContain('--primary: #205a79;')
	expect(blobs.join('\n')).toContain('https://github.com/alex/personal-site')
	expect(calls.at(-1)).toEqual({
		path: '/repos/alex/personal-site/git/refs/heads/main',
		method: 'PATCH',
		body: { sha: 'saved-commit', force: false },
	})
	const tree = calls.find((c) => c.path.endsWith('/git/trees'))?.body as {
		base_tree: string
		tree: { path: string }[]
	}
	expect(tree.base_tree).toBe('base')
	expect(tree.tree.map((f) => f.path)).toEqual([
		'src/design-system/tokens.json',
		'src/styles/tokens.css',
		'src/config/site.json',
		'src/config/brand.json',
	])
	expect(
		calls.filter((c) => c.path.endsWith('/git/commits') && c.method === 'POST'),
	).toHaveLength(1)
})
test('existing repositories and unexpected fork owners are never modified', async () => {
	const writes: string[] = []
	const exists: GitHubCall = async (path, method = 'GET') => {
		if (method !== 'GET') writes.push(path)
		return path === '/user'
			? { login: 'alex' }
			: { full_name: 'alex/personal-site' }
	}
	await expect(
		createConfiguredFork(
			exists,
			'montymi/next-template',
			'personal-site',
			snapshot,
			null,
			async () => {},
			async () => {},
		),
	).rejects.toThrow('already exists')
	expect(writes).toEqual([])
	const other: GitHubCall = async (path, method = 'GET') => {
		if (path === '/user') return { login: 'alex' }
		if (method === 'GET') throw new GitHubError('Not found', 404)
		return { full_name: 'someone-else/repo' }
	}
	await expect(
		createConfiguredFork(
			other,
			'montymi/next-template',
			'personal-site',
			snapshot,
			null,
			async () => {},
			async () => {},
		),
	).rejects.toThrow('No configuration was written')
})
test('invalid snapshots and repository names fail before GitHub writes', async () => {
	const calls: string[] = []
	const call: GitHubCall = async (path) => {
		calls.push(path)
		return {}
	}
	for (const input of [
		{
			...snapshot,
			brand: { ...snapshot.brand, logo: 'data:image/png;base64,AAAA' },
		},
		{ ...snapshot, resume: 'must not be committed' },
		{
			...snapshot,
			tokens: { ...tokens, light: { ...tokens.light, primary: 'red' } },
		},
	])
		await expect(
			createConfiguredFork(
				call,
				'montymi/next-template',
				'personal-site',
				input,
				null,
				async () => {},
			),
		).rejects.toThrow()
	await expect(
		createConfiguredFork(
			call,
			'montymi/next-template',
			'../other',
			snapshot,
			null,
			async () => {},
		),
	).rejects.toThrow()
	expect(calls).toEqual([])
})

test('a receipt can resume the same freshly created fork without creating another repository', async () => {
	const writes: string[] = []
	const call: GitHubCall = async (path, method = 'GET') => {
		if (method !== 'GET') writes.push(path)
		if (path === '/user') return { login: 'alex' }
		if (path === '/repos/alex/personal-site')
			return {
				full_name: 'alex/personal-site',
				fork: true,
				parent: { full_name: 'montymi/next-template' },
				default_branch: 'main',
			}
		if (path.endsWith('/git/ref/heads/main')) return { object: { sha: 'head' } }
		if (path.endsWith('/git/commits/head')) return { tree: { sha: 'base' } }
		return { sha: 'saved' }
	}
	await createConfiguredFork(
		call,
		'montymi/next-template',
		'personal-site',
		snapshot,
		{ login: 'alex', name: 'personal-site' },
		async () => {
			throw Error('Must not create a second fork')
		},
		async () => {},
	)
	expect(writes.some((path) => path.endsWith('/forks'))).toBe(false)
	expect(writes.at(-1)).toBe('/repos/alex/personal-site/git/refs/heads/main')
	await expect(
		createConfiguredFork(
			call,
			'montymi/next-template',
			'personal-site',
			snapshot,
			{ login: 'other', name: 'personal-site' },
			async () => {},
			async () => {},
		),
	).rejects.toThrow('already exists')
})
