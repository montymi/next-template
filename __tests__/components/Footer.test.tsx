import { render, screen, act } from '@testing-library/react'
import Footer from '@/components/Footer'
import { I18nProvider } from 'next-localization'

// Mock translations
const mockTranslations = {
	'footer.copyright': '© 2024 Next Template. All rights reserved.',
	'footer.links': {
		privacy: 'Privacy Policy',
		terms: 'Terms of Service',
		contact: 'Contact Us',
	},
}

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/',
	}),
}))

// Mock next-themes
jest.mock('next-themes', () => ({
	useTheme: () => ({
		theme: 'light',
		setTheme: jest.fn(),
	}),
}))

describe('Footer', () => {
	const setupTest = async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Footer />
				</I18nProvider>,
			)
		})
	}

	it('renders copyright notice', async () => {
		await setupTest()
		expect(
			screen.getByText('© 2025 Your Company. All rights reserved.'),
		).toBeInTheDocument()
	})
	it('renders the theme toggle button', async () => {
		await setupTest()
		const themeButton = screen.getByRole('button')
		expect(themeButton).toBeInTheDocument()
	})
	it('toggles theme when button is clicked', async () => {
		const setTheme = jest.fn()
		const useTheme = jest.spyOn(require('next-themes'), 'useTheme')
		useTheme.mockImplementation(() => ({
			theme: 'light',
			setTheme,
		}))

		await setupTest()

		const themeButton = screen.getByRole('button')
		themeButton.click()

		expect(setTheme).toHaveBeenCalledWith('dark')
	})

	it('shows current year in copyright notice', async () => {
		const mockDate = new Date(2024, 0, 1)
		jest.spyOn(global, 'Date').mockImplementation(() => mockDate)

		await setupTest()

		expect(screen.getByText(/© 2024/)).toBeInTheDocument()

		jest.restoreAllMocks()
	})
	it('shows correct theme icon based on current theme', async () => {
		// Test light theme
		const useTheme = jest.spyOn(require('next-themes'), 'useTheme')
		useTheme.mockImplementation(() => ({
			theme: 'light',
			setTheme: jest.fn(),
		}))

		await setupTest()
		expect(screen.getByTestId('sun-icon')).toBeInTheDocument()

		// Test dark theme
		useTheme.mockImplementation(() => ({
			theme: 'dark',
			setTheme: jest.fn(),
		}))

		await setupTest()
		expect(screen.getByTestId('moon-icon')).toBeInTheDocument()

		useTheme.mockRestore()
	})
})
