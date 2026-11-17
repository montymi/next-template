'use client'
import { GitHubIcon, ForkIcon } from '@/components/ui/github-icons'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import site from '@/config/site.json'
import { BrandMark, BrandName, BrandAvatar } from './brand-preview'
import { ThemeToggle } from './theme-toggle'
import { LocaleSwitcher } from './locale-switcher'

function HeaderContent() {
	const t = useTranslations('Navigation')
	const path = usePathname()
	const [open, setOpen] = useState(false)
	return (
		<header className='site-header container'>
			<Link
				href='/'
				className='brand'
				aria-label={`${site.name}, ${t('overview')}`}
			>
				<BrandMark />
				<BrandName />
			</Link>
			<nav
				className={`main-nav ${open ? 'is-open' : ''}`}
				id='site-navigation'
				aria-label={t('menu')}
			>
				{[
					['/', 'overview'],
					['/design-system', 'system'],
					['/getting-started', 'guide'],
				].map(([href, key]) => (
					<Link
						key={href}
						href={href}
						aria-current={path === href ? 'page' : undefined}
						onClick={() => setOpen(false)}
					>
						{t(key)}
					</Link>
				))}
				<a
					className='nav-fork'
					href={`${site.repository}/fork`}
					target='_blank'
					rel='noopener noreferrer'
					onClick={() => setOpen(false)}
				>
					<GitHubIcon />
					{t('fork')}
					<ForkIcon />
				</a>
			</nav>
			<div className='header-tools'>
				<BrandAvatar />
				<LocaleSwitcher />
				<ThemeToggle />
				<button
					className='icon-button menu-toggle'
					type='button'
					aria-label={open ? t('closeMenu') : t('menu')}
					aria-expanded={open}
					aria-controls='site-navigation'
					onClick={() => setOpen(!open)}
				>
					<svg
						aria-hidden='true'
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.4'
					>
						<path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 8h16M4 16h16'} />
					</svg>
				</button>
			</div>
		</header>
	)
}
export function SiteHeader() {
	const pathname = usePathname()
	return <HeaderContent key={pathname} />
}
