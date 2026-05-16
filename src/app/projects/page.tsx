'use client'
import { useState, useEffect } from 'react'
import { Plus, Folder, Users, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })
      if (res.ok) {
        setShowModal(false)
        setNewProject({ name: '', description: '' })
        fetchProjects()
      }
    } catch (error) {
      console.error('Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-[var(--text-muted)]">Manage and track all your team projects.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} /> Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-card p-6 flex flex-col hover:border-indigo-500/50 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Folder size={24} />
                </div>
                <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-800 px-2 py-1 rounded">
                  {project._count?.tasks || 0} Tasks
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-[var(--text-muted)] text-sm mb-6 line-clamp-2 flex-1">
                {project.description || 'No description provided.'}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <Link 
                  href={`/projects/${project.id}`}
                  className="text-white hover:text-indigo-400 transition-colors flex items-center gap-1 text-sm font-semibold"
                >
                  View Project <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card">
              <Folder size={48} className="mx-auto text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-[var(--text-muted)] mb-6">Create your first project to start managing tasks.</p>
              <button 
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                <Plus size={20} /> Create Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass-card w-full max-w-lg p-8 animate-fade-in shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marketing Campaign 2024"
                  className="input-field"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  placeholder="What is this project about?"
                  className="input-field min-h-[120px]"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn flex-1 bg-slate-800 hover:bg-slate-700 text-white justify-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary flex-1 justify-center"
                >
                  {creating ? <Loader2 className="animate-spin" size={20} /> : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
