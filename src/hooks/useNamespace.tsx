import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
type JSONTranslation = {
	[key: string]: string | number | boolean | JSONTranslation
}

export interface NamespaceProps {
	t: (key: string) => ReactNode
	lang: string
}

const useNamespace = (ns: string): NamespaceProps => {
	const router = useRouter()
	const lang = router.locale || 'en'
	const [t, setTranslations] = useState<JSONTranslation>({})
	useEffect(() => {
		const loadTranslations = async () => {
			const nsModule = await import(`../../public/locales/${lang}/${ns}.json`)
			setTranslations(nsModule.default || {})
		}
		loadTranslations()
	}, [lang, ns])

	const translate = (key: string): ReactNode => {
		const keys = key.split('.')
		let translation: JSONTranslation = t
		for (const k of keys) {
			if (translation[k] !== undefined) {
				if (typeof translation[k] === 'object' && translation[k] !== null) {
					translation = translation[k] as JSONTranslation
				} else {
					return translation[k]
				}
			} else {
				return key
			}
		}
		return typeof translation === 'string'
			? translation
			: JSON.stringify(translation)
	}

	return { t: translate, lang }
}

export default useNamespace
