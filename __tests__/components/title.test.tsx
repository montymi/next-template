import { render, screen } from '@testing-library/react'
import Title from '@/components/title'

describe('Title component', () => {
	it('renders children correctly', () => {
		render(<Title>Test Title</Title>)
		expect(screen.getByText('Test Title')).toBeInTheDocument()
	})

	it('includes default classes', () => {
		render(<Title>Test Title</Title>)
		const heading = screen.getByText('Test Title')
		expect(heading).toHaveClass('text-3xl')
		expect(heading).toHaveClass('font-bold')
	})

	it('accepts additional className prop', () => {
		render(<Title className='custom-class'>Test Title</Title>)
		const heading = screen.getByText('Test Title')
		expect(heading).toHaveClass('custom-class')
		expect(heading).toHaveClass('text-3xl')
		expect(heading).toHaveClass('font-bold')
	})

	it('renders as h1 element', () => {
		render(<Title>Test Title</Title>)
		const heading = screen.getByText('Test Title')
		expect(heading.tagName).toBe('H1')
	})
})
