import { useState, useEffect } from 'react'

interface Submission {
    id: number
    studentId: number
    studentName: string
    taskTitle: string
    videoUrl: string
    submittedAt: string
    status: 'pending' | 'approved'
    score: number | null
}

interface Stats {
    lessons: number
    tasks: number
    students: number
    pendingReviews: number
}

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'grading'>('dashboard')
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [score, setScore] = useState('')
    const [uploadType, setUploadType] = useState<'lesson' | 'task' | 'quiz'>('lesson')
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        videoUrl: '',
        coverImageUrl: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [stats] = useState<Stats>({
        lessons: 0,
        tasks: 0,
        students: 0,
        pendingReviews: 0
    })

    // Fetch submissions on mount
    useEffect(() => {
        fetchSubmissions()
    }, [])

    const fetchSubmissions = async () => {
        try {
            const response = await fetch('/api/submissions?status=pending')
            const data = await response.json()
            if (data.submissions) {
                setSubmissions(data.submissions.map((s: any) => ({
                    id: s.id,
                    studentId: s.student_id,
                    studentName: s.student_name,
                    taskTitle: s.task_title,
                    videoUrl: s.video_proof_url,
                    submittedAt: new Date(s.submitted_at).toLocaleDateString(),
                    status: s.status,
                    score: s.secret_score
                })))
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error)
        }
    }

    const handleGrade = async () => {
        if (!selectedSubmission || !score) return

        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/submissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: selectedSubmission.id,
                    score: parseInt(score)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to grade submission')
            }

            setMessage('Score submitted successfully! 🎉')
            setSelectedSubmission(null)
            setScore('')
            fetchSubmissions()
        } catch (error: any) {
            setMessage(`Error: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpload = async () => {
        if (!uploadForm.title) {
            setMessage('Please enter a title')
            return
        }

        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: uploadType,
                    title: uploadForm.title,
                    description: uploadForm.description,
                    videoUrl: uploadForm.videoUrl || null,
                    coverImageUrl: uploadForm.coverImageUrl || null
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload content')
            }

            setMessage(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully! 📤`)
            setUploadForm({ title: '', description: '', videoUrl: '', coverImageUrl: '' })
        } catch (error: any) {
            setMessage(`Error: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <section className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-grey-900">Admin Panel</h1>
                    <p className="text-gray-500">Manage content and grade submissions</p>
                </div>
            </section>

            {message && (
                <div className={`p-4 rounded-xl ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Admin Tabs */}
            <section className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {[
                    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                    { id: 'upload', icon: '📤', label: 'Upload' },
                    { id: 'grading', icon: '✏️', label: 'Grading' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-red-500 text-white shadow-soft'
                                : 'bg-white text-grey-800 hover:bg-red-50'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </section>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <section className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-blue-500">{stats.lessons}</p>
                            <p className="text-sm text-gray-500">Lessons</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-yellow-500">{stats.tasks}</p>
                            <p className="text-sm text-gray-500">Active Tasks</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-green-500">{stats.students}</p>
                            <p className="text-sm text-gray-500">Students</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-red-500">{submissions.length}</p>
                            <p className="text-sm text-gray-500">Pending Reviews</p>
                        </div>
                    </div>

                    {/* Quick Actions - WhatsApp Style (+) */}
                    <div className="card">
                        <h3 className="font-bold text-grey-900 mb-4">Quick Upload (+)</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { type: 'lesson', icon: '🎬', label: 'Lesson' },
                                { type: 'task', icon: '📋', label: 'Task' },
                                { type: 'quiz', icon: '❓', label: 'Quiz' },
                            ].map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => { setActiveTab('upload'); setUploadType(item.type as any) }}
                                    className="flex flex-col items-center gap-2 p-4 bg-cream-100 rounded-2xl hover:bg-red-50 transition-colors"
                                >
                                    <span className="text-3xl">{item.icon}</span>
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <section className="card space-y-6">
                    <div className="flex gap-3">
                        {[
                            { type: 'lesson', icon: '🎬', label: 'Lesson' },
                            { type: 'task', icon: '📋', label: 'Task' },
                            { type: 'quiz', icon: '❓', label: 'Quiz' },
                        ].map((item) => (
                            <button
                                key={item.type}
                                onClick={() => setUploadType(item.type as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all ${uploadType === item.type
                                        ? 'bg-red-500 text-white'
                                        : 'bg-cream-100 text-grey-800 hover:bg-red-50'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                placeholder={`Enter ${uploadType} title`}
                                className="w-full bg-cream-100 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={uploadForm.description}
                                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                placeholder="Describe the content..."
                                rows={3}
                                className="w-full bg-cream-100 rounded-2xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {uploadType === 'task' ? 'Cover Image' : 'Video'} URL
                            </label>
                            <input
                                type="url"
                                value={uploadType === 'task' ? uploadForm.coverImageUrl : uploadForm.videoUrl}
                                onChange={(e) => uploadType === 'task'
                                    ? setUploadForm({ ...uploadForm, coverImageUrl: e.target.value })
                                    : setUploadForm({ ...uploadForm, videoUrl: e.target.value })
                                }
                                placeholder={uploadType === 'task' ? 'Cover image URL' : 'Video URL'}
                                className="w-full bg-cream-100 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                        </div>

                        <button 
                            onClick={handleUpload} 
                            disabled={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? 'Uploading...' : `Upload ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`}
                        </button>
                    </div>
                </section>
            )}

            {/* Grading Tab */}
            {activeTab === 'grading' && (
                <section className="space-y-6">
                    {/* Pending Submissions */}
                    <div className="card">
                        <h3 className="font-bold text-grey-900 mb-4">Pending Reviews ({submissions.filter(s => s.status === 'pending').length})</h3>
                        {submissions.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No pending submissions</p>
                        ) : (
                            <div className="space-y-4">
                                {submissions.filter(s => s.status === 'pending').map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="p-4 bg-cream-100 rounded-2xl cursor-pointer hover:bg-red-50 transition-colors"
                                        onClick={() => setSelectedSubmission(submission)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold">{submission.studentName}</p>
                                            <span className="text-sm text-gray-400">{submission.submittedAt}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm">{submission.taskTitle}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-red-500">Watch Video</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Grading Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-grey-900">Grade Submission</h2>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-cream-100 rounded-2xl">
                                <p className="font-semibold">{selectedSubmission.studentName}</p>
                                <p className="text-gray-500">{selectedSubmission.taskTitle}</p>
                            </div>

                            {/* Video Player Placeholder */}
                            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-400">Video Player</p>
                                    <a href={selectedSubmission.videoUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 text-sm">Open in new tab ↗</a>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Secret Score (0-100)
                                </label>
                                <input
                                    type="number"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    min="0"
                                    max="100"
                                    placeholder="Enter score"
                                    className="w-full bg-cream-100 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    This score is used for the Leaderboard but remains hidden from the student
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGrade}
                                    disabled={!score || Number(score) < 0 || Number(score) > 100 || isLoading}
                                    className="btn-primary flex-1"
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Score'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
