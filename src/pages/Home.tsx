import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: number
  name: string
  totalBadges?: number
}

interface UserStats {
  lessonsCompleted: number
  totalLessons: number
  streakDays: number
  badges: number
}

export default function Home({ user }: { user?: User | null }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState<UserStats>({
    lessonsCompleted: 0,
    totalLessons: 0,
    streakDays: 0,
    badges: user?.totalBadges || 0
  })

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      // Fetch lessons count
      const lessonsRes = await fetch('/api/content?type=lesson')
      const lessonsData = await lessonsRes.json().catch(() => ({ content: [] }))
      const lessonsCount = lessonsData.content?.length || 0

      setStats({
        lessonsCompleted: 0, // Will be calculated from submissions
        totalLessons: lessonsCount,
        streakDays: 0, // Would need a separate tracking system
        badges: user?.totalBadges || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Set default stats on error
      setStats({
        lessonsCompleted: 0,
        totalLessons: 0,
        streakDays: 0,
        badges: user?.totalBadges || 0
      })
    }
  }

  const getGardenStage = () => {
    const completed = stats.lessonsCompleted + stats.badges
    if (completed >= 10) return 5
    if (completed >= 7) return 4
    if (completed >= 5) return 3
    if (completed >= 3) return 2
    if (completed >= 1) return 1
    return 0
  }

  const gardenStage = getGardenStage()

  const gardenIcons = ['🌱', '🌿', '🌳', '🌸', '🏆']

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">
          Welcome back, {user?.name || 'Explorer'}! 🌟
        </h1>
        <p className="text-gray-500">Distance is Not a Barrier</p>
      </section>

      {/* Progress Garden Card */}
      <section className="card washi-tape">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-grey-900">Progress Garden</h2>
          <span className="text-2xl">🌱</span>
        </div>
        
        {/* Garden Visualization */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((plant) => (
            <div 
              key={plant}
              className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                plant <= gardenStage 
                  ? 'bg-green-100 scale-100' 
                  : 'bg-gray-100 scale-90 opacity-50'
              }`}
            >
              {plant <= gardenStage ? gardenIcons[plant - 1] : '🌱'}
            </div>
          ))}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-cream-100 rounded-2xl">
            <p className="text-3xl font-bold text-red-500">{stats.streakDays || 0}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
          <div className="text-center p-4 bg-cream-100 rounded-2xl">
            <p className="text-3xl font-bold text-grey-900">{stats.totalLessons}</p>
            <p className="text-sm text-gray-500">Lessons</p>
          </div>
          <div className="text-center p-4 bg-cream-100 rounded-2xl">
            <p className="text-3xl font-bold text-yellow-500">{stats.badges}</p>
            <p className="text-sm text-gray-500">Badges</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-grey-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/academy')}
            className="card flex flex-col items-center gap-3 hover:border-2 hover:border-red-400 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold">Continue Learning</span>
          </button>
          
          <button 
            onClick={() => navigate('/tasks')}
            className="card flex flex-col items-center gap-3 hover:border-2 hover:border-red-400 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-semibold">View Tasks</span>
          </button>
          
          <button 
            onClick={() => navigate('/the-lab')}
            className="card flex flex-col items-center gap-3 hover:border-2 hover:border-red-400 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <span className="font-semibold">The Lab</span>
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="card flex flex-col items-center gap-3 hover:border-2 hover:border-red-400 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-semibold">Profile</span>
          </button>
        </div>
      </section>

      {/* Daily Quote */}
      <section className="card bg-gradient-to-br from-red-50 to-cream-100">
        <p className="text-lg font-medium text-grey-900 text-center">
          "The sky is not the limit—it's just the beginning. 🚀"
        </p>
      </section>
    </div>
  )
}
