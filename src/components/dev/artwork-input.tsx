'use client'
import Image from 'next/image'
import { useId, useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { readArtwork } from '@/lib/starter-kit'
export function ArtworkInput({
	kind,
	value,
	onChange,
	onStatus,
	onPendingChange,
}: {
	kind: 'logo' | 'avatar'
	value: string
	onChange: (value: string) => void
	onStatus: (message: string) => void
	onPendingChange: (pending: boolean) => void
}) {
	const id = useId()
	const input = useRef<HTMLInputElement>(null)
	const sequence = useRef(0)
	const callbacks = useRef({ onPendingChange })
	useEffect(() => {
		callbacks.current = { onPendingChange }
	}, [onPendingChange])
	useEffect(
		() => () => {
			sequence.current++
			callbacks.current.onPendingChange(false)
		},
		[],
	)
	const [selection, setSelection] = useState<{
		value: string
		name: string
	} | null>(null)
	const [pending, setPending] = useState(false)
	const [error, setError] = useState('')
	const label = kind === 'logo' ? 'Logo image' : 'Avatar image'
	const filename = value
		? selection?.value === value
			? selection.name
			: `Saved ${kind}`
		: 'PNG, JPEG or WebP · up to 2 MB'
	async function choose(file: File | undefined) {
		if (!file) return
		const request = ++sequence.current
		setPending(true)
		onPendingChange(true)
		setError('')
		try {
			const image = await readArtwork(file)
			if (request !== sequence.current) return
			setSelection({ name: file.name, value: image })
			onChange(image)
			onStatus('Artwork ready. Included in your starter kit.')
		} catch (cause) {
			if (request !== sequence.current) return
			const message =
				cause instanceof Error && /^(Choose|Use) /.test(cause.message)
					? cause.message
					: 'Could not read this image. Choose a valid PNG, JPEG, or WebP.'
			setError(message)
		} finally {
			if (request === sequence.current) {
				setPending(false)
				onPendingChange(false)
			}
		}
	}
	function remove() {
		sequence.current++
		setPending(false)
		onPendingChange(false)
		setSelection(null)
		setError('')
		if (input.current) input.current.value = ''
		onChange('')
		onStatus(`${kind === 'logo' ? 'Logo' : 'Avatar'} removed.`)
	}
	return (
		<div className='artwork-field'>
			<label className='artwork-label' htmlFor={id}>
				{label}
			</label>
			<input
				className='sr-only'
				tabIndex={-1}
				ref={input}
				id={id}
				type='file'
				accept='image/png,image/jpeg,image/webp'
				aria-describedby={error ? `${id}-error` : undefined}
				aria-invalid={!!error}
				onChange={(event) => {
					const file = event.target.files?.[0]
					event.target.value = ''
					void choose(file)
				}}
			/>
			<div className='artwork-control' aria-busy={pending}>
				<div className={`artwork-preview artwork-preview--${kind}`}>
					{value ? (
						<Image
							src={value}
							alt={`${kind === 'logo' ? 'Logo' : 'Avatar'} preview`}
							width={56}
							height={56}
							unoptimized
						/>
					) : (
						<svg
							aria-hidden='true'
							width='22'
							height='22'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='1.4'
						>
							{kind === 'avatar' ? (
								<>
									<circle cx='12' cy='8' r='3' />
									<path d='M5 21v-2a7 7 0 0 1 14 0v2' />
								</>
							) : (
								<>
									<rect x='3' y='3' width='18' height='18' rx='3' />
									<circle cx='8' cy='8' r='1.5' />
									<path d='m3 17 5-5 4 4 4-6 5 7' />
								</>
							)}
						</svg>
					)}
				</div>
				<div className='artwork-info'>
					<span className='artwork-filename' title={filename}>
						{pending ? 'Preparing image…' : filename}
					</span>
					<div className='artwork-actions'>
						<Button
							variant='secondary'
							className='artwork-choose'
							disabled={pending}
							aria-label={`${value ? 'Replace' : 'Choose'} ${kind} image`}
							aria-describedby={error ? `${id}-error` : undefined}
							onClick={() => input.current?.click()}
						>
							<svg
								aria-hidden='true'
								width='14'
								height='14'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M12 16V3m-4 4 4-4 4 4M4 16v4h16v-4' />
							</svg>
							{value ? 'Replace image' : 'Choose image'}
						</Button>
						{value && (
							<button
								className='artwork-remove'
								type='button'
								aria-label={`Remove ${kind}`}
								onClick={remove}
							>
								<svg
									aria-hidden='true'
									width='14'
									height='14'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<path d='M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7' />
								</svg>
								Remove
							</button>
						)}
					</div>
				</div>
			</div>
			{error && (
				<p className='artwork-error' role='alert' id={`${id}-error`}>
					{error}
				</p>
			)}
		</div>
	)
}
