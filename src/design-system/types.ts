import tokens from './tokens.json'
export type DesignTokens = typeof tokens
export type ColorMode = 'light' | 'dark'
export type ColorKey = keyof DesignTokens['light']
