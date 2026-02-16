 import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
    id: number
    name: string
    email: string
    role: 'admin' | 'student'
    niches: string[]
    socialLinks: { ig?: string; tiktok?: string }
    totalBadges: number
}

interface WelcomeProps {
    onLogin?: (user: User) => void
}

const slides = [
  {
    id: 1,
    icon: '🚀',
    title: 'Welcome to SKYBOUND',
    subtitle: 'Your Creative Journey Starts Here',
    description: 'Where distance is not a barrier. Join thousands of young creators learning, growing, and sharing their passion.',
  },
  {
    id: 2,
    icon: '🎨',
    title: 'Learn from the Best',
    description: 'Access lessons in Digital Art, Music, Dance, Tech, and more. All taught by industry professionals.',
  },
  {
    id: 3,
    icon: '📋',
    title: 'Complete Tasks & Earn Badges',
    description: 'Put your skills to the test with real-world challenges. Get recognized for your achievements!',
  },
  {
    id: 4,
    icon: '🌟',
    title: 'Join Our Community',
    description: 'Connect with creators from around the world. Share your work, get feedback, and grow together.',
  },
]

export default function Welcome({ onLogin }: WelcomeProps) {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Auto-play slides
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  const handleGetStarted = () => {
    navigate('/onboarding')
  }

  const handleLoginDirect = () => {
    navigate('/onboarding?mode=login')
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Logo/Brand */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Progress Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-red-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-7xl mx-auto mb-6 animate-float">
              {slides[currentSlide].icon}
            </div>
            
            {slides[currentSlide].title && (
              <h1 className="text-3xl font-bold text-grey-900 mb-2">
                {slides[currentSlide].title}
              </h1>
            )}
            
            {slides[currentSlide].subtitle && (
              <p className="text-xl text-red-500 font-medium mb-4">
                {slides[currentSlide].subtitle}
              </p>
            )}
            
            <p className="text-gray-500 leading-relaxed px-4">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white shadow-soft hover:bg-red-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-sm text-gray-400">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white shadow-soft hover:bg-red-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-8 pb-12 space-y-4">
        {currentSlide === slides.length - 1 ? (
          <button
            onClick={handleGetStarted}
            className="btn-primary w-full py-4 text-lg"
          >
            Get Started 🚀
          </button>
        ) : (
          <button
            onClick={() => setCurrentSlide(currentSlide + 1)}
            className="btn-primary w-full"
          >
            Next →
          </button>
        )}

        <button
          onClick={handleLoginDirect}
          className="btn-secondary w-full"
        >
          Already have an account? Login
        </button>

        {/* Pause/Play auto */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="mx-auto block text-sm text-gray-400 hover:text-gray-600"
        >
          {isAutoPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
    </div>
  )
}
