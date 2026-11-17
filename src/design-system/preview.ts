'use client'
import { useSyncExternalStore } from 'react'
import source from './tokens.json'
import type { DesignTokens } from './types'
let preview: DesignTokens = source
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}
export function publishPreview(tokens: DesignTokens) {
	preview = tokens
	listeners.forEach((listener) => listener())
}
export function useDesignTokens() {
	return useSyncExternalStore(
		subscribe,
		() => preview,
		() => source,
	)
}
