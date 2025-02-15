/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'class', // or 'media'
	theme: {
		extend: {
			colors: {
				primary: {
					text: 'var(--color-primary-text-light)',
					'text-dark': 'var(--color-primary-text-dark)',
					bg: 'var(--color-primary-bg-light)',
					'bg-dark': 'var(--color-primary-bg-dark)',
				},
				secondary: {
					text: 'var(--color-secondary-text-light)',
					'text-dark': 'var(--color-secondary-text-dark)',
					bg: 'var(--color-secondary-bg-light)',
					'bg-dark': 'var(--color-secondary-bg-dark)',
				},
				action: {
					text: 'var(--color-action-text-light)',
					'text-dark': 'var(--color-action-text-dark)',
					bg: 'var(--color-action-bg-light)',
					'bg-dark': 'var(--color-action-bg-dark)',
					hover: 'var(--color-action-hover-light)',
					'hover-dark': 'var(--color-action-hover-dark)',
				},
				warning: {
					text: 'var(--color-warning-text-light)',
					'text-dark': 'var(--color-warning-text-dark)',
					bg: 'var(--color-warning-bg-light)',
					'bg-dark': 'var(--color-warning-bg-dark)',
				},
			},
		},
	},
	variants: {},
	plugins: [],
}
