'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { buttonVariants } from './ui/button'
import { UserRound } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

export function AdminNav() {
	const pathname = usePathname()

	const routes = [
		{
			href: '/admin',
			label: 'Dashboard',
			active: pathname === '/admin',
		},
		{
			href: '/admin/report',
			label: 'User Responses',
			active: pathname === '/admin/report',
		},
	]

	return (
		<header className="border-b sticky top-0 z-50 backdrop-blur">
			<div className="container mx-auto p-4 sm:px-0 flex justify-between items-center">
				<Link href={'/'}>
					<Image src={'/assets/images/logo.png'} width={1024} height={1024} className="w-16 h-16" alt="Talentank AI" />
				</Link>
				<nav className="flex items-center space-x-4 lg:space-x-6">
					{routes.map(route => (
						<Link
							key={route.href}
							href={route.href}
							className={cn(
								'text-sm font-medium transition-colors hover:text-primary',
								route.active ? 'text-black dark:text-white' : 'text-muted-foreground',
								'hidden sm:block'
							)}>
							{route.label}
						</Link>
					))}

					<DropdownMenu>
						<DropdownMenuTrigger>
							<Link href={'/profile/edit'} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full p-0')}>
								<UserRound />
							</Link>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="center">
							<DropdownMenuItem>
								<Link href={'/admin'}>Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={'/admin/report'}>All Responses</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => signOut({ redirectTo: '/' })}>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</nav>
			</div>
		</header>
	)
}