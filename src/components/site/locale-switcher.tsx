'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
export function LocaleSwitcher() {
	const locale = useLocale()
	const t = useTranslations('Navigation')
	const router = useRouter()
	const pathname = usePathname()
	const [pending, startTransition] = useTransition()
	return (
		<label className='locale-switcher'>
			<span className='sr-only'>{t('language')}</span>
			<select
				value={locale}
				disabled={pending}
				onChange={(event) => {
					const next = event.target.value
					if (routing.locales.includes(next as 'en' | 'es' | 'it'))
						startTransition(() =>
							router.replace(pathname, { locale: next as 'en' | 'es' | 'it' }),
						)
				}}
			>
				<option value='en'>English</option>
				<option value='es'>Español</option>
				<option value='it'>Italiano</option>
			</select>
		</label>
	)
}
