import { test, expect } from '@playwright/test'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import tokens from '../src/design-system/tokens.json' with { type: 'json' }
import { validateTokens } from '../src/design-system/format.mjs'
import { saveDesignTokens } from '../src/lib/dev-tokens'

test('token validation prevents injected CSS, unexpected fields, and invalid size scales', () => {
	for (const mutate of [
		(value: typeof tokens) => {
			value.light.primary = 'red; background:url(https://example.test)'
		},
		(value: typeof tokens) => {
			value.fonts.body = 'url(https://example.test/font)'
		},
		(value: typeof tokens) => {
			value.spacing['2'] = -1
		},
		(value: typeof tokens) => {
			value.radii.large = 1
		},
		(value: typeof tokens) => {
			Object.assign(value, { filename: '../../outside.css' })
		},
	]) {
		const invalid = structuredClone(tokens)
		mutate(invalid)
		expect(() => validateTokens(invalid)).toThrow()
	}
})
test('saving changed tokens writes JSON and matching CSS and removes temporary files', async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), 'coast-token-test-'))
	try {
		const edited = structuredClone(tokens)
		edited.light.primary = '#205A79'
		edited.radii.medium = 18
		edited.radii.large = 36
		await saveDesignTokens(edited, root)
		expect(
			JSON.parse(
				await readFile(
					path.join(root, 'src/design-system/tokens.json'),
					'utf8',
				),
			),
		).toEqual(edited)
		const css = await readFile(path.join(root, 'src/styles/tokens.css'), 'utf8')
		expect(css).toContain('--primary: #205a79;')
		expect(css).toContain('--radius-medium: 18px;')
		expect(await readdir(path.join(root, 'src/design-system'))).toEqual([
			'tokens.json',
		])
		await expect(
			saveDesignTokens(
				{ ...edited, light: { ...edited.light, primary: 'invalid' } },
				root,
			),
		).rejects.toThrow()
		expect(
			JSON.parse(
				await readFile(
					path.join(root, 'src/design-system/tokens.json'),
					'utf8',
				),
			),
		).toEqual(edited)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})
test('dev API rejects cross-origin, invalid, and oversized writes without changing project files', async ({
	request,
}) => {
	const before = await readFile('src/design-system/tokens.json', 'utf8')
	const cssBefore = await readFile('src/styles/tokens.css', 'utf8')
	const endpoint = 'http://localhost:3201/api/dev/tokens'
	expect(
		(
			await request.post(endpoint, {
				data: tokens,
				headers: { Origin: 'https://example.test' },
			})
		).status(),
	).toBe(403)
	expect(
		(
			await request.post(endpoint, {
				data: { ...tokens, light: { ...tokens.light, primary: 'invalid' } },
				headers: { Origin: 'http://localhost:3201' },
			})
		).status(),
	).toBe(422)
	expect(
		(
			await request.post(endpoint, {
				data: 'x'.repeat(32769),
				headers: {
					Origin: 'http://localhost:3201',
					'Content-Type': 'application/json',
				},
			})
		).status(),
	).toBe(413)
	expect(await readFile('src/design-system/tokens.json', 'utf8')).toBe(before)
	expect(await readFile('src/styles/tokens.css', 'utf8')).toBe(cssBefore)
})
