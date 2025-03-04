/**
 * @jest-environment jsdom
 * @page Home Page Tests
 */

import { render, screen } from '@testing-library/react'
import { act } from 'react'
import HomePage from '@/pages/index'
import { I18nProvider } from 'next-localization'

// Mock framer-motion
jest.mock('framer-motion', () => ({
	motion: {
		div: ({ children, whileHover, whileTap, ...props }: any) => (
			<div {...props}>{children}</div>
		),
		h2: ({ children, whileHover, whileTap, ...props }: any) => (
			<h2 {...props}>{children}</h2>
		),
		p: ({ children, whileHover, whileTap, ...props }: any) => (
			<p {...props}>{children}</p>
		),
		span: ({ children, whileHover, whileTap, ...props }: any) => (
			<span {...props}>{children}</span>
		),
	},
}))

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/',
	}),
}))

describe('HomePage', () => {
	const mockTranslations = {
		welcome: 'Welcome! 👋',
		description: 'A powerful starter template with everything you need',
		features: {
			internationalization: {
				title: 'Internationalization',
				description: 'Built-in support for multiple languages',
			},
			themeControl: {
				title: 'Theme Control',
				description: 'Light/Dark mode with customizable themes',
			},
			pwaReady: {
				title: 'PWA Ready',
				description: 'Progressive Web App support',
			},
			ssrSsg: {
				title: 'SSR & SSG',
				description: 'Server-side rendering and static generation',
			},
		},
	}

	beforeEach(async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<HomePage />
				</I18nProvider>,
			)
		})
	})

	it('renders feature icons', () => {
		const icons = ['🌍', '🎨', '📱', '🚀']
		icons.forEach((icon) => {
			expect(screen.getByText(icon)).toBeInTheDocument()
		})
	})
})
