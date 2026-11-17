/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker'
import {
	NetworkOnly,
	Serwist,
	type PrecacheEntry,
	type SerwistGlobalConfig,
} from 'serwist'

declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined
	}
}
declare const self: ServiceWorkerGlobalScope

const worker = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: [
		// APIs and authentication are never cached. Extend this for private routes you add.
		{
			matcher: ({ url }) =>
				url.origin === self.location.origin &&
				(url.pathname.startsWith('/api/') ||
					/\/(?:login|account)(?:\/|$)/.test(url.pathname)),
			handler: new NetworkOnly(),
		},
		...defaultCache,
	],
})
worker.addEventListeners()
