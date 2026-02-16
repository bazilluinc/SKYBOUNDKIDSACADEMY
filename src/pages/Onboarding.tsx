import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'student'
  niches: string[]
  socialLinks: { ig?: string; tiktok?: string }
  totalBadges: number
  isDemo?: boolean
}

interface OnboardingProps {
  onComplete: (user: User) => void
}

const niches = [
  { id: 'afro', icon: '🎭', label: 'Afro Beat' },
  { id: 'kpop', icon: '💃', label: 'K-Pop' },
  { id: 'art', icon: '🎨', label: 'Digital Art' },
  { id: 'music', icon: '🎵', label: 'Music' },
  { id: 'dance', icon: '💫', label: 'Dance' },
  { id: 'tech', icon: '💻', label: 'Tech' },
  { id: 'fashion', icon: '👗', label: 'Fashion' },
  { id: 'story', icon: '📖', label: 'Storytelling' },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    selectedNiches: [] as string[],
    ig: '',
    tiktok: ''
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check for login mode from URL
  useEffect(() => {
    if (searchParams.get('mode') === 'login') {
      setStep(5)
    }
  }, [searchParams])

  const handleNicheToggle = (nicheId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedNiches: prev.selectedNiches.includes(nicheId)
        ? prev.selectedNiches.filter(id => id !== nicheId)
        : [...prev.selectedNiches, nicheId]
    }))
  }

  const handleSignup = async () => {
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!formData.email.trim()) {
      setError('Please enter your email')
      return
    }
    if (formData.selectedNiches.length === 0) {
      setError('Please select at least one niche')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          niches: formData.selectedNiches,
          socialLinks: {
            ig: formData.ig || undefined,
            tiktok: formData.tiktok || undefined
          }
        })
      })

      const data = await response.json().catch(() => ({ error: 'Server not responding. Please try again.' }))

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Store user and complete onboarding
      onComplete?.(data.user)
      navigate('/app')
    } catch (err: any) {
      setError(err.message || 'Connection error. Make sure the server is running.')
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email
        })
      })

      const data = await response.json().catch(() => ({ error: 'Server not responding. Please try again.' }))

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store user and complete onboarding
      onComplete?.(data.user)
      navigate('/app')
    } catch (err: any) {
      setError(err.message || 'Connection error. Make sure the server is running.')
      setIsLoading(false)
    }
  }

  const handleDemo = () => {
    // Create a demo user
    const demoUser: User = {
      id: Date.now(),
      name: 'Demo User',
      email: 'demo@skybound.app',
      role: 'student',
      niches: ['art', 'music'],
      socialLinks: {},
      totalBadges: 0,
      isDemo: true
    }
    
    onComplete?.(demoUser)
    localStorage.setItem('skybound_user', JSON.stringify(demoUser))
    navigate('/app')
    setShowDropdown(false)
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim().length > 0
      case 2: return formData.email.trim().length > 0
      case 3: return formData.selectedNiches.length > 0
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 p-8 relative">
      {/* Demo Dropdown */}
      <div className="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft hover:shadow-washi transition-all"
        >
          <span>⋯</span>
          <span className="text-sm font-medium">More</span>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-washi overflow-hidden z-50">
            <button
              onClick={handleDemo}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <span>🚀</span>
              <span>Try Demo</span>
            </button>
            <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
              Explore without signing up
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i <= step
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-400'
              }`}
            >
              {i}
            </span>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">👋</span>
              <h1 className="text-2xl font-bold text-grey-900 mb-2">Hi! What's your name?</h1>
              <p className="text-gray-500">This is how you'll appear to others</p>
            </div>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-white rounded-2xl px-6 py-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-red-400"
              autoFocus
            />
            <button
              onClick={() => setStep(2)}
              disabled={!isStepValid()}
              className="btn-primary w-full disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Email */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📧</span>
              <h1 className="text-2xl font-bold text-grey-900 mb-2">What's your email?</h1>
              <p className="text-gray-500">For account recovery</p>
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-white rounded-2xl px-6 py-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-red-400"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(3)} disabled={!isStepValid()} className="btn-primary flex-1 disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Niches */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h1 className="text-2xl font-bold text-grey-900 mb-2">What interests you?</h1>
              <p className="text-gray-500">Select at least one niche</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {niches.map(niche => (
                <button
                  key={niche.id}
                  onClick={() => handleNicheToggle(niche.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.selectedNiches.includes(niche.id)
                      ? 'bg-red-100 border-2 border-red-400'
                      : 'bg-white border-2 border-transparent hover:bg-red-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{niche.icon}</span>
                  <span className="font-medium text-grey-900">{niche.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(4)} disabled={!isStepValid()} className="btn-primary flex-1 disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Social Links */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🔗</span>
              <h1 className="text-2xl font-bold text-grey-900 mb-2">Connect your socials</h1>
              <p className="text-gray-500">Optional - share your work</p>
            </div>
            <input
              type="text"
              placeholder="Instagram URL (optional)"
              value={formData.ig}
              onChange={e => setFormData(prev => ({ ...prev, ig: e.target.value }))}
              className="w-full bg-white rounded-2xl px-6 py-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="text"
              placeholder="TikTok URL (optional)"
              value={formData.tiktok}
              onChange={e => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
              className="w-full bg-white rounded-2xl px-6 py-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
              <button onClick={handleSignup} disabled={isLoading} className="btn-primary flex-1 disabled:opacity-50">
                {isLoading ? 'Creating...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Login */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-6xl mb-4 block">👋</span>
              <h1 className="text-2xl font-bold text-grey-900 mb-2">Welcome back!</h1>
              <p className="text-gray-500">Enter your email to continue</p>
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-white rounded-2xl px-6 py-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-red-400"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={() => { setStep(1) }} className="btn-secondary flex-1">Sign Up</button>
              <button onClick={handleLogin} disabled={isLoading || !isStepValid()} className="btn-primary flex-1 disabled:opacity-50">
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        )}

        {/* Login Mode Toggle */}
        {step < 5 && (
          <div className="text-center mt-8">
            <button onClick={() => { setStep(5) }} className="text-gray-500 hover:text-gray-700">
              Already have an account? <span className="text-red-500 font-medium">Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
