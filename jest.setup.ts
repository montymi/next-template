import '@testing-library/jest-dom'

// Mock next/dynamic
jest.mock('next/dynamic', () => () => {
	const DynamicComponent = () => null
	DynamicComponent.displayName = 'LoadableComponent'
	DynamicComponent.preload = jest.fn()
	return DynamicComponent
})

jest.mock('next/router', () => ({
	useRouter: () => ({
		locale: 'en',
		pathname: '/',
		push: jest.fn(),
		replace: jest.fn(),
	}),
}))

// Setup global fetch mock
global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
	}),
) as jest.Mock
