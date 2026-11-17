import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Palette } from '@/components/examples/palette'
import { Playground } from '@/components/examples/playground'
import { SpacingDemo, TypeLabels } from '@/components/examples/token-details'
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Metadata' })
	return { title: t('system') }
}
export default async function DesignSystem({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('System')
	return (
		<div className='container page-content'>
			<header className='page-intro'>
				<p className='eyebrow'>{t('eyebrow')}</p>
				<h1>{t('title')}</h1>
				<p>{t('description')}</p>
			</header>
			<section className='system-section'>
				<div className='section-intro'>
					<h2>{t('paletteTitle')}</h2>
					<p>{t('paletteText')}</p>
				</div>
				<Palette />
			</section>
			<section className='system-section type-section'>
				<div className='section-intro'>
					<h2>{t('typeTitle')}</h2>
					<p>{t('typeText')}</p>
				</div>
				<p className='type-specimen'>{t('typeSample')}</p>
				<TypeLabels />
			</section>
			<section className='system-section'>
				<div className='section-intro'>
					<h2>{t('componentsTitle')}</h2>
					<p>{t('componentsText')}</p>
				</div>
				<Playground />
			</section>
			<section className='system-section'>
				<div className='section-intro'>
					<h2>{t('spacingTitle')}</h2>
					<p>{t('spacingText')}</p>
				</div>
				<SpacingDemo />
			</section>
		</div>
	)
}
