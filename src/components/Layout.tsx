import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  onMenuClick?: () => void
}

export default function Layout({ children, onMenuClick }: LayoutProps) {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <button 
            onClick={onMenuClick || (() => {})}
            className="p-2 rounded-full hover:bg-white transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-grey-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-grey-900 tracking-tight">SKYBOUND</span>
            <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">Academy</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold shadow-soft">
            S
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 max-w-lg mx-auto">
        {children}
      </main>
    </div>
  )
}
