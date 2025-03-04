import { render } from '@testing-library/react'

jest.mock('next/document', () => ({
	__esModule: true,
	Html: () => null,
	Head: () => null,
	Main: () => null,
	NextScript: () => null,
	default: class extends require('react').Component {
		static async getInitialProps() {
			return { head: [], html: '', styles: [] }
		}
		render() {
			return <div>Mocked Document</div>
		}
	},
}))

import Document from '@/pages/_document'

describe('Document', () => {
	it('renders without crashing', () => {
		expect(() => {
			render(<Document />)
		}).not.toThrow()
	})
})
