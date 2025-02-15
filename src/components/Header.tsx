import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React from 'react'
import useNamespace from '@/hooks/useNamespace'
import { useEffect, useState } from 'react'
import { flagMapping } from '@/styles/mappings'

const navigation = ['home', 'about', 'services']

interface LangProps {
	lang: string
}

interface TranslationProps {
	t: (key: string) => React.ReactNode
}

export default function Header() {
	const i18n = useI18n()
	const router = useRouter()

	const handleLanguageChange = (lang: string) => {
		i18n.locale(lang)
		router.replace(router.pathname, router.asPath, { locale: lang })
	}

	const { t } = useNamespace('header')

	return (
		<header
			className={`bg-secondary-bg dark:bg-secondary-bg-dark shadow-md sticky top-0 z-50`}
		>
			<Notice t={t} />
			<div className='container mx-auto px-4 py-4 flex flex-row justify-between items-center'>
				<Logo />
				<Navigation t={t} />
				<Utils lang={i18n.locale()} onLanguageChange={handleLanguageChange} />
			</div>
		</header>
	)
}

import {
	BellAlertIcon,
	LanguageIcon,
	UserCircleIcon,
} from '@heroicons/react/24/solid'

function Logo() {
	return (
		<Link href='/profile'>
			<UserCircleIcon className='h-10 w-10 text-secondary-text dark:text-secondary-text-dark hover:cursor-pointer hover:bg-action-hover dark:hover:bg-action-hover-dark rounded ' />
		</Link>
	)
}

function Navigation({ t }: TranslationProps) {
	// Get all navigation items from translations
	const navigationItems = navigation.filter(
		(key) => typeof t(`navigation.${key}`) === 'string',
	)

	return (
		<nav>
			<ul className='flex space-x-4'>
				{navigationItems.map((item) => (
					<li
						key={item}
						className='hover:bg-action-hover dark:hover:bg-action-hover-dark px-2 py-1 rounded'
					>
						<Link href={`/${item === 'home' ? '' : item}`}>
							{t(`navigation.${item}`)}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

export function Notice({ t }: TranslationProps) {
	const title = t('title')
	if (!title) return null

	return (
		<div
			className='bg-warning-bg dark:bg-warning-bg-dark text-warning-text dark:text-warning-text-dark text-center h-4 flex items-center justify-center relative cursor-pointer p-4 hover:bg-action-bg dark:hover:bg-action-bg-dark'
			onClick={(e) => {
				const parent = e.currentTarget
				if (parent) {
					parent.style.display = 'none'
				}
			}}
		>
			<BellAlertIcon className='h-4 w-4 mr-2' />
			<h1>{title}</h1>
		</div>
	)
}

interface UtilsProps extends LangProps {
	onLanguageChange: (lang: string) => void
}

import locales from '@/locales.json'

export function Utils({ lang, onLanguageChange }: UtilsProps) {
	const [mounted, setMounted] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = React.useRef<HTMLDivElement>(null)

	useEffect(() => {
		setMounted(true)
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	if (!mounted) return null

	return (
		<div className='relative' ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center space-x-2 p-2 rounded-md hover:bg-action-hover dark:hover:bg-action-hover-dark'
			>
				<LanguageIcon className='h-5 w-5' />
				<span>{flagMapping[lang]}</span>
			</button>

			{isOpen && (
				<div className='absolute right-0 mt-2 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg'>
					{locales.map((locale: string) => (
						<button
							key={locale}
							onClick={() => {
								onLanguageChange(locale)
								setIsOpen(false)
							}}
							className='block text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
						>
							<span className='mr-2'>{flagMapping[locale]}</span>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
