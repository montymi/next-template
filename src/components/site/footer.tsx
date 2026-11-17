import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import site from '@/config/site.json'
export async function SiteFooter() {
	const t = await getTranslations('Footer')
	return (
		<footer className='site-footer container'>
			<Link className='footer-brand' href='/'>
				{site.name}
			</Link>
			<p>{t('credit')}</p>
			<small>
				{t('copyright', { year: new Date().getFullYear(), name: site.name })}
			</small>
		</footer>
	)
}
