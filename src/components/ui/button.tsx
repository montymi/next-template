import type { ComponentProps } from 'react'
export type ButtonVariant = 'primary' | 'secondary' | 'quiet'
export function buttonClass(variant: ButtonVariant = 'primary') {
	return `button button--${variant}`
}
export function Button({
	variant = 'primary',
	className = '',
	type = 'button',
	...props
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
	return (
		<button
			type={type}
			className={`${buttonClass(variant)} ${className}`}
			{...props}
		/>
	)
}
