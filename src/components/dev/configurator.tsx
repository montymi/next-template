'use client'
import { GitHubIcon, ForkIcon } from '@/components/ui/github-icons'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { readArtwork, starterKit, downloadBytes } from '@/lib/starter-kit'
import site from '@/config/site.json'
import brandSource from '@/config/brand.json'
import { publishBrand } from '@/components/site/brand-preview'
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
	const [brand, setBrand] = useState({ ...brandSource, name: site.name })
	const [resume, setResume] = useState('')
	const [repo, setRepo] = useState('')
	const isDev = process.env.NODE_ENV === 'development'
	useEffect(() => publishBrand(brand), [brand])
	async function upload(file: File | undefined, key: 'logo' | 'avatar') {
		if (!file) return
		try {
			setBrand((current) => ({ ...current, [key]: '' }))
			const image = await readArtwork(file)
			setBrand((current) => ({ ...current, [key]: image }))
			setStatus('Artwork ready. Included in your starter kit.')
		} catch (error) {
			setStatus(
				error instanceof Error ? error.message : 'Could not read image.',
			)
		}
	}
	async function exportKit() {
		setSaving(true)
		try {
			downloadBytes(
				await starterKit(tokens, brand, resume),
				'coast-starter.zip',
				'application/zip',
			)
			setStatus('Kit downloaded. Apply it to your fork before deploying.')
		} catch {
			setStatus('Could not export. Try a smaller image.')
		} finally {
			setSaving(false)
		}
	}
	const repoMatch = /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/?$/.exec(repo)
	const repoUrl = repoMatch
		? `https://github.com/${repoMatch[1]}/${repoMatch[2]}`
		: ''
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
				Customize UI <span>{isDev ? 'DEV' : 'MAKE YOURS'}</span>
			</button>
			<dialog
				ref={dialog}
				className='config-panel'
				aria-labelledby='config-title'
			>
				<header>
					<div>
						<p className='eyebrow'>
							{isDev ? 'LOCAL EDITOR' : 'YOUR SITE STARTS HERE'}
						</p>
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
						Preview your design, download your starter kit, then fork the
						repository. Apply the kit to your fork before deploying. Your
						artwork and resume stay in this browser until you download them.
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
						<legend>Identity & artwork</legend>
						<label className='config-label'>
							Site name
							<input
								className='input'
								maxLength={80}
								value={brand.name}
								onChange={(e) =>
									setBrand((current) => ({ ...current, name: e.target.value }))
								}
							/>
						</label>
						{(['logo', 'avatar'] as const).map((key) => (
							<label className='config-label' key={key}>
								{key === 'logo' ? 'Logo image' : 'Avatar image'}
								<input
									type='file'
									accept='image/png,image/jpeg,image/webp'
									onChange={(e) => void upload(e.target.files?.[0], key)}
								/>
								<button
									className='text-link'
									type='button'
									onClick={() =>
										setBrand((current) => ({ ...current, [key]: '' }))
									}
								>
									Remove {key}
								</button>
							</label>
						))}
						<p className='form-hint'>
							PNG, JPEG, WebP · up to 2 MB. Logo generates the favicon, Apple
							icon, PWA icons, and share image when you apply your kit.
						</p>
					</fieldset>
					<fieldset>
						<legend>Resume → agent brief</legend>
						<label className='config-label'>
							Resume text
							<textarea
								className='input'
								rows={4}
								maxLength={30000}
								value={resume}
								onChange={(e) => setResume(e.target.value)}
							/>
						</label>
						<label className='config-label'>
							Import resume (.txt or .md)
							<input
								type='file'
								accept='.txt,.md,text/plain,text/markdown'
								onChange={async (e) => {
									const file = e.target.files?.[0]
									if (!file) return
									if (file.size > 60000) {
										setStatus('Use a text resume under 60 KB.')
										return
									}
									setResume((await file.text()).slice(0, 30000))
									setStatus('Resume imported locally.')
								}}
							/>
						</label>
						<p className='form-hint'>
							Optional. Your kit includes PERSONALIZE.md for Codex or another
							coding agent. No resume is uploaded or sent to an AI service.
						</p>
					</fieldset>
					<fieldset>
						<legend>Fork → personalize → deploy</legend>
						<ol className='config-steps'>
							<li>Save your kit and fork on GitHub.</li>
							<li>
								In your fork: npm ci, then npm run customize --
								/path/to/coast-starter.zip.
							</li>
							<li>Review, commit, and push. Import your fork into Vercel.</li>
						</ol>
						<label className='config-label'>
							Your fork URL
							<input
								className='input'
								type='url'
								placeholder='https://github.com/you/your-site'
								value={repo}
								onChange={(e) => setRepo(e.target.value)}
							/>
						</label>
						{repoUrl && (
							<div className='config-links'>
								<a
									href={`https://codespaces.new/${repoMatch![1]}/${repoMatch![2]}`}
									target='_blank'
									rel='noopener noreferrer'
								>
									Open fork in Codespaces ↗
								</a>
								<a
									href={`https://vercel.com/new/git/external?repository-url=${encodeURIComponent(repoUrl)}`}
									target='_blank'
									rel='noopener noreferrer'
								>
									Deploy your fork on Vercel ↗
								</a>
							</div>
						)}
					</fieldset>
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
					<a
						className='button button--primary'
						href={`${site.repository}/fork`}
						target='_blank'
						rel='noopener noreferrer'
						onClick={() => void exportKit()}
					>
						<GitHubIcon />
						Save &amp; fork on GitHub
						<ForkIcon />
					</a>
					{isDev && (
						<Button disabled={saving} onClick={() => void save()}>
							Save tokens locally
						</Button>
					)}
					<Button
						disabled={saving}
						variant='secondary'
						onClick={() => void exportKit()}
					>
						Download starter kit
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
