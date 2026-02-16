import { useEffect, useRef } from 'react'

interface AdBannerProps {
  type: 'social-bar' | 'native'
  placementId?: string
}

export default function AdBanner({ type, placementId: _placementId }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Adsterra Social Bar (Top placement)
    if (type === 'social-bar' && containerRef.current) {
      // Script is already in index.html for social bar
      // This container can be used for additional social bar instances
    }

    // Adsterra Native Banner
    if (type === 'native' && containerRef.current) {
      // Initialize native banner script
      const script = document.createElement('script')
      script.src = '//pl23149520.profitabletrustednetwork.com/09/01/2024/npf.php?p=23149520&p2=PL&p3=desktop'
      script.async = true
      containerRef.current.appendChild(script)
    }
  }, [type])

  if (type === 'social-bar') {
    return (
      <div className="w-full bg-cream-100 rounded-xl p-3 mb-4">
        <p className="text-xs text-center text-gray-400 mb-2">Advertisement</p>
        {/* Social Bar Ad Container */}
        <div 
          ref={containerRef}
          className="min-h-[100px] flex items-center justify-center bg-gradient-to-br from-red-50 to-cream-100 rounded-lg"
        >
          {/* Placeholder for Adsterra Social Bar */}
          <div className="text-center p-4">
            <div className="flex justify-center gap-3 mb-2">
              <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">👍</span>
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">💬</span>
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🔗</span>
            </div>
            <p className="text-sm text-gray-400">Social Bar Ad</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <p className="text-xs text-center text-gray-400 mb-2">Advertisement</p>
      {/* Native Banner Ad Container */}
      <div 
        ref={containerRef}
        className="min-h-[250px] flex items-center justify-center bg-gradient-to-br from-cream-100 to-gray-100 rounded-xl"
      >
        {/* Placeholder for Adsterra Native Banner */}
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-2xl">📢</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Sponsored</h4>
          <p className="text-sm text-gray-400 max-w-[200px]">
            Native Banner Advertisement from Adsterra
          </p>
          <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

// Popunder ad trigger utility
export function triggerPopunder() {
  // Adsterra Popunder script
  const script = document.createElement('script')
  script.src = '//pl23149520.profitabletrustednetwork.com/popunder.php?p=23149520'
  script.async = true
  document.body.appendChild(script)
}

// Billboard Ad Component
export function BillboardAd() {
  return (
    <div className="w-full bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white text-center">
      <p className="text-xs opacity-80 mb-2">Advertisement</p>
      <h3 className="text-xl font-bold mb-2">SKYBOUND Premium</h3>
      <p className="text-sm opacity-90 mb-4">Unlock all courses and get verified badges</p>
      <button className="px-8 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 transition-colors">
        Upgrade Now
      </button>
    </div>
  )
}
