'use client'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useHydrated } from './use-hydrated'
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const hydrated = useHydrated()
	const t = useTranslations('Navigation')
	const dark = resolvedTheme === 'dark'
	return (
		<button
			className='icon-button'
			type='button'
			disabled={!hydrated}
			aria-label={dark ? t('themeLight') : t('themeDark')}
			onClick={() => setTheme(dark ? 'light' : 'dark')}
		>
			<svg
				aria-hidden='true'
				width='19'
				height='19'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.4'
			>
				{hydrated && dark ? (
					<path d='M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z' />
				) : (
					<>
						<circle cx='12' cy='12' r='4' />
						<path d='M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5' />
					</>
				)}
			</svg>
		</button>
	)
}
