'use client'
import { ColumnDef } from '@tanstack/react-table'
import type { User } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const columns: ColumnDef<User>[] = [
	{ accessorKey: 'id', header: 'User ID' },
	{
		accessorKey: 'firstName',
		header: 'Name',
		cell: ({ row }) => {
			return `${row.original.firstName} ${row.original.lastName}`
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'dateOfBirth',
		header: 'Date of Birth',
		cell: ({ row }) => {
			return new Date(row.original.dateOfBirth).toLocaleDateString()
		},
	},
	{ accessorKey: 'jobTitle', header: 'Professional Occupation' },
	{ accessorKey: 'company', header: 'Company' },
	{
		id: 'actions',
		cell: ({ row }) => {
			const email = row.original.email

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(email)}>Copy Email</DropdownMenuItem>
						{/* <DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link href={`/admin/user/${row.original.id}`}>View User</Link>
						</DropdownMenuItem> */}
						{/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
