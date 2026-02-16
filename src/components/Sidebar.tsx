import { useNavigate, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onLogout: () => void
}

const menuItems = [
  { icon: '🛍️', label: 'Uniform Shop', path: '/shop' },
  { icon: '🏆', label: 'Global Rankings', path: '/rankings' },
  { icon: '👩‍🏫', label: 'Instructor Support', path: '/support' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
]

export default function Sidebar({ isOpen, onClose, user, onLogout }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!isOpen) return null

  const handleMenuClick = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-washi transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-semibold text-grey-900">{user?.name || 'Student'}</p>
                  <p className="text-sm text-gray-400">{user?.role || 'Student'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      location.pathname === item.path 
                        ? 'bg-red-50 text-red-500' 
                        : 'hover:bg-gray-50 text-grey-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
              
              {user?.role === 'admin' && (
                <li>
                  <button
                    onClick={() => handleMenuClick('/admin')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      location.pathname === '/admin' 
                        ? 'bg-red-50 text-red-500' 
                        : 'hover:bg-gray-50 text-grey-800'
                    }`}
                  >
                    <span className="text-xl">📊</span>
                    <span className="font-medium">Admin Panel</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
