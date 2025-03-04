import React from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

const Footer: React.FC = () => {
	const { theme, setTheme } = useTheme()

	return (
		<footer className='p-4 text-center bg-secondary-bg dark:bg-primary-bg-dark fixed bottom-0 w-full'>
			<div className='flex flex-row justify-between items-center'>
				<p>
					&copy; {new Date().getFullYear()} Your Company. All rights reserved.
				</p>
				<button
					onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
					className='p-2 bg-action-bg dark:bg-action-bg-dark rounded hover:bg-action-hover dark:hover:bg-action-hover-dark hover:cursor-pointer'
				>
					{theme === 'light' ? (
						<SunIcon className='h-5 w-5' data-testid='sun-icon' />
					) : (
						<MoonIcon className='h-5 w-5' data-testid='moon-icon' />
					)}
				</button>
			</div>
		</footer>
	)
}

export default Footer
