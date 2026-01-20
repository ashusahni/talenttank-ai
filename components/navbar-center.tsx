'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavbarCenter() {
	const pathname = usePathname()

	if (pathname === '/') {
		return (
			<div>
				<nav className="hidden md:flex gap-6">
					<Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
						Features
					</Link>
					<Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
						How It Works
					</Link>
					<Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
						Pricing
					</Link>
					<Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
						Testimonials
					</Link>
				</nav>
			</div>
		)
	}
}
