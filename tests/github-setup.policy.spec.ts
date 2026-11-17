import { test, expect } from '@playwright/test'
import { setupUrls } from '../scripts/setup-github.mjs'
import { mkdtemp, writeFile, readFile, stat, rm } from 'node:fs/promises'
import { execFileSync, spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
test('owner setup provides exact callback URLs and rejects unsafe site origins', () => {
	const result = setupUrls('https://portfolio.example')
	expect(result.callback).toBe('https://portfolio.example/api/github/callback')
	expect(new URL(result.registration).searchParams.get('callback_url')).toBe(
		result.callback,
	)
	expect(setupUrls('http://localhost:3000').callback).toBe(
		'http://localhost:3000/api/github/callback',
	)
	for (const url of [
		'http://public.example',
		'https://name:secret@example.com',
		'https://example.com/wrong-path',
		'https://example.com?token=secret',
		'javascript:alert(1)',
	])
		expect(() => setupUrls(url)).toThrow()
})
test('guided setup keeps credentials out of output and writes a private ignored env file', async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), 'coast-owner-setup-'))
	const secret = 'test-only-secret-never-printed-123456789'
	try {
		execFileSync('git', ['init', '-q'], { cwd: root })
		await writeFile(path.join(root, '.gitignore'), '.env*\n')
		await writeFile(
			path.join(root, '.env.local'),
			'NEXT_PUBLIC_SITE_URL=https://portfolio.example\nGITHUB_CLIENT_ID=old\n',
		)
		const child = spawn(
			process.execPath,
			[path.resolve('scripts/setup-github.mjs'), 'https://portfolio.example'],
			{ cwd: root, stdio: ['pipe', 'pipe', 'pipe'] },
		)
		let output = ''
		let idSent = false
		let secretSent = false
		child.stdout.on('data', (chunk) => {
			output += chunk.toString()
			if (!idSent && output.includes('GitHub Client ID: ')) {
				idSent = true
				child.stdin.write('Iv1FixtureClient\n')
			}
			if (!secretSent && output.includes('GitHub Client Secret (hidden): ')) {
				secretSent = true
				child.stdin.write(secret + '\n')
			}
		})
		child.stderr.on('data', (chunk) => {
			output += chunk.toString()
		})
		const code = await new Promise<number | null>((resolve, reject) => {
			child.on('error', reject)
			child.on('close', resolve)
		})
		expect(code).toBe(0)
		expect(output).not.toContain(secret)
		const env = await readFile(path.join(root, '.env.local'), 'utf8')
		expect(env).toContain('NEXT_PUBLIC_SITE_URL=https://portfolio.example')
		expect(env).toContain('GITHUB_CLIENT_ID=Iv1FixtureClient')
		expect(env).toContain('GITHUB_CLIENT_SECRET=' + secret)
		expect(env).toContain(
			'GITHUB_CALLBACK_URL=https://portfolio.example/api/github/callback',
		)
		expect(env).toMatch(/GITHUB_SESSION_SECRET=[0-9a-f]{64}/)
		if (process.platform !== 'win32')
			expect((await stat(path.join(root, '.env.local'))).mode & 0o777).toBe(
				0o600,
			)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})
