import Link from 'next/link'

const HomePage = () => {
	return (
		<div>
			<h1>next-localization</h1>
			<div>
				<Link href='/dashboard'>Go to CSR example (/dashboard)</Link>
			</div>
			<div>
				<Link href='/foo'>Go to SSG example (/foo)</Link>
			</div>
			<div>
				<Link href='/namespace'>Go to code-splitting example (/namespace)</Link>
			</div>
		</div>
	)
}

export default HomePage
