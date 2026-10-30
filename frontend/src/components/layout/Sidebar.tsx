 
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  School,
  Users,
  ClipboardList,
  ChartNoAxesCombined,
  Bot,
  GraduationCap,
  X,
  BookOpen,
  FileCheck,
 
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const studentNavigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    
  },
    {
    label: 'AI Assistant',
    path: '/ai-assistant',
    icon: Bot,
  },
]

const adminNavigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Classrooms',
    path: '/classrooms',
    icon: School,
  },
   {
    label: 'Teachers',
    path: '/teachers',
    icon: Users,
  },
  {
    label: 'Students',
    path: '/students',
    icon: Users,
  },
  {
    label: 'Homework',
    path: '/homework',
    icon: ClipboardList,
  },
  {
    label: 'Submissions',
    path: '/submissions',
    icon: FileCheck,
  },
  {
    label: 'Quiz Results',
    path: '/quiz-results',
    icon: BookOpen,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'AI Assistant',
    path: '/ai-assistant',
    icon: Bot,
  },
]

const teacherNavigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Classrooms',
    path: '/classrooms',
    icon: School,
  },
  {
    label: 'Students',
    path: '/students',
    icon: Users,
  },
  {
    label: 'Homework',
    path: '/homework',
    icon: ClipboardList,
  },
  {
    label: 'Submissions',
    path: '/submissions',
    icon: FileCheck,
  },
  {
    label: 'Quiz Results',
    path: '/quiz-results',
    icon: BookOpen,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'AI Assistant',
    path: '/ai-assistant',
    icon: Bot,
  },
]
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()

  // const isStudent = user?.role === 'STUDENT'
  // const isStaff = user?.role === 'ADMIN' || user?.role === 'TEACHER'

  // // Do not expose staff navigation to unknown or unsupported roles.
  // const visibleNavigation = isStudent
  //   ? studentNavigation
  //   : isStaff
  //     ? staffNavigation
  //     : []

  // Normalize role to handle values like "Teacher", "TEACHER", or "teacher".
const userRole = String(user?.role ?? '')
  .trim()
  .toUpperCase()

const visibleNavigation =
  userRole === 'ADMIN'
    ? adminNavigation
    : userRole === 'TEACHER'
      ? teacherNavigation
      : userRole === 'STUDENT'
        ? studentNavigation
        : []

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="gl-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={onClose}
          tabIndex={-1}
        />
      )}

      <aside
        id="gl-sidebar"
        className={`gl-sidebar d-flex flex-column ${
          isOpen ? 'gl-sidebar-open' : ''
        }`}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="d-flex align-items-center justify-content-between px-4 py-4">
          <NavLink
            to="/dashboard"
            className="d-flex align-items-center gap-2 text-decoration-none text-reset"
            onClick={onClose}
            aria-label="GradeLens Dashboard"
          >
            <div className="gl-brand-icon">
              <GraduationCap size={23} />
            </div>

            <div>
              <div className="fw-bold fs-5">GradeLens</div>
              <div className="small text-secondary">
                AI Learning Insights
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            className="btn btn-light gl-mobile-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-3 pt-3 small text-secondary text-uppercase fw-semibold">
          Workspace
        </div>

        <nav className="nav flex-column gap-1 p-3">
          {visibleNavigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `gl-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User information */}
        <div className="mt-auto p-3">
          <div className="gl-sidebar-user">
            <div className="gl-avatar" aria-hidden="true">
              {user?.name?.trim()?.charAt(0).toUpperCase() ?? 'U'}
            </div>

            <div className="overflow-hidden">
              <div className="fw-semibold text-truncate">
                {user?.name || 'User'}
              </div>

              <div className="small text-secondary">
                {user?.role || 'Loading account...'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
