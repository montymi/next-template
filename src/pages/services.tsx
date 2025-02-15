import { motion } from 'framer-motion'
import useNamespace from '@/hooks/useNamespace'

export default function Services() {
	const { t } = useNamespace('common')

	return (
		<section className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-3xl font-bold text-center mb-8'>
					{t('services.title')}
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{['description', 'clients', 'contact'].map((key) => (
						<motion.div
							key={key}
							whileHover={{ scale: 1.05 }}
							className='bg-primary-bg dark:bg-primary-bg-dark p-6 shadow rounded'
						>
							<p className='text-primary dark:text-primary-dark'>
								{t(`services.${key}`)}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
