import useNamespace from '@/hooks/useNamespace'
import { motion } from 'framer-motion'

interface Service {
	title: string
}

const ServiceCard = ({ title }: Service) => (
	<motion.div
		whileHover={{ scale: 1.1, rotate: 5 }}
		whileTap={{ scale: 0.95 }}
		className='flex flex-col items-center p-6 border rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 shadow-lg hover:shadow-xl transition-all cursor-pointer'
	>
		<h3 className='text-xl font-bold text-primary-text dark:text-primary-text-dark'>
			{title}
		</h3>
	</motion.div>
)

export default function AboutPage() {
	const { t } = useNamespace('common')

	const services: Service[] = (
		Array.isArray(t('about.services')) ? t('about.services') : []
	) as Service[]

	return (
		<main className='container mx-auto px-4 py-12 overflow-hidden'>
			<div className='max-w-4xl mx-auto'>
				<motion.h1
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: 'spring', bounce: 0.5 }}
					className='text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-text to-purple-600 dark:from-primary-text-dark dark:to-purple-400'
				>
					{t('about.companyName')}
				</motion.h1>

				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='mb-12 space-y-6'
				>
					<motion.p
						whileHover={{ scale: 1.02 }}
						className='text-xl text-secondary-text dark:text-secondary-text-dark p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md'
					>
						{t('about.description')}
					</motion.p>
					<motion.p
						whileHover={{ scale: 1.02 }}
						className='text-lg text-secondary-text dark:text-secondary-text-dark p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md'
					>
						{t('about.mission')}
					</motion.p>
					<motion.p
						initial={{ rotate: -5 }}
						whileHover={{ rotate: 5 }}
						className='text-sm text-secondary-text dark:text-secondary-text-dark inline-block bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md transform -rotate-2'
					>
						🎉 Since {t('about.established')}
					</motion.p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='grid md:grid-cols-3 gap-8'
				>
					{services.map((service, index) => (
						<motion.div
							key={service.title}
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 * (index + 1) }}
						>
							<ServiceCard {...service} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</main>
	)
}
