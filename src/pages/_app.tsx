import { AppProps } from 'next/app'
import { I18nProvider } from 'next-localization'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import '@/styles/globals.css'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'

interface AppPageProps {
	lngDict: Record<string, unknown>
	[key: string]: unknown
}

export default function MyApp({
	Component,
	pageProps,
}: AppProps<AppPageProps>) {
	const router = useRouter()
	const { lngDict, ...rest } = pageProps
	const [isDarkMode, setIsDarkMode] = useState(false)

	useEffect(() => {
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		setIsDarkMode(darkModeMediaQuery.matches)
		darkModeMediaQuery.addEventListener('change', (e) => {
			setIsDarkMode(e.matches)
		})
	}, [])

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			disableTransitionOnChange
		>
			<I18nProvider lngDict={lngDict} locale={router.locale || 'en'}>
				<Head>
					<meta
						name='viewport'
						content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
					/>
				</Head>
				<Header />
				<Component {...rest} />
				<Footer />
			</I18nProvider>
		</ThemeProvider>
	)
}
