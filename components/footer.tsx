'use client'

import { Brain } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Footer() {
	return (
		<>
			<section className="w-full py-12 md:py-24 lg:py-32 border-t">
				<div className="container mx-auto">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
								Ready to Transform Your development Experience?
							</h2>
							<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Join thousands of professionals who are already enhancing their expertise with AI-powered contests.
							</p>
						</div>
						<div className="mx-auto w-full max-w-sm space-y-2">
							<div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
								<Button size="lg" asChild>
									<Link href="/signup">Get Started for Free</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<Link href="/contact">Schedule a Demo</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="w-full border-t py-6 md:py-0 md:mb-4">
				<div className="container flex flex-col mx-auto items-center justify-between gap-4 md:h-24 md:flex-row">
					<div className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-primary" />
						<p className="text-sm font-medium">© {new Date().getFullYear()} TalentTank. All rights reserved.</p>
					</div>
					<div className="flex flex-wrap gap-4">
						<Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground">
							Cancellation and No Refund Policy
						</Link>
						<Link href="/toc" className="text-sm text-muted-foreground hover:text-foreground">
							Terms
						</Link>
						<Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
							Privacy Policy
						</Link>
						<Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
							Contact
						</Link>
					</div>
				</div>
				<p className="text-center text-xs">THIS WEBSITE IS MANGED BY SASHAKT ENTERPRISES PRIVATE LIMITED</p>
			</footer>
		</>
	)
}
