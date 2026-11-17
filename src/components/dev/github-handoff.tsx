'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GitHubIcon, ForkIcon } from '@/components/ui/github-icons'
import type { Snapshot } from '@/lib/github/snapshot'
type Status = { configured: boolean; connected: boolean; login: string | null }
type Result = {
	repository: string
	commit: string
	deploy: string
	fingerprint: string
}
const nameStorage = 'coast.github.repository-choice'
function suggestedName(name: string) {
	const slug = name
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 70)
	return !slug || slug === 'coast' ? 'my-coast-site' : slug
}
function rememberedName(siteName: string) {
	try {
		const saved = JSON.parse(sessionStorage.getItem(nameStorage) || 'null')
		return saved?.siteName === siteName && typeof saved.name === 'string'
			? saved.name
			: null
	} catch {
		return null
	}
}
export function GitHubHandoff({
	snapshot,
	onSave,
	onBusyChange,
	preparing = false,
}: {
	snapshot: Snapshot
	onSave: () => Promise<Snapshot>
	onBusyChange: (busy: boolean) => void
	preparing?: boolean
}) {
	const [auth, setAuth] = useState<Status | null>(null)
	const [customName, setCustomName] = useState(() =>
		rememberedName(snapshot.brand.name),
	)
	const [busy, setBusy] = useState(false)
	const [checking, setChecking] = useState(true)
	useEffect(() => {
		onBusyChange(busy)
		return () => onBusyChange(false)
	}, [busy, onBusyChange])
	const [notice, setNotice] = useState('')
	const [result, setResult] = useState<Result | null>(null)
	const [optionsOpen, setOptionsOpen] = useState(false)
	const name = customName ?? suggestedName(snapshot.brand.name)
	const validName = /^[\w.-]{1,80}$/.test(name) && name !== '.' && name !== '..'
	const fingerprint = JSON.stringify(snapshot) + '\n' + name
	const visibleResult = result?.fingerprint === fingerprint ? result : null
	async function loadStatus() {
		setChecking(true)
		try {
			const response = await fetch('/api/github/status', { cache: 'no-store' })
			if (!response.ok) throw Error()
			setAuth(await response.json())
		} catch {
			setNotice(
				'Could not reach GitHub sign-in. Retry when your connection is available.',
			)
		} finally {
			setChecking(false)
		}
	}
	useEffect(() => {
		let active = true
		fetch('/api/github/status', { cache: 'no-store' })
			.then((r) => {
				if (!r.ok) throw Error()
				return r.json()
			})
			.then((value) => {
				if (active) setAuth(value)
			})
			.catch(() => {
				if (active)
					setNotice(
						'Could not reach GitHub sign-in. Retry when your connection is available.',
					)
			})
			.finally(() => {
				if (active) setChecking(false)
			})
		if (new URLSearchParams(location.search).get('github') === 'failed')
			setTimeout(() => {
				if (active)
					setNotice(
						'Sign-in wasn’t completed. Your saved configuration is safe. Continue with GitHub to try again.',
					)
			}, 0)
		return () => {
			active = false
		}
	}, [])
	async function continueFlow() {
		if (busy || preparing || checking || !validName) return
		setBusy(true)
		setNotice('Saving your latest configuration…')
		try {
			const saved = await onSave()
			if (!auth?.configured) {
				setNotice(
					'Your configuration is saved on this device. GitHub sign-in isn’t enabled on this site yet.',
				)
				return
			}
			sessionStorage.setItem(
				nameStorage,
				JSON.stringify({ siteName: saved.brand.name, name }),
			)
			if (!auth.connected) {
				setNotice('Opening GitHub sign-in…')
				location.assign(
					new URL(
						`/api/github/authorize?returnTo=${encodeURIComponent(location.pathname)}`,
						location.origin,
					).href,
				)
				return
			}
			setNotice('Creating your repository with the saved configuration…')
			const response = await fetch('/api/github/fork', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ snapshot: saved, repositoryName: name }),
			})
			const data = await response.json()
			if (!response.ok) {
				if (response.status === 401)
					setAuth((current) =>
						current ? { ...current, connected: false, login: null } : null,
					)
				if (response.status === 409 || response.status === 422)
					setOptionsOpen(true)
				throw Error(
					data.error ||
						'Could not create your fork. Your configuration is saved; try again.',
				)
			}
			setResult({ ...data, fingerprint: JSON.stringify(saved) + '\n' + name })
			setNotice(
				'Your website configuration is committed. Your repository is ready.',
			)
		} catch (error) {
			setNotice(
				error instanceof Error
					? error.message
					: 'Could not continue. Your saved configuration is safe.',
			)
		} finally {
			setBusy(false)
		}
	}
	async function disconnect() {
		setBusy(true)
		try {
			const response = await fetch('/api/github/disconnect', { method: 'POST' })
			if (!response.ok) throw Error()
			setAuth((current) =>
				current ? { ...current, connected: false, login: null } : null,
			)
			setResult(null)
			setNotice('Disconnected from GitHub.')
		} catch {
			setNotice('Could not disconnect. Please retry.')
		} finally {
			setBusy(false)
		}
	}
	return (
		<section
			className='github-handoff'
			aria-label='Create your website repository'
		>
			{visibleResult ? (
				<>
					<a
						className='button button--primary handoff-primary'
						href={visibleResult.repository}
						target='_blank'
						rel='noopener noreferrer'
					>
						<GitHubIcon />
						Open my repository
					</a>
					<div className='config-links'>
						<p className='form-hint'>
							In Vercel, choose Import Git Repository and select{' '}
							{visibleResult.repository.replace('https://github.com/', '')}.
						</p>
						<a
							href={visibleResult.deploy}
							target='_blank'
							rel='noopener noreferrer'
						>
							Deploy on Vercel ↗
						</a>
						<a
							href={visibleResult.commit}
							target='_blank'
							rel='noopener noreferrer'
						>
							Review configuration commit ↗
						</a>
					</div>
				</>
			) : (
				<>
					<p className='handoff-summary'>
						{auth?.connected
							? `Ready to create ${auth.login}/${name}`
							: 'Your design → your GitHub → your website'}
					</p>
					<p className='form-hint'>
						Your latest preview is saved automatically before continuing. Your
						resume is never sent to GitHub.
					</p>
					<details
						open={optionsOpen}
						onToggle={(e) => setOptionsOpen(e.currentTarget.open)}
						className='repository-options'
					>
						<summary>Repository options</summary>
						<label className='config-label'>
							Repository name
							<input
								className='input'
								value={name}
								maxLength={80}
								onChange={(e) => setCustomName(e.target.value)}
								disabled={busy}
							/>
						</label>
						{!validName && (
							<p className='form-hint'>
								Use letters, numbers, dots, underscores, or hyphens.
							</p>
						)}
						<p className='form-hint'>
							{auth?.login
								? `GitHub account: ${auth.login}`
								: 'You’ll choose your GitHub account during sign-in.'}{' '}
							· Public repository
						</p>
						{auth?.connected && (
							<Button
								variant='quiet'
								disabled={busy}
								onClick={() => void disconnect()}
							>
								Use another GitHub account
							</Button>
						)}
					</details>
					{auth && !auth.configured && (
						<p className='handoff-unavailable'>
							GitHub sign-in isn’t enabled on this site yet. Save your version
							here or use the download tools.
						</p>
					)}
					<Button
						className='handoff-primary'
						disabled={
							busy ||
							preparing ||
							checking ||
							!validName ||
							(!auth && !checking)
						}
						onClick={() => void continueFlow()}
					>
						<GitHubIcon />
						{preparing
							? 'Preparing image…'
							: busy
								? 'Please wait…'
								: checking
									? 'Checking GitHub…'
									: auth?.connected
										? 'Create my fork'
										: auth?.configured
											? 'Continue with GitHub'
											: 'Save configuration'}
						{auth?.connected && <ForkIcon />}
					</Button>
					{!auth && !checking && (
						<Button variant='secondary' onClick={() => void loadStatus()}>
							Retry connection
						</Button>
					)}
				</>
			)}
			<p className='config-status' role='status'>
				{notice}
			</p>
		</section>
	)
}
