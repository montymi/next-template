import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buttonClass } from '@/components/ui/button'
export default async function NotFound() {
	const t = await getTranslations('NotFound')
	return (
		<section className='container not-found'>
			<p className='eyebrow'>404 / COAST</p>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<Link className={buttonClass()} href='/'>
				{t('action')}
			</Link>
		</section>
	)
}
