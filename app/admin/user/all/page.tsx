import prisma from '@/lib/prisma/prisma'
import { columns } from '@/components/tables/user-table/column'
import { DataTable } from '@/components/tables/user-table/data-table'

export default async function AllUsersPage() {
	const allUsers = await prisma.user.findMany()

	return (
		<div>
			<h1 className="text-2xl font-semibold mb-4">All Users</h1>
			<DataTable columns={columns} data={allUsers} />
		</div>
	)
}
