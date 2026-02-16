import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email?: string
  niches?: string[]
  socialLinks?: { ig?: string; tiktok?: string }
  totalBadges?: number
}

interface Badge {
  id: number
  name: string
  icon: string
  description: string
  earned: boolean
  earnedAt?: string
}

interface Certificate {
  id: number
  title: string
  date: string
  color: string
}

interface ProfileProps {
  user?: User | null
}

export default function Profile({ user }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates' | 'stats'>('badges')
  const [userBadges, setUserBadges] = useState<Badge[]>([])
  const [isLoadingBadges, setIsLoadingBadges] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchUserBadges()
    }
  }, [user?.id])

  const fetchUserBadges = async () => {
    if (!user?.id) return
    setIsLoadingBadges(true)
    try {
      const response = await fetch(`/api/badges?userId=${user.id}`)
      const data = await response.json().catch(() => ({ badges: [] }))
      if (data.badges) {
        setUserBadges(data.badges)
      }
    } catch (error) {
      console.error('Failed to fetch badges:', error)
    } finally {
      setIsLoadingBadges(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <section className="card text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-soft">
          {user?.name?.charAt(0) || 'S'}
        </div>
        <h1 className="text-2xl font-bold text-grey-900">{user?.name || 'Student'}</h1>
        <p className="text-gray-500">{user?.email || 'student@skybound.academy'}</p>

        {/* Niches */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {(user?.niches || ['Art', 'Music']).map((niche) => (
            <span key={niche} className="px-4 py-2 bg-cream-200 rounded-full text-sm font-medium">
              {niche}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-4">
          {user?.socialLinks?.ig && (
            <a href={`https://instagram.com/${user.socialLinks.ig}`} className="text-gray-400 hover:text-pink-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          )}
          {user?.socialLinks?.tiktok && (
            <a href={`https://tiktok.com/@${user.socialLinks.tiktok}`} className="text-gray-400 hover:text-black">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* Stats Card */}
      <section className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-500">{user?.totalBadges || 3}</p>
          <p className="text-xs text-gray-500">Badges</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-500">12</p>
          <p className="text-xs text-gray-500">Lessons</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-500">7</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex gap-4 border-b border-gray-200 pb-2">
        {['badges', 'certificates', 'stats'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 px-4 font-medium transition-colors ${activeTab === tab
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </section>

      {/* Tab Content */}
      {activeTab === 'badges' && (
        <section className="grid grid-cols-3 gap-4">
          {isLoadingBadges ? (
            <div className="col-span-3 text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : userBadges.length > 0 ? (
            userBadges.map((badge) => (
              <div
                key={badge.id}
                className={`card text-center transition-all duration-300 ${badge.earned ? 'opacity-100' : 'opacity-40 grayscale'
                  }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-semibold text-sm text-grey-900">{badge.name}</p>
                <p className="text-xs text-gray-400">{badge.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-400">
              No badges available yet
            </div>
          )}
        </section>
      )}

      {activeTab === 'certificates' && userBadges.filter(b => b.earned).length > 0 && (
        <section className="grid grid-cols-1 gap-4">
          {userBadges.filter(b => b.earned).slice(0, 4).map((badge, index) => (
            <div
              key={badge.id}
              className={`card bg-gradient-to-br ${['from-pink-400 to-purple-500', 'from-blue-400 to-cyan-500', 'from-green-400 to-teal-500', 'from-yellow-400 to-orange-500'][index % 4]
                } text-white`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">{badge.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{badge.name}</h3>
                  <p className="text-white/80 text-sm">Earned: {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Recently'}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {activeTab === 'certificates' && userBadges.filter(b => b.earned).length === 0 && (
        <section className="text-center py-8 text-gray-400">
          <p>No certificates earned yet. Complete tasks to earn badges!</p>
        </section>
      )}

      {activeTab === 'stats' && (
        <section className="card">
          <h3 className="font-bold text-grey-900 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            {[
              { skill: 'Digital Art', progress: 75, color: 'bg-pink-500' },
              { skill: 'Music Production', progress: 45, color: 'bg-blue-500' },
              { skill: 'Creative Writing', progress: 30, color: 'bg-purple-500' },
              { skill: 'Problem Solving', progress: 60, color: 'bg-green-500' },
            ].map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.skill}</span>
                  <span className="text-sm text-gray-400">{item.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
