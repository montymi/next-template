'use client'
export function OpenConfigurator({ children }: { children: React.ReactNode }) {
	return (
		<button
			className='button button--primary'
			type='button'
			onClick={() => window.dispatchEvent(new Event('coast:customize'))}
		>
			{children}
		</button>
	)
}
