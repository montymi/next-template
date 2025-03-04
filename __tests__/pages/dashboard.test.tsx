/**
 * @jest-environment jsdom
 * @page Dashboard Page Tests
 */

import { render, screen } from '@testing-library/react'
import { act } from 'react'
import Dashboard from '@/pages/dashboard'
import { I18nProvider } from 'next-localization'

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/dashboard',
		push: jest.fn(),
	}),
}))

describe('Dashboard Page', () => {
	const mockTranslations = {
		'intro.text': 'Welcome to the Dashboard',
		'dashboard.description': 'This is your personal dashboard space',
	}

	beforeEach(async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Dashboard />
				</I18nProvider>,
			)
		})
	})

	it('displays current locale', () => {
		expect(screen.getByText('Current locale: en')).toBeInTheDocument()
	})

	it('renders language change links', () => {
		expect(screen.getByText('Change language to (en)')).toBeInTheDocument()
		expect(screen.getByText('Change language to (de)')).toBeInTheDocument()
	})
})
