import { I18nProvider, useI18n } from 'next-localization'
import useNamespace from '../hooks/useNamespace'

export default function Namespace() {
	const { translations, lang } = useNamespace('namespace')

	return (
		<I18nProvider lngDict={translations} locale={lang}>
			<Title />
		</I18nProvider>
	)
}

export function Title() {
	const i18n = useI18n()
	return <h1>{i18n.t('title') || 'Default Title'}</h1>
}
