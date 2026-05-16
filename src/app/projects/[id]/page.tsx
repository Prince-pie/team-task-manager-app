'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Loader2, 
  MoreVertical,
  Trash2,
  Calendar
} from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
  const [creatingTask, setCreatingTask] = useState(false)

  useEffect(() => {
    fetchProjectData()
  }, [params.id])

  const fetchProjectData = async () => {
    try {
      const projRes = await fetch(`/api/projects/${params.id}`)
      if (!projRes.ok) throw new Error('Project not found')
      const projData = await projRes.json()
      setProject(projData)

      const tasksRes = await fetch(`/api/tasks?projectId=${params.id}`)
      const tasksData = await tasksRes.json()
      setTasks(tasksData)
    } catch (error) {
      console.error(error)
      // router.push('/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingTask(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, projectId: params.id }),
      })
      if (res.ok) {
        setShowTaskModal(false)
        setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
        fetchProjectData()
      }
    } catch (error) {
      console.error('Failed to create task')
    } finally {
      setCreatingTask(false)
    }
  }

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchProjectData()
    } catch (error) {
      console.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      fetchProjectData()
    } catch (error) {
      console.error('Failed to delete task')
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
    </div>
  )

  if (!project) return <div className="text-center py-20">Project not found</div>

  return (
    <div className="animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <button onClick={() => router.push('/projects')} className="hover:text-white transition-colors">Projects</button>
        <ChevronRight size={14} />
        <span className="text-white font-medium">{project.name}</span>
      </nav>

      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">{project.name}</h1>
          <p className="text-[var(--text-muted)] max-w-2xl">{project.description}</p>
        </div>
        <button 
          onClick={() => setShowTaskModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
          <div key={status} className="glass-card p-6 bg-slate-900/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'DONE' ? 'bg-emerald-500' : 
                  status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-slate-500'
                }`} />
                {status.replace('_', ' ')}
              </h3>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-[var(--text-muted)] font-bold">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>

            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map((task) => (
                <div key={task.id} className="p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-all group relative">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h4>
                    <div className="flex gap-1">
                      {status !== 'DONE' && (
                        <button 
                          onClick={() => handleUpdateStatus(task.id, status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                          className="p-1 hover:text-emerald-400 text-[var(--text-muted)] transition-colors"
                          title="Move to next stage"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 hover:text-rose-400 text-[var(--text-muted)] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' :
                      task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                        <Calendar size={10} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                  <p className="text-xs text-slate-600 italic">No tasks yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass-card w-full max-w-lg p-8 animate-fade-in shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Landing Page"
                  className="input-field"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="Details about the task..."
                  className="input-field min-h-[100px]"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Priority</label>
                  <select 
                    className="input-field appearance-none bg-slate-900"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="btn flex-1 bg-slate-800 hover:bg-slate-700 text-white justify-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creatingTask}
                  className="btn btn-primary flex-1 justify-center"
                >
                  {creatingTask ? <Loader2 className="animate-spin" size={20} /> : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
