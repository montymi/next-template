import { renderHook, waitFor, act } from '@testing-library/react'
import useNamespace from '@/hooks/useNamespace'
import { useRouter } from 'next/router'

// Mock next/router
jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

// Mock dynamic import
jest.mock(
	'@/public/locales/en/common.json',
	() => ({
		welcome: 'Welcome! 👋',
		nested: {
			key: 'Nested Value',
		},
	}),
	{ virtual: true },
)

describe('useNamespace', () => {
	beforeEach(() => {
		// Setup router mock for each test
		;(useRouter as jest.Mock).mockImplementation(() => ({
			locale: 'en',
			pathname: '/',
		}))
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return translation function and language', async () => {
		const { result } = renderHook(() => useNamespace('common'))

		await waitFor(() => {
			expect(result.current.lang).toBe('en')
			expect(result.current.t('welcome')).toBe('Welcome! 👋')
		})
	})

	it('should handle nested translations', async () => {
		const { result } = renderHook(() => useNamespace('common'))

		await waitFor(() => {
			expect(result.current.t('nested.key')).toBe('Nested Value')
		})
	})

	it('should return key if translation not found', async () => {
		const { result } = renderHook(() => useNamespace('common'))

		await waitFor(() => {
			expect(result.current.t('nonexistent.key')).toBe('nonexistent.key')
		})
	})

	it('should handle locale change', async () => {
		const { result, rerender } = renderHook(() => useNamespace('common'))

		await act(async () => {
			// Change locale
			;(useRouter as jest.Mock).mockImplementation(() => ({
				locale: 'de',
				pathname: '/',
			}))

			rerender()
		})

		expect(result.current.lang).toBe('de')
	})

	it('should handle non-string translations', async () => {
		const { result } = renderHook(() => useNamespace('common'))

		await waitFor(() => {
			expect(result.current.t('nested')).toBe(
				JSON.stringify({ key: 'Nested Value' }),
			)
		})
	})
})
