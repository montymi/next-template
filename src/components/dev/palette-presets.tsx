'use client'
import presets from '@/design-system/presets.json'
import type { DesignTokens } from '@/design-system/types'
import { validateTokens } from '@/design-system/format.mjs'
export function PalettePresets({
	tokens,
	onChange,
}: {
	tokens: DesignTokens
	onChange: (tokens: DesignTokens) => void
}) {
	return (
		<fieldset className='palette-presets'>
			<legend>Start with a palette</legend>
			<div className='preset-grid'>
				{presets.map((preset) => (
					<button
						type='button'
						key={preset.name}
						aria-label={`Apply ${preset.name} palette`}
						aria-pressed={
							JSON.stringify(tokens.light) === JSON.stringify(preset.light) &&
							JSON.stringify(tokens.dark) === JSON.stringify(preset.dark)
						}
						onClick={() => onChange(validateTokens({ ...tokens, ...preset }))}
					>
						<span className='preset-swatches' aria-hidden='true'>
							{(['background', 'primary', 'accent'] as const).map((key) => (
								<span key={key} style={{ background: preset.light[key] }} />
							))}
						</span>
						<span>{preset.name}</span>
					</button>
				))}
			</div>
			<p className='form-hint'>
				Updates both color themes. Your name, artwork, fonts, and layout stay as
				you set them.
			</p>
		</fieldset>
	)
}
