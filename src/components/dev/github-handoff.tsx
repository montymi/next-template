'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GitHubIcon, ForkIcon } from '@/components/ui/github-icons'
import type { Snapshot } from '@/lib/github/snapshot'
type Status = { configured: boolean; connected: boolean; login: string | null }
type Result = { repository: string; commit: string; deploy: string }
export function GitHubHandoff({
	saved,
	dirty,
}: {
	saved: Snapshot | null
	dirty: boolean
}) {
	const [auth, setAuth] = useState<Status | null>(null)
	const [name, setName] = useState('my-coast-site')
	const [busy, setBusy] = useState(false)
	const [notice, setNotice] = useState('')
	const [result, setResult] = useState<Result | null>(null)
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
						'GitHub status could not be loaded. Reopen the editor to retry.',
					)
			})
		if (new URLSearchParams(location.search).get('github') === 'failed')
			setTimeout(() => {
				if (active)
					setNotice(
						'GitHub sign-in was not completed. Your saved version is safe; try connecting again.',
					)
			}, 0)
		return () => {
			active = false
		}
	}, [])
	async function fork() {
		if (!saved || dirty || busy) return
		setBusy(true)
		setNotice('Creating your fork and applying the saved version…')
		setResult(null)
		try {
			const response = await fetch('/api/github/fork', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ snapshot: saved, repositoryName: name }),
			})
			const data = await response.json()
			if (!response.ok) throw Error(data.error || 'Could not create the fork.')
			setResult(data)
			setNotice('Your saved configuration is committed in your GitHub fork.')
		} catch (error) {
			setNotice(
				error instanceof Error ? error.message : 'Could not create the fork.',
			)
		} finally {
			setBusy(false)
		}
	}
	async function disconnect() {
		await fetch('/api/github/disconnect', { method: 'POST' })
		setAuth((current) =>
			current ? { ...current, connected: false, login: null } : null,
		)
		setResult(null)
	}
	return (
		<fieldset className='github-handoff'>
			<legend>Fork your saved version</legend>
			<p className='form-hint'>
				{saved
					? `Saved version: ${saved.brand.name}`
					: 'Save your configuration first.'}
			</p>
			{dirty && saved && (
				<p className='form-hint'>
					You have unsaved changes. Save again to include them in your fork.
				</p>
			)}
			<p className='form-hint'>
				GitHub receives your saved colors, typography, spacing, name, logo, and
				avatar. Your resume stays out of the repository.
			</p>
			{auth === null ? (
				<p className='form-hint'>Checking GitHub connection…</p>
			) : !auth.configured ? (
				<p className='handoff-unavailable'>
					GitHub sign-in is not enabled on this deployment yet. Your saved
					version is available in Download starter kit.
				</p>
			) : !auth.connected ? (
				<Button
					variant='secondary'
					disabled={!saved || dirty}
					onClick={() =>
						location.assign(
							new URL(
								`/api/github/authorize?returnTo=${encodeURIComponent(location.pathname)}`,
								location.origin,
							).href,
						)
					}
				>
					<GitHubIcon />
					Connect GitHub
				</Button>
			) : (
				<>
					<p className='form-hint'>
						Connected as {auth.login} · public repositories only
					</p>
					<label className='config-label'>
						New repository name
						<input
							className='input'
							value={name}
							maxLength={80}
							pattern='[A-Za-z0-9_.-]+'
							onChange={(e) => setName(e.target.value)}
							disabled={busy}
						/>
					</label>
					<Button
						disabled={busy || !saved || dirty || !/^[-\w.]{1,80}$/.test(name)}
						onClick={() => void fork()}
					>
						<GitHubIcon />
						{busy ? 'Creating fork…' : 'Fork saved version'}
						<ForkIcon />
					</Button>
					<Button
						variant='quiet'
						disabled={busy}
						onClick={() => void disconnect()}
					>
						Disconnect GitHub
					</Button>
				</>
			)}
			{result && (
				<div className='config-links'>
					<a href={result.repository} target='_blank' rel='noopener noreferrer'>
						Open your configured fork ↗
					</a>
					<a href={result.commit} target='_blank' rel='noopener noreferrer'>
						Review the saved configuration commit ↗
					</a>
					<a href={result.deploy} target='_blank' rel='noopener noreferrer'>
						Deploy this fork on Vercel ↗
					</a>
				</div>
			)}
			<p className='config-status' role='status'>
				{notice}
			</p>
		</fieldset>
	)
}
