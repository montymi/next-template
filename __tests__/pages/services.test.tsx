import { render, screen } from '@testing-library/react'
import Services from '@/pages/services'
import { I18nProvider } from 'next-localization'

// Mock translations
const mockTranslations = {
	'services.title': 'Our Services',
	'services.description': 'Service Description',
	'services.clients': 'Our Clients',
	'services.contact': 'Contact Us',
} as const;

// Mock the useNamespace hook
jest.mock('@/src/hooks/useNamespace', () => ({
	__esModule: true,
	default: () => ({
		t: (key: keyof typeof mockTranslations) => mockTranslations[key] || key,
		lang: 'en',
	}),
}))

describe('Services', () => {
	const renderWithProvider = (ui: React.ReactElement) => {
		return render(
			<I18nProvider lngDict={mockTranslations} locale='en'>
				{ui}
			</I18nProvider>,
		)
	}

	it('renders services section with title', () => {
		renderWithProvider(<Services />)
		expect(screen.getByText('Our Services')).toBeInTheDocument()
	})

	it('renders all service cards', () => {
		renderWithProvider(<Services />)
		expect(screen.getByText('Service Description')).toBeInTheDocument()
		expect(screen.getByText('Our Clients')).toBeInTheDocument()
		expect(screen.getByText('Contact Us')).toBeInTheDocument()
	})

	it('renders correct number of service cards', () => {
		renderWithProvider(<Services />)
		const cards = screen.getAllByTestId('service-card')
		expect(cards).toHaveLength(3)
	})
})
