import { render, screen, act } from '@testing-library/react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Header, { Notice, Utils } from '@/components/Header'
import { I18nProvider } from 'next-localization'
import { useRouter } from 'next/router'

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

// Mock translations
const mockTranslations = {
	'header.navigation.home': 'Home',
	'header.navigation.about': 'About',
	'header.navigation.services': 'Services',
	'header.title': 'Test Notice',
}

describe('Header', () => {
	const mockRouter = {
		locale: 'en',
		pathname: '/',
		push: jest.fn(),
		replace: jest.fn(),
		asPath: '/',
	}

	beforeEach(() => {
		;(useRouter as jest.Mock).mockImplementation(() => mockRouter)
	})

	it('renders navigation items', async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Header />
				</I18nProvider>,
			)
		})

		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('About')).toBeInTheDocument()
		expect(screen.getByText('Services')).toBeInTheDocument()
	})

	it('handles language change', async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Header />
				</I18nProvider>,
			)
		})

		const languageButton = screen.getByRole('button', { name: /🇺🇸/ })
		fireEvent.click(languageButton)

		// Verify language options appear
		const spanishOption = screen.getByRole('button', { name: /🇪🇸/ })
		expect(spanishOption).toBeInTheDocument()

		// Click Spanish option
		fireEvent.click(spanishOption)
		expect(mockRouter.replace).toHaveBeenCalledWith('/', '/', { locale: 'es' })
	})

	it('renders and handles notice dismissal', async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Notice t={(key) => mockTranslations[`header.${key}`]} />
				</I18nProvider>,
			)
		})

		const notice = screen.getByText('Test Notice')
		expect(notice).toBeInTheDocument()

		// Click notice to dismiss
		fireEvent.click(notice.parentElement!)
		expect(notice.parentElement).toHaveStyle({ display: 'none' })
	})

	it('closes language dropdown when clicking outside', async () => {
		await act(async () => {
			render(
				<I18nProvider lngDict={mockTranslations} locale='en'>
					<Utils lang='en' onLanguageChange={() => {}} />
				</I18nProvider>,
			)
		})

		// Open dropdown
		const languageButton = screen.getByRole('button', { name: /🇺🇸/ })
		fireEvent.click(languageButton)

		// Verify dropdown is open
		expect(screen.getByRole('button', { name: /🇪🇸/ })).toBeInTheDocument()

		// Click outside
		fireEvent.mouseDown(document.body)

		// Verify dropdown is closed
		expect(screen.queryByRole('button', { name: /🇪🇸/ })).not.toBeInTheDocument()
	})
})
