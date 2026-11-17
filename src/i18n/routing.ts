import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	locales: ['en', 'es', 'it'],
	defaultLocale: 'en',
	localePrefix: 'as-needed',
	localeCookie: { name: 'NEXT_LOCALE', maxAge: 31536000, sameSite: 'lax' },
})
