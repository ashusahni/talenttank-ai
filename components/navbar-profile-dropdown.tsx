'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { UserRound } from 'lucide-react'

export default function NavbarProfileDropdown() {
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Link href={'/profile/edit'} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'rounded-full p-0')}>
						<UserRound />
					</Link>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="bottom" align="center">
					<DropdownMenuItem>
						<Link href={'/profile/edit'}>Profile</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href={'/user/all-reports'}>All Reports</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
