import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getAuthUser()
  
  // Real stats from DB
  const totalTasks = await prisma.task.count({
    where: {
      OR: [
        { assigneeId: user?.id },
        { project: { ownerId: user?.id } }
      ]
    }
  })

  const completedTasks = await prisma.task.count({
    where: {
      status: 'DONE',
      OR: [
        { assigneeId: user?.id },
        { project: { ownerId: user?.id } }
      ]
    }
  })

  const pendingTasks = totalTasks - completedTasks

  const recentTasks = await prisma.task.findMany({
    where: {
      OR: [
        { assigneeId: user?.id },
        { project: { ownerId: user?.id } }
      ]
    },
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { project: true }
  })

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: <CheckCircle2 className="text-indigo-400" />, trend: '+12%' },
    { label: 'Pending', value: pendingTasks, icon: <Clock className="text-amber-400" />, trend: '5 active' },
    { label: 'Completed', value: completedTasks, icon: <TrendingUp className="text-emerald-400" />, trend: '80%' },
    { label: 'Overdue', value: 0, icon: <AlertCircle className="text-rose-400" />, trend: '0 high' },
  ]

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}!</h1>
        <p className="text-[var(--text-muted)] text-lg">Here's what's happening with your projects today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800/50 rounded-xl">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentTasks.length > 0 ? recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className={`w-2 h-10 rounded-full ${
                  task.status === 'DONE' ? 'bg-emerald-500' : 
                  task.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-slate-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{task.title}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{task.project.name}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    task.status === 'DONE' ? 'badge-done' : 
                    task.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-todo'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-[var(--text-muted)] py-10">No recent tasks found.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Links</h2>
          <div className="space-y-3">
            <button className="btn btn-primary w-full justify-center">Create New Project</button>
            <button className="btn w-full justify-center bg-slate-800 hover:bg-slate-700 text-white">Invite Team Member</button>
            <button className="btn w-full justify-center bg-slate-800 hover:bg-slate-700 text-white">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  )
}
