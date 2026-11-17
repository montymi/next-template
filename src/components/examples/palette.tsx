'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useHydrated } from '@/components/site/use-hydrated'
import { useDesignTokens } from '@/design-system/preview'
export function Palette() {
	const tokens = useDesignTokens()
	const t = useTranslations('System')
	const { resolvedTheme } = useTheme()
	const hydrated = useHydrated()
	const colors =
		hydrated && resolvedTheme === 'dark' ? tokens.dark : tokens.light
	const [copied, setCopied] = useState('')
	const [failed, setFailed] = useState(false)
	async function copy(value: string) {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(value)
			setFailed(false)
		} catch {
			setFailed(true)
		}
	}
	const swatches = [
		['background', 'paletteBackground'],
		['primary', 'palettePrimary'],
		['surfaceAlt', 'paletteSurface'],
		['accent', 'paletteAccent'],
		['text', 'paletteTextColor'],
	] as const
	return (
		<>
			<div className='palette-grid'>
				{swatches.map(([key, label]) => (
					<button
						className='swatch'
						key={key}
						onClick={() => void copy(colors[key])}
						aria-label={t('copy', { value: colors[key] })}
					>
						<span
							className='swatch-color'
							style={{ background: colors[key] }}
						/>
						<span className='swatch-name'>{t(label)}</span>
						<code>{colors[key]}</code>
					</button>
				))}
			</div>
			<p className='status' role='status'>
				{failed ? t('copyFailed') : copied ? `${t('copied')}: ${copied}` : ''}
			</p>
		</>
	)
}
