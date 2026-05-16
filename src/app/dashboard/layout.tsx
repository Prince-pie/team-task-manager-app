import Sidebar from '@/components/Sidebar'
import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 min-h-screen p-10">
        {children}
      </main>
    </div>
  )
}
