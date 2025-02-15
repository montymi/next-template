import { motion } from 'framer-motion'
import useNamespace from '@/hooks/useNamespace'

export default function Services() {
	const { t } = useNamespace('common')

	return (
		<section className='bg-gray-50 py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-3xl font-bold text-center mb-8'>
					{t('services.title')}
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<motion.div
						whileHover={{ scale: 1.05 }}
						className='bg-white p-6 shadow rounded'
					>
						<p className='text-gray-600'>{t('services.description')}</p>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className='bg-white p-6 shadow rounded'
					>
						<p className='text-gray-600'>{t('services.clients')}</p>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className='bg-white p-6 shadow rounded'
					>
						<p className='text-gray-600'>{t('services.contact')}</p>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
