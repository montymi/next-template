'use client'
import { useDesignTokens } from '@/design-system/preview'
export function TokenName() {
	return <>{useDesignTokens().name.toUpperCase()}</>
}
