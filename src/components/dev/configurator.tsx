'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import source from '@/design-system/tokens.json'
import { generateTokenCss, validateTokens } from '@/design-system/format.mjs'
import { publishPreview } from '@/design-system/preview'
import type { DesignTokens, ColorMode, ColorKey } from '@/design-system/types'

const storageKey = 'coast.dev.ui-draft'
const colorLabels: Record<ColorKey, string> = {
	background: 'Background',
	surface: 'Surface',
	surfaceAlt: 'Alternate surface',
	text: 'Text',
	muted: 'Muted text',
	primary: 'Primary',
	primaryStrong: 'Primary hover',
	primaryText: 'On primary',
	accent: 'Accent',
	accentSurface: 'Accent surface',
	border: 'Border',
	ring: 'Focus ring',
}
const fontChoices = [
	['Inter, Arial, sans-serif', 'Inter'],
	['Newsreader, Georgia, serif', 'Newsreader'],
	['system-ui, Arial, sans-serif', 'System sans'],
	["Georgia, 'Times New Roman', serif", 'System serif'],
]
function initialTokens(): DesignTokens {
	try {
		const saved = localStorage.getItem(storageKey)
		if (saved) return validateTokens(JSON.parse(saved))
	} catch {}
	return structuredClone(source)
}

