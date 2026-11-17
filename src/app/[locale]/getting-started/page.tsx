import { getTranslations, setRequestLocale } from 'next-intl/server'
import site from '@/config/site.json'
import { Arrow } from '@/components/ui/arrow'
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })
	return { title: t('guide') }
}
export default async function GettingStarted({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('Guide')
	const steps = [
		['one', 'npm ci\nnpm run dev'],
		['two', 'src/config/site.json'],
		['three', 'src/design-system/tokens.json\nnpm run brand'],
		['four', 'npm run lint\nnpm run typecheck\nnpm test'],
	] as const
	return (
		<div className='container page-content guide-content'>
			<header className='page-intro'>
				<p className='eyebrow'>{t('eyebrow')}</p>
				<h1>{t('title')}</h1>
				<p>{t('description')}</p>
			</header>
			<div className='guide-steps'>
				{steps.map(([key, code], index) => (
					<section className='guide-step' key={key}>
						<span className='feature-number'>0{index + 1}</span>
						<div>
							<h2>{t(`${key}Title`)}</h2>
							<p>{t(`${key}Text`)}</p>
							<pre>
								<code>{code}</code>
							</pre>
						</div>
					</section>
				))}
			</div>
			<p className='guide-note'>{t('note')}</p>
			<a className='text-link' href={site.repository}>
				{t('source')}
				<Arrow />
			</a>
		</div>
	)
}
