export function ArchitectureStudy({
	label,
	caption,
}: {
	label: string
	caption: string
}) {
	return (
		<figure className='architecture-study'>
			<div className='study-stage' aria-hidden='true'>
				<span className='study-index'>FORM / 001</span>
				<div className='study-orbit' />
				<div className='study-vault' />
				<div className='study-sail' />
				<div className='study-disc' />
				<div className='study-baseline' />
				<span className='study-note'>CHALK & COBALT</span>
			</div>
			<figcaption>
				<span>{label}</span>
				<span>{caption}</span>
			</figcaption>
		</figure>
	)
}
