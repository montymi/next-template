'use client'
import { validateSnapshot, type Snapshot } from './snapshot'
async function database() {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open('coast-saved-configuration', 1)
		request.onupgradeneeded = () =>
			request.result.createObjectStore('snapshots')
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}
export async function readSaved(): Promise<Snapshot | null> {
	const db = await database()
	try {
		return await new Promise((resolve, reject) => {
			const request = db
				.transaction('snapshots')
				.objectStore('snapshots')
				.get('active')
			request.onsuccess = () => {
				try {
					resolve(request.result ? validateSnapshot(request.result) : null)
				} catch {
					resolve(null)
				}
			}
			request.onerror = () => reject(request.error)
		})
	} finally {
		db.close()
	}
}
export async function writeSaved(input: Snapshot) {
	const snapshot = validateSnapshot(input)
	const db = await database()
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction('snapshots', 'readwrite')
			tx.objectStore('snapshots').put(snapshot, 'active')
			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
			tx.onabort = () => reject(tx.error)
		})
	} finally {
		db.close()
	}
}
