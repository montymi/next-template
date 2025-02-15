import { motion } from 'framer-motion'
import Title from '@/components/title'
import useNamespace from '@/hooks/useNamespace'

export default function Profile() {
	const { t } = useNamespace('common')

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col items-center justify-center flex-grow p-4 m-10 text-primary-text dark:text-primary-text-dark max-w-2xl mx-auto'
		>
			<Title username='montymi' />
			<h2 className='text-2xl font-bold mb-4'>{t('profile.name')}</h2>
			<h3 className='text-xl font-semibold mb-4'>
				{t('profile.contact.email')}
			</h3>
			<p className='text-lg mb-4 max-w-xl text-center'>
				{t('profile.biography')}
			</p>
		</motion.div>
	)
}
