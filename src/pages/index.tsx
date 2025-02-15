import { motion } from 'framer-motion'
import useNamespace from '@/hooks/useNamespace'

const HomePage = () => {
	const { t } = useNamespace('common')

	const bounceVariant = {
		initial: { scale: 0 },
		animate: {
			scale: 1,
			transition: { type: 'spring', stiffness: 400, damping: 10 },
		},
	}

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.3,
			},
		},
	}

	const item = {
		hidden: { opacity: 0, scale: 0.5, rotate: -10 },
		show: {
			opacity: 1,
			scale: 1,
			rotate: 0,
			transition: {
				type: 'spring',
				stiffness: 260,
				damping: 20,
			},
		},
	}

	const features = [
		{
			icon: '🌍',
			title: t('features.internationalization.title'),
			description: t('features.internationalization.description'),
		},
		{
			icon: '🎨',
			title: t('features.themeControl.title'),
			description: t('features.themeControl.description'),
		},
		{
			icon: '📱',
			title: t('features.pwaReady.title'),
			description: t('features.pwaReady.description'),
		},
		{
			icon: '🚀',
			title: t('features.ssrSsg.title'),
			description: t('features.ssrSsg.description'),
		},
	]

	return (
		<motion.div
			className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 p-6 pb-20'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<motion.h2
				className='text-5xl font-bold mb-6 text-primary text-center bg-clip-text bg-gradient-to-r from-primary to-secondary'
				variants={bounceVariant}
				initial='initial'
				animate='animate'
			>
				{t('welcome')}
			</motion.h2>

			<motion.p
				className='text-xl mb-12 text-center max-w-2xl text-secondary-text dark:text-secondary-text-dark'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				{t('description')}
			</motion.p>

			<motion.div
				className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl'
				variants={container}
				initial='hidden'
				animate='show'
			>
				{features.map((feature, index) => (
					<motion.div
						key={index}
						className='feature-card p-8 rounded-xl shadow-lg backdrop-blur-sm bg-secondary-bg dark:bg-secondary-bg-dark border border-secondary-bg dark:border-secondary-bg-dark'
						variants={item}
						whileHover={{
							scale: 1.05,
							rotate: 2,
							boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
						}}
						whileTap={{ scale: 0.95 }}
					>
						<motion.span
							className='text-4xl block mb-4'
							animate={{ rotate: [0, 10, -10, 10, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							{feature.icon}
						</motion.span>
						<h2 className='text-2xl font-semibold mb-3 text-primary-text dark:text-primary-text-dark'>
							{feature.title}
						</h2>
						<p className='text-secondary-text dark:text-secondary-text-dark'>
							{feature.description}
						</p>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	)
}

export default HomePage
