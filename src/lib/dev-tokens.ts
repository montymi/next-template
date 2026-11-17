import { mkdir, rename, writeFile, rm } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { generateTokenCss, validateTokens } from '@/design-system/format.mjs'

export async function saveDesignTokens(input: unknown, root = process.cwd()) {
	const tokens = validateTokens(input)
	const directory = path.join(root, 'src/design-system')
	const styles = path.join(root, 'src/styles')
	await mkdir(directory, { recursive: true })
	await mkdir(styles, { recursive: true })
	const suffix = `.${randomUUID()}.tmp`
	const json = path.join(directory, 'tokens.json')
	const css = path.join(styles, 'tokens.css')
	try {
		await writeFile(json + suffix, JSON.stringify(tokens, null, '\t') + '\n')
		await writeFile(css + suffix, generateTokenCss(tokens))
		await rename(json + suffix, json)
		await rename(css + suffix, css)
	} finally {
		await Promise.all([
			rm(json + suffix, { force: true }),
			rm(css + suffix, { force: true }),
		])
	}
}
