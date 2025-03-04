/**
 * @jest-environment jsdom
 * @page 404 Not Found Page Tests
 */

import { render, screen } from '@testing-library/react'
import NotFoundPage from '@/pages/404'
import { I18nProvider } from 'next-localization'

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/404',
	}),
}))

describe('404 Not Found Page', () => {
	const mockTranslations = {
		error: {
			'404': {
				title: 'Not found',
				locale: 'Current locale: en',
			},
		},
	}

	beforeEach(() => {
		render(
			<I18nProvider lngDict={mockTranslations} locale='en'>
				<NotFoundPage />
			</I18nProvider>,
		)
	})

	it('renders not found message', () => {
		expect(
			screen.getByText(mockTranslations.error['404'].title),
		).toBeInTheDocument()
	})

	it('displays current locale', () => {
		expect(screen.getByText('Current locale: en')).toBeInTheDocument()
	})

	it('contains heading with correct level', () => {
		const heading = screen.getByRole('heading', { level: 1 })
		expect(heading).toBeInTheDocument()
		expect(heading).toHaveTextContent(mockTranslations.error['404'].title)
	})
})
