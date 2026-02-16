import { useState, useEffect } from 'react'

interface Lesson {
  id: number
  title: string
  description: string
  cover_image_url?: string
  video_url?: string
  type: string
  created_at: string
}

export default function Academy() {
  const [filter, setFilter] = useState('all')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const categories = ['all', 'lesson']

  useEffect(() => {
    fetchContent()
  }, [filter])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/content?type=${filter}`)
      const data = await response.json().catch(() => ({ content: [] }))
      if (data.content) {
        setLessons(data.content)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
      setLessons([])
    } finally {
      setIsLoading(false)
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '🎬'
      case 'task': return '📋'
      case 'quiz': return '❓'
      default: return '📚'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Academy</h1>
        <p className="text-gray-500">Your learning journey awaits</p>
      </section>

      {/* Category Filter */}
      <section className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
              filter === cat 
                ? 'bg-red-500 text-white shadow-soft' 
                : 'bg-white text-grey-800 hover:bg-red-50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </section>

      {/* Lessons Grid (Bento) */}
      <section className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading content...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No lessons available yet</p>
            <p className="text-sm text-gray-400">Check back later for new content!</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <div 
              key={lesson.id}
              className="card group cursor-pointer overflow-hidden"
            >
              {/* Thumbnail with Play Overlay */}
              <div className="relative mb-4">
                {lesson.cover_image_url ? (
                  <img 
                    src={lesson.cover_image_url} 
                    alt={lesson.title}
                    className="aspect-video bg-gradient-to-br from-cream-200 to-gray-100 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-cream-200 to-gray-100 rounded-2xl flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                    {getLessonIcon(lesson.type)}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-soft">
                    <svg className="w-8 h-8 text-red-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-grey-900 mb-1">{lesson.title}</h3>
                <p className="text-gray-500">{lesson.description}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
