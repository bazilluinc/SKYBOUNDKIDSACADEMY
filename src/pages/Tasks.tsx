import { useState, useEffect } from 'react'

interface Task {
  id: number
  title: string
  description: string
  cover_image_url?: string
  video_url?: string
  type: string
  dueDate?: string
  status?: 'pending' | 'submitted' | 'completed'
}

export default function Tasks({ user }: { user?: any }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/content?type=task')
      const data = await response.json().catch(() => ({ content: [] }))
      if (data.content) {
        setTasks(data.content)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (taskId: number) => {
    if (!user) {
      setMessage('Please log in to submit tasks')
      return
    }
    if (!videoUrl.trim()) {
      setMessage('Please enter a video URL')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          contentId: taskId,
          videoProofUrl: videoUrl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit task')
      }

      setMessage('Task submitted successfully! 🎉')
      setSelectedTask(null)
      setVideoUrl('')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const submittedCount = 0
  const completedCount = 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Tasks</h1>
        <p className="text-gray-500">Complete assignments and earn badges</p>
      </section>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Task Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-500">{tasks.length}</p>
          <p className="text-sm text-gray-500">Available</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-500">{submittedCount}</p>
          <p className="text-sm text-gray-500">Submitted</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-500">{completedCount}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </div>
      </section>

      {/* Tasks List */}
      <section className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No tasks available yet</p>
            <p className="text-sm text-gray-400">Check back later for new assignments!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="card washi-tape cursor-pointer hover:border-2 hover:border-red-400"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-grey-900">{task.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Click to submit →</span>
                <span className="text-red-500 text-sm font-medium">Submit →</span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Submit Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-grey-900">Submit Task</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
                <p className="text-grey-900">{selectedTask.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Proof URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste your video URL (YouTube, TikTok, etc.)"
                  className="w-full bg-cream-100 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Record yourself completing the task and paste the link here
                </p>
              </div>

              <button
                onClick={() => handleSubmit(selectedTask.id)}
                disabled={isSubmitting || !videoUrl.trim() || user?.isDemo}
                className="btn-primary w-full"
              >
                {user?.isDemo ? 'Sign up to submit' : isSubmitting ? 'Submitting...' : 'Submit Task'}
              </button>
              {user?.isDemo && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Demo mode - Sign up to submit tasks
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
