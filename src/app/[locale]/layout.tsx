import type { Metadata, Viewport } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import {
	getMessages,
	getTranslations,
	setRequestLocale,
} from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Providers } from '@/components/site/providers'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { DevTools } from '@/components/dev/entry'
import { siteOrigin } from '@/lib/metadata'
import site from '@/config/site.json'
import tokens from '@/design-system/tokens.json'
import '@/styles/tokens.css'
import '@/styles/globals.css'

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()
	const t = await getTranslations({ locale, namespace: 'Metadata' })
	const title = t('title', { name: site.name })
	const description = t('description')
	return {
		metadataBase: siteOrigin(),
		title: { default: title, template: `%s — ${site.name}` },
		description,
		applicationName: site.name,
		manifest: `/manifests/${locale}.webmanifest?v=coast-1`,
		icons: {
			icon: [
				{ url: '/favicon.ico?v=coast-1', sizes: '16x16 32x32 48x48' },
				{ url: '/favicon.svg?v=coast-1', type: 'image/svg+xml' },
			],
			apple: [{ url: '/apple-touch-icon.png?v=coast-1', sizes: '180x180' }],
		},
		openGraph: {
			type: 'website',
			siteName: site.name,
			title,
			description,
			locale: { en: 'en_US', es: 'es_ES', it: 'it_IT' }[locale],
			images: [
				{ url: '/social-card.png', width: 1200, height: 630, alt: site.name },
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['/social-card.png'],
		},
	}
}
export const viewport: Viewport = { themeColor: tokens.light.primary }
export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()
	setRequestLocale(locale)
	const messages = await getMessages()
	const t = await getTranslations('Navigation')
	return (
		<html lang={locale} suppressHydrationWarning>
			<body>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<a className='skip-link' href='#main-content'>
							{t('skip')}
						</a>
						<SiteHeader />
						<main id='main-content'>{children}</main>
						<SiteFooter />
						{process.env.NODE_ENV === 'development' && <DevTools />}
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
