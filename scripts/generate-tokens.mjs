import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
	generateTokenCss,
	validateTokens,
} from '../src/design-system/format.mjs'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tokens = validateTokens(
	JSON.parse(
		await readFile(path.join(root, 'src/design-system/tokens.json'), 'utf8'),
	),
)
const target = path.join(root, 'src/styles/tokens.css')
const css = generateTokenCss(tokens)
let current
try {
	current = await readFile(target, 'utf8')
} catch (error) {
	if (error.code !== 'ENOENT') throw error
}
if (current !== css) await writeFile(target, css)
console.log(`Generated ${tokens.name} tokens.`)
