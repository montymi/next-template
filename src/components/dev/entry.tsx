'use client'
import dynamic from 'next/dynamic'
const Configurator = dynamic(() => import('./configurator'), { ssr: false })
export function DevTools() {
	return process.env.NODE_ENV === 'development' ? <Configurator /> : null
}
