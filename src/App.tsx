import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/Welcome'
import OnboardingPage from './pages/Onboarding'
import HomePage from './pages/Home'
import AcademyPage from './pages/Academy'
import TasksPage from './pages/Tasks'
import ProfilePage from './pages/Profile'
import TheLabPage from './pages/TheLab'
import Layout from './components/Layout'
import BottomNav from './components/BottomNav'

// Simple Auth Context
interface User {
  id: number
  name: string
  email?: string
  totalBadges?: number
  isDemo?: boolean
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('skybound_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user from localStorage')
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('skybound_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('skybound_user')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/onboarding" element={<OnboardingPage onComplete={handleLogin} />} />

        {/* Protected App Routes */}
        <Route path="/app" element={
          user ? (
            <Layout>
              <HomePage user={user} />
              <BottomNav />
            </Layout>
          ) : (
            <Navigate to="/onboarding" />
          )
        } />

        <Route path="/app/academy" element={
          user ? (
            <Layout>
              <AcademyPage />
              <BottomNav />
            </Layout>
          ) : (
            <Navigate to="/onboarding" />
          )
        } />

        <Route path="/app/tasks" element={
          user ? (
            <Layout>
              <TasksPage user={user} />
              <BottomNav />
            </Layout>
          ) : (
            <Navigate to="/onboarding" />
          )
        } />

        <Route path="/app/lab" element={
          user ? (
            <Layout>
              <TheLabPage user={user} />
              <BottomNav />
            </Layout>
          ) : (
            <Navigate to="/onboarding" />
          )
        } />

        <Route path="/app/profile" element={
          user ? (
            <Layout>
              <ProfilePage user={user} />
              <BottomNav />
            </Layout>
          ) : (
            <Navigate to="/onboarding" />
          )
        } />

        {/* Admin Route */}
        <Route path="/admin" element={<Navigate to="/app" />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
