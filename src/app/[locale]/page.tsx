import { GitHubIcon, ForkIcon } from '@/components/ui/github-icons'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buttonClass } from '@/components/ui/button'
import { Arrow } from '@/components/ui/arrow'
import site from '@/config/site.json'
import { ArchitectureStudy } from '@/components/site/study'

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('Home')
	return (
		<>
			<section className='hero container'>
				<div className='hero-copy'>
					<p className='eyebrow'>
						<span className='accent-dot' />
						{t('eyebrow')}
					</p>
					<h1>
						{t('title')}
						<br />
						<em>{t('accent')}</em>
					</h1>
					<p className='hero-description'>{t('description')}</p>
					<div className='hero-actions'>
						<a
							className={buttonClass()}
							href={`${site.repository}/fork`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<GitHubIcon />
							{t('fork')}
							<ForkIcon />
						</a>
						<Link className='text-link' href='/design-system'>
							{t('primary')}
							<Arrow />
						</Link>
					</div>
					<p className='fork-note'>{t('forkNote')}</p>
					<p className='hero-edition'>
						COAST <span /> FRAMEWORK / 001
					</p>
				</div>
				<ArchitectureStudy label={t('artLabel')} caption={t('artCaption')} />
			</section>
			<section className='foundation container'>
				<div className='section-top'>
					<p className='eyebrow'>{t('featuresLabel')}</p>
					<span aria-hidden='true'>＋</span>
				</div>
				<h2>{t('featuresTitle')}</h2>
				<div className='feature-grid'>
					{(['One', 'Two', 'Three'] as const).map((number, index) => (
						<article key={number}>
							<span className='feature-number'>0{index + 1}</span>
							<h3>{t(`feature${number}Title`)}</h3>
							<p>{t(`feature${number}Text`)}</p>
						</article>
					))}
				</div>
			</section>
			<section className='closing-band'>
				<div className='container closing-content'>
					<div>
						<p className='eyebrow'>{t('ctaLabel')}</p>
						<h2>{t('ctaTitle')}</h2>
						<p>{t('ctaText')}</p>
					</div>
					<Link className='button button--inverse' href='/getting-started'>
						{t('ctaAction')}
						<Arrow />
					</Link>
				</div>
			</section>
		</>
	)
}
