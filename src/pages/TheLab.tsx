import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
}

// API Response type
interface ApiPost {
  id: number
  author_id: number
  author_name: string
  content: string
  description?: string
  repost_id: number | null
  type: string
  created_at: string
}

export default function TheLab({ user }: { user?: User | null }) {
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/thelab')
      const data = await response.json().catch(() => ({ posts: [] }))
      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts as ApiPost[])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: number) => {
    if (!user) {
      setMessage('Please log in to like posts')
      return
    }

    try {
      await fetch('/api/thelab', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          userId: user.id,
          postId
        })
      })
      setMessage('Post liked! ❤️')
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleRepost = async (postId: number) => {
    if (!user) {
      setMessage('Please log in to repost')
      return
    }

    try {
      await fetch('/api/thelab', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'repost',
          userId: user.id,
          postId
        })
      })
      setMessage('Reposted successfully! 📢')
      fetchPosts()
    } catch (error) {
      console.error('Failed to repost:', error)
    }
  }

  const handleSave = async (postId: number) => {
    if (!user) {
      setMessage('Please log in to save posts')
      return
    }

    try {
      await fetch('/api/thelab', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          userId: user.id,
          postId
        })
      })
      setMessage('Post saved! 🔖')
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      setMessage('Please log in to post')
      return
    }
    if (!newPost.trim()) return

    setIsSubmitting(true)
    setMessage('')

    try {
      await fetch('/api/thelab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user.id,
          content: newPost
        })
      })
      setMessage('Post shared to The Lab! 🚀')
      setNewPost('')
      fetchPosts()
    } catch (error) {
      setMessage('Failed to share post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-grey-900 mb-2">The Lab</h1>
        <p className="text-gray-500">Share, connect, inspire</p>
      </section>

      {/* Create Post */}
      {user?.isDemo ? (
        <section className="card bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="font-medium text-grey-900">Demo Mode</p>
              <p className="text-sm text-gray-500">Sign up to post and interact</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="card">
          <h2 className="text-lg font-bold text-grey-900 mb-4">Share something</h2>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-cream-100 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button 
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={!newPost.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Sharing...' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Feed */}
      <section className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No posts yet</p>
            <p className="text-sm text-gray-400">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="card">
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-xl">
                  {post.author_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-grey-900">{post.author_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-400">{formatTime(post.created_at)}</p>
                </div>
              </div>
              
              {/* Content */}
              <p className="text-grey-800 mb-4">{post.content || post.description}</p>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Like</span>
                  </button>
                  
                  <button 
                    onClick={() => handleRepost(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Repost</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSave(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
