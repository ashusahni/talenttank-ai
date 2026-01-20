import type { ReactNode } from 'react'

interface FeatureCardProps {
	icon: ReactNode
	title: string
	description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
			<div className="p-2">{icon}</div>
			<h3 className="text-xl font-bold">{title}</h3>
			<p className="text-center text-muted-foreground">{description}</p>
		</div>
	)
}
