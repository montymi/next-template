import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const useNamespace = (ns: string) => {
	const router = useRouter()
	const lang = router.locale || 'en'
	type JSONTranslation = {
		[key: string]: string | number | boolean | null | JSONTranslation
	}
	const [translations, setTranslations] = useState<JSONTranslation>({})
	useEffect(() => {
		const loadTranslations = async () => {
			const nsModule = await import(
				`../../../public/locales/${lang}/${ns}.json`
			)
			setTranslations(nsModule.default || {})
		}
		loadTranslations()
	}, [lang, ns])

	return { translations, lang }
}

export default useNamespace
