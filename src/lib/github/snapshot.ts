import { validateTokens, generateTokenCss } from '@/design-system/format.mjs'
import type { DesignTokens } from '@/design-system/types'
export type Snapshot = {
	version: 1
	tokens: DesignTokens
	brand: { name: string; logo: string; avatar: string }
}
export function validateSnapshot(input: unknown): Snapshot {
	const v = input as Snapshot
	if (
		!v ||
		v.version !== 1 ||
		!v.brand ||
		Object.keys(v).sort().join(',') !== 'brand,tokens,version' ||
		Object.keys(v.brand).sort().join(',') !== 'avatar,logo,name'
	)
		throw Error('Invalid saved configuration.')
	if (
		typeof v.brand.name !== 'string' ||
		!v.brand.name.trim() ||
		v.brand.name.length > 80 ||
		/[\u0000-\u001f]/.test(v.brand.name)
	)
		throw Error('Enter a site name of 1–80 characters.')
	for (const kind of ['logo', 'avatar'] as const) {
		const value = v.brand[kind]
		if (
			typeof value !== 'string' ||
			!(
				value === '' ||
				value === `/brand/${kind}.png` ||
				(/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value) &&
					value.length <= 1500000)
			)
		)
			throw Error('Use a smaller PNG for your logo or avatar.')
	}
	for (const kind of ['logo', 'avatar'] as const) {
		const value = v.brand[kind]
		if (!value.startsWith('data:')) continue
		try {
			const header = Uint8Array.from(
				atob(value.split(',')[1].slice(0, 48)),
				(c) => c.charCodeAt(0),
			)
			const view = new DataView(header.buffer)
			if (
				header.length < 24 ||
				Array.from(header.slice(0, 8)).join(',') !==
					'137,80,78,71,13,10,26,10' ||
				view.getUint32(16) < 1 ||
				view.getUint32(20) < 1 ||
				view.getUint32(16) > 4096 ||
				view.getUint32(20) > 4096
			)
				throw Error()
		} catch {
			throw Error('Invalid PNG artwork.')
		}
	}

	return {
		version: 1,
		tokens: validateTokens(v.tokens),
		brand: { ...v.brand, name: v.brand.name.trim() },
	}
}
export function configurationFiles(
	snapshot: Snapshot,
	repository: string,
): Record<string, string> {
	return {
		'src/design-system/tokens.json':
			JSON.stringify(snapshot.tokens, null, '\t') + '\n',
		'src/styles/tokens.css': generateTokenCss(snapshot.tokens),
		'src/config/site.json':
			JSON.stringify(
				{
					name: snapshot.brand.name,
					shortName: snapshot.brand.name.slice(0, 24),
					repository,
				},
				null,
				'\t',
			) + '\n',
		'src/config/brand.json':
			JSON.stringify(
				{
					logo: snapshot.brand.logo ? '/brand/logo.png' : '',
					avatar: snapshot.brand.avatar ? '/brand/avatar.png' : '',
				},
				null,
				'\t',
			) + '\n',
	}
}
