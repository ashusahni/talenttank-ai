'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function MobileNav() {
	const [open, setOpen] = useState(false)

	return (
		<div className="md:hidden">
			<Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
				<Menu className="h-5 w-5" />
				<span className="sr-only">Toggle menu</span>
			</Button>
			{open && (
				<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
					<div className="fixed inset-y-0 right-0 w-full max-w-xs border-l bg-background p-6 shadow-lg">
						<div className="flex items-center justify-between">
							<Link href={'/'} className="flex items-center gap-2">
								<Image src={'/assets/images/logo.png'} width={1024} height={1024} className="w-16 h-16" alt="Talentank AI" />
							</Link>
							<Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
								<X className="h-5 w-5" />
								<span className="sr-only">Close menu</span>
							</Button>
						</div>
						<nav className="mt-8 flex flex-col gap-4 mx-auto">
							<Link
								href="#features"
								className="text-lg font-medium transition-colors hover:text-primary"
								onClick={() => setOpen(false)}>
								Features
							</Link>
							<Link
								href="#how-it-works"
								className="text-lg font-medium transition-colors hover:text-primary"
								onClick={() => setOpen(false)}>
								How It Works
							</Link>
							<Link
								href="#pricing"
								className="text-lg font-medium transition-colors hover:text-primary"
								onClick={() => setOpen(false)}>
								Pricing
							</Link>
							<Link
								href="#testimonials"
								className="text-lg font-medium transition-colors hover:text-primary"
								onClick={() => setOpen(false)}>
								Testimonials
							</Link>
							<Link
								href="/login"
								className="text-lg font-medium transition-colors hover:text-primary"
								onClick={() => setOpen(false)}>
								Log in
							</Link>
							<Button asChild onClick={() => setOpen(false)}>
								<Link href="/signup">Get Started</Link>
							</Button>
						</nav>
					</div>
				</div>
			)}
		</div>
	)
}