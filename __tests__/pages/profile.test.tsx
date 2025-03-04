/**
 * @jest-environment jsdom
 * @page Profile Page Tests
 */

import { render, screen } from '@testing-library/react'
import { act } from 'react'
import Profile from '@/pages/profile'
import { I18nProvider } from 'next-localization'

// Mock translations
const mockTranslations = {
	'profile.name': 'Michael Montanaro',
}

// Mock framer-motion
jest.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}))

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/profile',
	}),
}))

// Mock Title component
jest.mock('@/src/components/title', () => {
	return {
		__esModule: true,
		default: () => <div data-testid='mock-title'>Mock Title</div>,
	}
})

describe('Profile Page', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks()
	})

	it('displays profile information from translations', async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Profile />
				</I18nProvider>,
			)
		})

		// Test that each translation is rendered
		expect(
			screen.getByText(mockTranslations['profile.name']),
		).toBeInTheDocument()
	})
})
