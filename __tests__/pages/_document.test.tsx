import { render } from '@testing-library/react'
import Document from '@/pages/_document'

jest.mock('next/document', () => ({
	Html: ({ children, ...props }: any) => <html {...props}>{children}</html>,
	Head: ({ children }: any) => <head>{children}</head>,
	Main: () => <main>Main</main>,
	NextScript: () => <script>NextScript</script>,
}))

describe('Document', () => {
	it('renders document with correct structure', () => {
		render(<Document />)

		// Check meta tags
		const metaTags = document.getElementsByTagName('meta')
		expect(metaTags[0]).toHaveAttribute('name', 'theme-color')
		expect(metaTags[0]).toHaveAttribute('content', '#18181b')
		expect(metaTags[0]).toHaveAttribute('media', '(prefers-color-scheme: dark)')
		expect(metaTags[1]).toHaveAttribute('charSet', 'utf-8')

		// Check link tags
		const linkTags = document.getElementsByTagName('link')
		expect(linkTags[0]).toHaveAttribute('rel', 'icon')
		expect(linkTags[0]).toHaveAttribute('type', 'image/png')
		expect(linkTags[0]).toHaveAttribute('href', '/images/favicon.png')
		expect(linkTags[1]).toHaveAttribute('rel', 'apple-touch-icon')
		expect(linkTags[1]).toHaveAttribute('href', '/images/icon-maskable-512.png')
		expect(linkTags[2]).toHaveAttribute('rel', 'manifest')
		expect(linkTags[2]).toHaveAttribute('href', '/manifest.json')

		// Check if Main and NextScript are present
		expect(document.querySelector('main')).toBeInTheDocument()
		expect(document.querySelector('script')).toBeInTheDocument()
	})
})
