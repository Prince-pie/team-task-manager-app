'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, FolderKanban, Users, CheckSquare } from 'lucide-react'

export default function Sidebar({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FolderKanban size={20} />, label: 'Projects', href: '/projects' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', href: '/tasks' },
  ]

  if (user?.role === 'ADMIN') {
    menuItems.push({ icon: <Users size={20} />, label: 'Team', href: '/team' })
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--nav-bg)] border-r border-[var(--glass-border)] flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="font-bold text-xl">T</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          TaskMaster
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--card-bg)] transition-all duration-200"
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
