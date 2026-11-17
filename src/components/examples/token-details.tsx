'use client'
import { useDesignTokens } from '@/design-system/preview'
export function SpacingDemo() {
	const tokens = useDesignTokens()
	return (
		<div className='spacing-demo'>
			{Object.entries(tokens.spacing).map(([key, value]) => (
				<div key={key}>
					<span style={{ height: `var(--space-${key})` }} />
					<code>{value}px</code>
				</div>
			))}
		</div>
	)
}
export function TypeLabels() {
	const tokens = useDesignTokens()
	return (
		<div className='type-labels'>
			<span>{tokens.fonts.display.split(',')[0].toUpperCase()} / 400</span>
			<span>{tokens.fonts.body.split(',')[0].toUpperCase()} / 400–600</span>
		</div>
	)
}
