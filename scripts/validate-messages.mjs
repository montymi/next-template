import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../messages',
)
function keys(value, prefix = '') {
	return Object.entries(value)
		.flatMap(([key, entry]) => {
			const name = prefix ? `${prefix}.${key}` : key
			if (typeof entry === 'string') {
				if (!entry.trim()) throw new Error(`Empty message: ${name}`)
				return [name]
			}
			if (!entry || typeof entry !== 'object' || Array.isArray(entry))
				throw new Error(`Invalid message: ${name}`)
			return keys(entry, name)
		})
		.sort()
}
const baseline = keys(
	JSON.parse(await readFile(path.join(root, 'en.json'), 'utf8')),
)
for (const name of (await readdir(root)).filter((name) =>
	name.endsWith('.json'),
)) {
	const actual = keys(JSON.parse(await readFile(path.join(root, name), 'utf8')))
	if (JSON.stringify(actual) !== JSON.stringify(baseline))
		throw new Error(`Translation keys differ: ${name}`)
}
console.log('Translation keys and nonempty values verified.')