function ColorField({
	name,
	value,
	onChange,
}: {
	name: string
	value: string
	onChange: (value: string) => void
}) {
	const [draft, setDraft] = useState(value)
	const [previous, setPrevious] = useState(value)
	if (previous !== value) {
		setPrevious(value)
		setDraft(value)
	}
	return (
		<div className='config-color'>
			<label>
				<span>{name}</span>
				<input
					type='color'
					value={value}
					aria-label={`${name} color`}
					onChange={(event) => {
						onChange(event.target.value)
						setDraft(event.target.value)
					}}
				/>
			</label>
			<input
				className='input'
				aria-label={`${name} hex`}
				value={draft}
				maxLength={7}
				spellCheck={false}
				onChange={(event) => {
					setDraft(event.target.value)
					if (/^#[0-9a-f]{6}$/i.test(event.target.value))
						onChange(event.target.value)
				}}
				onBlur={() => setDraft(value)}
			/>
		</div>
	)
}

export default function Configurator() {
	const [tokens, setTokens] = useState<DesignTokens>(initialTokens)
	const { resolvedTheme, setTheme } = useTheme()
	const [mode, setMode] = useState<ColorMode>(
		resolvedTheme === 'dark' ? 'dark' : 'light',
	)
	const [status, setStatus] = useState('')
	const [saving, setSaving] = useState(false)
	const dialog = useRef<HTMLDialogElement>(null)
	useEffect(() => {
		publishPreview(tokens)
		try {
			localStorage.setItem(storageKey, JSON.stringify(tokens))
		} catch {}
	}, [tokens])
	function changeColor(key: ColorKey, value: string) {
		setTokens((current) => ({
			...current,
			[mode]: { ...current[mode], [key]: value },
		}))
		setStatus('Preview updated.')
	}
	function changeMode(next: ColorMode) {
		setMode(next)
		setTheme(next)
	}
	function reset() {
		setTokens(structuredClone(source))
		try {
			localStorage.removeItem(storageKey)
		} catch {}
		setStatus('Preview reset to the project settings.')
	}
	async function copy() {
		try {
			await navigator.clipboard.writeText(JSON.stringify(tokens, null, '\t'))
			setStatus('JSON copied.')
		} catch {
			setStatus('Clipboard unavailable. Use Download JSON instead.')
		}
	}
	function download() {
		const url = URL.createObjectURL(
			new Blob([JSON.stringify(tokens, null, '\t') + '\n'], {
				type: 'application/json',
			}),
		)
		const link = document.createElement('a')
		link.href = url
		link.download = 'design-tokens.json'
		link.click()
		setTimeout(() => URL.revokeObjectURL(url), 0)
		setStatus('JSON downloaded.')
	}
	async function save() {
		setSaving(true)
		setStatus('Saving…')
		try {
			const response = await fetch('/api/dev/tokens', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(tokens),
			})
			const result = await response.json()
			if (!response.ok) throw new Error(result.error || 'Save failed.')
			try {
				localStorage.removeItem(storageKey)
			} catch {}
			setStatus('Saved to src/design-system/tokens.json. CSS regenerated.')
		} catch (error) {
			setStatus(
				error instanceof Error
					? error.message
					: 'Could not save. Download the JSON instead.',
			)
		} finally {
			setSaving(false)
		}
	}
	return (
		<>
			<style data-dev-preview>{generateTokenCss(tokens)}</style>
			<button
				className='config-trigger'
				type='button'
				onClick={() => dialog.current?.showModal()}
			>
				<svg
					aria-hidden='true'
					width='18'
					height='18'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.5'
				>
					<path d='M4 7h16M4 17h16' />
					<circle cx='9' cy='7' r='3' fill='var(--surface)' />
					<circle cx='15' cy='17' r='3' fill='var(--surface)' />
				</svg>
				Customize UI <span>DEV</span>
			</button>
			<dialog
				ref={dialog}
				className='config-panel'
				aria-labelledby='config-title'
			>
				<header>
					<div>
						<p className='eyebrow'>DEVELOPMENT ONLY</p>
						<h2 id='config-title'>Make it yours.</h2>
					</div>
					<button
						className='icon-button'
						type='button'
						aria-label='Close configurator'
						onClick={() => dialog.current?.close()}
					>
						×
					</button>
				</header>
				<div className='config-body'>
					<p className='config-intro'>
						Changes preview instantly. Save to update this project, or export
						your token file.
					</p>
					<div className='config-tabs' aria-label='Color mode'>
						<button
							type='button'
							aria-pressed={mode === 'light'}
							onClick={() => changeMode('light')}
						>
							Light
						</button>
						<button
							type='button'
							aria-pressed={mode === 'dark'}
							onClick={() => changeMode('dark')}
						>
							Dark
						</button>
					</div>
					<fieldset>
						<legend>Colors</legend>
						<div className='config-colors'>
							{(Object.keys(colorLabels) as ColorKey[]).map((key) => (
								<ColorField
									key={`${mode}-${key}`}
									name={colorLabels[key]}
									value={tokens[mode][key]}
									onChange={(value) => changeColor(key, value)}
								/>
							))}
						</div>
					</fieldset>
					<fieldset>
						<legend>Typography</legend>
						{(['display', 'body'] as const).map((key) => (
							<label className='config-label' key={key}>
								{key === 'display' ? 'Display font' : 'Body font'}
								<select
									className='input'
									value={tokens.fonts[key]}
									onChange={(event) =>
										setTokens((current) => ({
											...current,
											fonts: { ...current.fonts, [key]: event.target.value },
										}))
									}
								>
									{fontChoices.map(([value, label]) => (
										<option value={value} key={value}>
											{label}
										</option>
									))}
								</select>
							</label>
						))}
					</fieldset>
					<fieldset>
						<legend>Layout</legend>
						<label className='config-label'>
							Spacing scale
							<input
								type='range'
								aria-label='Spacing scale'
								min='.75'
								max='1.5'
								step='.05'
								value={tokens.spacing['9'] / source.spacing['9']}
								onChange={(event) => {
									const scale = Number(event.target.value)
									setTokens((current) => ({
										...current,
										spacing: Object.fromEntries(
											Object.entries(source.spacing).map(([key, value]) => [
												key,
												Math.round(value * scale),
											]),
										) as DesignTokens['spacing'],
									}))
								}}
							/>
						</label>
						<label className='config-label'>
							Corner radius
							<input
								type='range'
								aria-label='Corner radius'
								min='0'
								max='28'
								step='2'
								value={tokens.radii.medium}
								onChange={(event) => {
									const value = Number(event.target.value)
									setTokens((current) => ({
										...current,
										radii: {
											small: Math.round(value / 3),
											medium: value,
											large: value * 2,
										},
									}))
								}}
							/>
						</label>
					</fieldset>
				</div>
				<div className='config-actions'>
					<Button disabled={saving} onClick={() => void save()}>
						{saving ? 'Saving…' : 'Save to project'}
					</Button>
					<Button variant='secondary' onClick={download}>
						Download JSON
					</Button>
					<Button variant='quiet' onClick={() => void copy()}>
						Copy JSON
					</Button>
					<Button variant='quiet' onClick={reset}>
						Reset preview
					</Button>
				</div>
				<p className='config-status' role='status'>
					{status}
				</p>
			</dialog>
		</>
	)
}
