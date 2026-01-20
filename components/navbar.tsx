import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { auth } from '@/auth'

import NavbarProfileDropdown from './navbar-profile-dropdown'
import NavbarCenter from './navbar-center'
import Image from 'next/image'

export async function Navbar() {
	const session = await auth()
	const user = session?.user

	return (
		<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 overflow-y-hidden">
			<div className="px-4 mx-auto z-40 w-full">
				<div className="container mx-auto  flex h-16 items-center justify-between">
					<Link href={'/'} className="flex items-center gap-2">
						<Image src={'/assets/images/logo.png'} width={1024} height={1024} className="w-16 h-16" alt="Talentank AI" />
					</Link>

					<NavbarCenter />

					<div className="flex items-center gap-4">
						{!user && (
							<Link href="/login" className="hidden md:inline-flex text-sm font-medium transition-colors hover:text-primary">
								Log in
							</Link>
						)}

						<Button asChild>
							<Link href="/user/questionnaire/original">Get Started</Link>
						</Button>

						{user && <NavbarProfileDropdown />}
					</div>
				</div>
			</div>
		</div>
	)
}