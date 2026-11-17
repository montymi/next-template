'use client'
import { useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, buttonClass } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
export function Playground() {
	const t = useTranslations('System')
	const dialog = useRef<HTMLDialogElement>(null)
	const id = useId()
	const [notice, setNotice] = useState(false)
	const [saved, setSaved] = useState(false)
	return (
		<div className='component-examples'>
			<Card>
				<div className='button-row'>
					<Button onClick={() => setNotice(true)}>{t('primary')}</Button>
					<Button
						variant='secondary'
						onClick={() => dialog.current?.showModal()}
					>
						{t('secondary')}
					</Button>
					<Link className={buttonClass('quiet')} href='/getting-started'>
						{t('quiet')} <span aria-hidden='true'>→</span>
					</Link>
				</div>
				<p className='status' role='status'>
					{notice ? t('notification') : ''}
				</p>
				<details className='accordion'>
					<summary>{t('accordionTitle')}</summary>
					<p>{t('accordionText')}</p>
				</details>
			</Card>
			<Card>
				<h3>{t('formTitle')}</h3>
				<form
					className='demo-form'
					onSubmit={(event) => {
						event.preventDefault()
						setSaved(true)
					}}
				>
					<label htmlFor={`${id}-email`}>{t('email')}</label>
					<Input
						id={`${id}-email`}
						type='email'
						name='email'
						placeholder={t('emailPlaceholder')}
						required
					/>
					<label htmlFor={`${id}-role`}>{t('role')}</label>
					<select className='input' id={`${id}-role`} name='role'>
						<option>{t('designer')}</option>
						<option>{t('developer')}</option>
						<option>{t('other')}</option>
					</select>
					<p className='form-hint'>{t('formNote')}</p>
					<Button type='submit'>{t('submit')}</Button>
					<p className='status' role='status'>
						{saved ? t('formSaved') : ''}
					</p>
				</form>
			</Card>
			<dialog
				ref={dialog}
				className='dialog'
				aria-labelledby={`${id}-dialog-title`}
			>
				<h2 id={`${id}-dialog-title`}>{t('dialogTitle')}</h2>
				<p>{t('dialogText')}</p>
				<Button onClick={() => dialog.current?.close()}>
					{t('dialogClose')}
				</Button>
			</dialog>
		</div>
	)
}
