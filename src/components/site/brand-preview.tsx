'use client'
/* Uploaded artwork is rasterized in the browser before it can be displayed. */
/* eslint-disable @next/next/no-img-element */
import { useSyncExternalStore } from 'react'
import source from '@/config/brand.json'
import site from '@/config/site.json'
import { Mark } from './mark'
export type BrandPreview = { logo: string; avatar: string; name: string }
const initial: BrandPreview = { ...source, name: site.name }
let current = initial
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}
export function publishBrand(value: BrandPreview) {
	current = value
	listeners.forEach((listener) => listener())
}
export function useBrand() {
	return useSyncExternalStore(
		subscribe,
		() => current,
		() => initial,
	)
}
export function BrandMark() {
	const brand = useBrand()
	return brand.logo ? (
		<img className='brand-upload' src={brand.logo} alt='' />
	) : (
		<Mark />
	)
}
export function BrandName() {
	return <span>{useBrand().name}</span>
}
export function BrandAvatar() {
	const brand = useBrand()
	return brand.avatar ? (
		<img
			className='brand-avatar'
			src={brand.avatar}
			alt={`${brand.name} profile`}
		/>
	) : null
}
