import { render, screen, act } from '@testing-library/react'
import MyApp from '@/pages/_app'
import { useRouter } from 'next/router'

// Mock dependencies
jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

jest.mock('@/src/components/Header', () => {
	return function MockHeader() {
		return <div data-testid='mock-header'>Header</div>
	}
})

jest.mock('@/src/components/Footer', () => {
	return function MockFooter() {
		return <div data-testid='mock-footer'>Footer</div>
	}
})

describe('MyApp', () => {
	const mockRouter = {
		locale: 'en',
	}

	const mockPageProps = {
		lngDict: {},
		testProp: 'test',
		router: mockRouter,
	}

	const MockComponent = jest.fn(() => <div>Test Component</div>)

	beforeEach(() => {
		;(useRouter as jest.Mock).mockReturnValue(mockRouter)

		// Mock matchMedia with both modern and legacy methods
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // Legacy
				removeListener: jest.fn(), // Legacy
				addEventListener: jest.fn(), // Modern
				removeEventListener: jest.fn(), // Modern
				dispatchEvent: jest.fn(),
			})),
		})
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('renders without crashing', () => {
		render(
			<MyApp
				Component={MockComponent}
				pageProps={mockPageProps}
				router={mockRouter as any}
			/>,
		)

		expect(screen.getByTestId('mock-header')).toBeInTheDocument()
		expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
	})

	it('handles dark mode changes', () => {
		const darkMediaQuery = {
			matches: true,
			media: '(prefers-color-scheme: dark)',
			onchange: null,
			addListener: jest.fn(),
			removeListener: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		}

		window.matchMedia = jest.fn().mockImplementation(() => darkMediaQuery)
		render(
			<MyApp
				Component={MockComponent}
				pageProps={mockPageProps}
				router={mockRouter as any}
			/>,
		)

		act(() => {
			// Simulate both modern and legacy event handling
			const callback =
				darkMediaQuery.addEventListener.mock.calls[0]?.[1] ||
				darkMediaQuery.addListener.mock.calls[0]?.[0]
			callback({ matches: true })
		})

		expect(document.documentElement.classList.contains('dark')).toBeTruthy()
	})
})
