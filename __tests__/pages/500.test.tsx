/**
 * @jest-environment jsdom
 * @page 500 Error Page Tests
 */

import { render, screen } from '@testing-library/react'
import ServerErrorPage from '@/pages/500'
import { I18nProvider } from 'next-localization'

describe('500 Error Page', () => {
	const mockTranslations = {
		error: {
			'500': {
				title: '500 - Server-side error occurred',
				description: 'Sorry, something went wrong on our end.',
			},
		},
	}

	beforeEach(() => {
		render(
			<I18nProvider lngDict={mockTranslations} locale='en'>
				<ServerErrorPage />
			</I18nProvider>,
		)
	})

	it('renders error message and description', () => {
		expect(
			screen.getByText(mockTranslations.error['500'].title),
		).toBeInTheDocument()
		expect(
			screen.getByText(mockTranslations.error['500'].description),
		).toBeInTheDocument()
	})

	it('applies correct styling to container', () => {
		const container = screen.getByRole('heading').parentElement
		expect(container).toHaveStyle({
			display: 'flex',
			height: '100vh',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			textAlign: 'center',
		})
	})

	it('renders heading with correct level', () => {
		const heading = screen.getByRole('heading', { level: 1 })
		expect(heading).toBeInTheDocument()
	})
})
