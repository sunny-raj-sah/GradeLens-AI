 
import { LogOut, Bell, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    // navigate('/login', { replace: true })
     navigate('/', { replace: true })
  }

  return (
    <header className="gl-topbar d-flex align-items-center justify-content-between px-4">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-light border gl-menu-toggle"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="gl-sidebar"
          title="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div>
          <div className="fw-semibold">Learning Overview</div>
          <div className="small text-secondary">
            Welcome back, {user?.name || 'User'}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-light border rounded-circle gl-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span className="gl-logout-label">Logout</span>
        </button>
      </div>
    </header>
  )
}
