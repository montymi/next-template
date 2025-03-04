/**
 * @jest-environment jsdom
 * @page About Page Tests
 */

import { render, screen } from '@testing-library/react'
import { act } from 'react'
import AboutPage from '@/pages/about'
import { I18nProvider } from 'next-localization'

// Mock framer-motion
jest.mock('framer-motion', () => ({
	motion: {
		div: ({ children, whileHover, whileTap, ...props }: any) => (
			<div {...props}>{children}</div>
		),
		h1: ({ children, whileHover, whileTap, ...props }: any) => (
			<h1 {...props}>{children}</h1>
		),
		p: ({ children, whileHover, whileTap, ...props }: any) => (
			<p {...props}>{children}</p>
		),
	},
}))

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/about',
	}),
}))

// Mock translations based on common.json
const mockTranslations: { [key: string]: any } = {
	'about.companyName': 'Next Template Solutions',
	'about.description':
		'We specialize in creating high-quality web application templates using Next.js',
	'about.mission':
		'Our mission is to help developers build better websites faster',
	'about.established': '2025',
	'about.services': [
		{ title: 'Web Development' },
		{ title: 'Template Design' },
		{ title: 'Technical Consulting' },
	],
}

// Mock useNamespace hook
jest.mock('@/src/hooks/useNamespace', () => ({
	__esModule: true,
	default: () => ({
		t: (key: string) => mockTranslations[key] || key,
		lang: 'en',
	}),
}))

describe('About Page', () => {
	beforeEach(async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<AboutPage />
				</I18nProvider>,
			)
		})
	})

	it('renders company name from translations', () => {
		expect(
			screen.getByText(mockTranslations['about.companyName']),
		).toBeInTheDocument()
	})

	it('renders company description and mission from translations', () => {
		expect(
			screen.getByText(mockTranslations['about.description']),
		).toBeInTheDocument()
		expect(
			screen.getByText(mockTranslations['about.mission']),
		).toBeInTheDocument()
	})

	it('displays establishment year from translations', () => {
		expect(
			screen.getByText(`🎉 Since ${mockTranslations['about.established']}`),
		).toBeInTheDocument()
	})

	it('renders all service cards from translations', () => {
		// Define interface for service structure
		interface Service {
			title: string
		}

		;(mockTranslations['about.services'] as Service[]).forEach(
			(service: Service) => {
				expect(screen.getByText(service.title)).toBeInTheDocument()
			},
		)
	})

	it('applies correct styling to main container', () => {
		const mainContainer = screen.getByRole('main')
		expect(mainContainer).toHaveClass(
			'container',
			'mx-auto',
			'px-4',
			'py-12',
			'overflow-hidden',
		)
	})

	it('renders the correct number of service cards', () => {
		const serviceCards = screen.getAllByRole('heading', { level: 3 })
		expect(serviceCards).toHaveLength(mockTranslations['about.services'].length)
	})
})
