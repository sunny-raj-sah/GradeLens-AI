
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  School,
  ClipboardCheck,
  ChartNoAxesCombined,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  BookOpen,
  FileCheck,
  BrainCircuit,
  UserRound,
  ArrowUpRight,
  CalendarDays,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import {
  getClassrooms,
  getClassroomAnalytics,
  type Classroom,
  type ClassroomAnalytics,
} from '../../services/dashboard.service'
import { getApiError } from '../../services/getApiError'

interface DashboardLink {
  title: string
  description: string
  path: string
  icon: LucideIcon
}

const dashboardLinks: DashboardLink[] = [
  {
    title: 'Classrooms',
    description: 'View and manage classrooms.',
    path: '/classrooms',
    icon: School,
  },
  {
    title: 'Students',
    description: 'Browse students and their profiles.',
    path: '/students',
    icon: Users,
  },
  {
    title: 'Homework',
    description: 'Create and manage homework.',
    path: '/homework',
    icon: BookOpen,
  },
  {
    title: 'Submissions',
    description: 'Review and grade student submissions.',
    path: '/submissions',
    icon: ClipboardCheck,
  },
  {
    title: 'Quiz Results',
    description: 'Review recorded quiz results.',
    path: '/quiz-results',
    icon: FileCheck,
  },
  {
    title: 'Teachers',
    description: 'View teacher profiles and assignments.',
    path: '/teachers',
    icon: GraduationCap,
  },
  {
    title: 'Analytics',
    description: 'Explore student performance insights.',
    path: '/analytics',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'AI Assistant',
    description: 'Ask questions about classroom data.',
    path: '/ai-assistant',
    icon: BrainCircuit,
  },
]

function formatNumber(value: unknown, decimals = 0): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }

  return value.toFixed(decimals)
}

function formatPercentage(value: unknown): string {
  const formatted = formatNumber(value, 1)
  return formatted === '—' ? formatted : `${formatted}%`
}

function getRoleLabel(role?: string): string {
  if (!role) return 'User'

  return role.charAt(0) + role.slice(1).toLowerCase()
}

export default function Dashboard() {
  const { user } = useAuth()

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroomId, setSelectedClassroomId] = useState('')
  const [analytics, setAnalytics] = useState<ClassroomAnalytics | null>(null)

  const [loadingClassrooms, setLoadingClassrooms] = useState(true)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [classroomError, setClassroomError] = useState('')
  const [analyticsError, setAnalyticsError] = useState('')

  const isStudent = user?.role === 'STUDENT'
  const isAdmin = user?.role === 'ADMIN'

  const selectedClassroom = useMemo(
    () => classrooms.find((classroom) => classroom.id === selectedClassroomId),
    [classrooms, selectedClassroomId],
  )

  const loadClassrooms = useCallback(async (showRefresh = false) => {
    setLoadingClassrooms(true)
    setClassroomError('')

    if (showRefresh) setRefreshing(true)

    try {
      const result = await getClassrooms()
      const safeClassrooms = Array.isArray(result) ? result : []

      setClassrooms(safeClassrooms)

      setSelectedClassroomId((currentId) => {
        if (safeClassrooms.some((classroom) => classroom.id === currentId)) {
          return currentId
        }

        return safeClassrooms[0]?.id ?? ''
      })
    } catch (err: unknown) {
      setClassroomError(
        getApiError(err, 'Unable to load your classrooms. Please try again.'),
      )
      setClassrooms([])
      setSelectedClassroomId('')
    } finally {
      setLoadingClassrooms(false)
      setRefreshing(false)
    }
  }, [])

  // useEffect(() => {
  //   void loadClassrooms()

  // }, [loadClassrooms])
useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadClassrooms()
  }, 0)

  return () => window.clearTimeout(timer)
}, [loadClassrooms])
  useEffect(() => {
    let active = true

    async function loadAnalytics() {
      setAnalyticsError('')

      if (isStudent || !selectedClassroomId) {
        setAnalytics(null)
        setLoadingAnalytics(false)
        return
      }

      setLoadingAnalytics(true)

      try {
        const result = await getClassroomAnalytics(selectedClassroomId)

        if (active) {
          setAnalytics(result ?? null)
        }
      } catch (err: unknown) {
        if (active) {
          setAnalytics(null)
          setAnalyticsError(
            getApiError(
              err,
              'Unable to load analytics for this classroom.',
            ),
          )
        }
      } finally {
        if (active) setLoadingAnalytics(false)
      }
    }

    void loadAnalytics()

    return () => {
      active = false
    }
  }, [selectedClassroomId, isStudent])

  const summary = analytics?.summary

  const stats = [
    {
      label: 'Total Students',
      value: formatNumber(summary?.totalStudents),
      description: 'Students in the selected classroom',
      icon: Users,
    },
    {
      label: 'Total Classrooms',
      value: loadingClassrooms ? '…' : String(classrooms.length),
      description: 'Classrooms available to your account',
      icon: School,
    },
    {
      label: 'Homework Graded',
      value: formatNumber(summary?.gradedHomeworkCount),
      description: 'Graded homework submissions',
      icon: ClipboardCheck,
    },
    {
      label: 'Average Quiz Score',
      value: formatPercentage(summary?.averageQuizPercentage),
      description: 'Average recorded quiz percentage',
      icon: ChartNoAxesCombined,
    },
  ]

  const performance = Array.isArray(analytics?.studentPerformance)
    ? analytics.studentPerformance
    : []

  const visibleLinks = dashboardLinks.filter((item) => {
    // Teacher management is intended for administrators.
    if (item.path === '/teachers' && !isAdmin) return false
    return true
  })

  return (
    <div className="container-fluid px-0">
      {/* Dashboard header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-3 bg-primary bg-opacity-10 p-2 text-primary">
              <LayoutDashboard size={22} />
            </div>

            <span className="small text-secondary">
              {getRoleLabel(user?.role)} workspace
            </span>
          </div>

          <h1 className="h3 fw-bold mb-2">Dashboard</h1>

          <p className="text-secondary mb-0">
            Welcome{user?.name ? `, ${user.name}` : ''}. Monitor classroom
            activity, manage learning workflows, and review student performance.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => void loadClassrooms(true)}
          disabled={loadingClassrooms || refreshing}
        >
          <RefreshCw
            size={17}
            className={loadingClassrooms || refreshing ? 'spin' : ''}
          />
          Refresh dashboard
        </button>
      </div>

      {/* Classroom selection */}
      {!isStudent && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row align-items-center g-3">
              <div className="col-12 col-md">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <School size={19} className="text-primary" />
                  <h2 className="h6 fw-bold mb-0">Classroom overview</h2>
                </div>

                <p className="small text-secondary mb-0">
                  Select a classroom to load its performance metrics.
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-5">
                <label
                  htmlFor="dashboard-classroom"
                  className="form-label small fw-semibold"
                >
                  Select classroom
                </label>

                <select
                  id="dashboard-classroom"
                  className="form-select"
                  value={selectedClassroomId}
                  onChange={(event) =>
                    setSelectedClassroomId(event.target.value)
                  }
                  disabled={loadingClassrooms || classrooms.length === 0}
                >
                  {classrooms.length === 0 && (
                    <option value="">No classrooms available</option>
                  )}

                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} — {classroom.gradeLevel}
                      {classroom.section ? ` ${classroom.section}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedClassroom && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                <div className="d-flex flex-wrap align-items-center gap-3 small text-secondary">
                  <span className="d-inline-flex align-items-center gap-1">
                    <GraduationCap size={15} />
                    {selectedClassroom.gradeLevel}
                    {selectedClassroom.section
                      ? ` · Section ${selectedClassroom.section}`
                      : ''}
                  </span>

                  <span className="d-inline-flex align-items-center gap-1">
                    <CalendarDays size={15} />
                    {selectedClassroom.academicYear}
                  </span>
                </div>

                <Link
                  to="/students"
                  state={{
                    classroom: selectedClassroom,
                    classroomId: selectedClassroom.id,
                  }}
                  className="btn btn-sm btn-outline-primary"
                >
                  View classroom students
                  <ArrowUpRight size={15} className="ms-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error messages */}
      {classroomError && (
        <div className="alert alert-danger d-flex align-items-start gap-2" role="alert">
          <AlertCircle size={20} className="flex-shrink-0 mt-1" />

          <div className="flex-grow-1">
            <div className="fw-semibold">Classrooms could not be loaded</div>
            <div>{classroomError}</div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => void loadClassrooms(true)}
          >
            Retry
          </button>
        </div>
      )}

      {analyticsError && (
        <div className="alert alert-warning d-flex align-items-start gap-2" role="alert">
          <AlertCircle size={20} className="flex-shrink-0 mt-1" />

          <div className="flex-grow-1">
            <div className="fw-semibold">Analytics unavailable</div>
            <div>{analyticsError}</div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              if (selectedClassroomId) {
                setSelectedClassroomId('')
                window.setTimeout(() => {
                  setSelectedClassroomId(selectedClassroomId)
                }, 0)
              }
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loadingClassrooms && (
        <div className="d-flex align-items-center gap-2 text-secondary mb-4">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Loading classrooms...
        </div>
      )}

      {!loadingClassrooms && classrooms.length === 0 && !classroomError && (
        <div className="alert alert-info d-flex align-items-start gap-2">
          <School size={20} className="flex-shrink-0 mt-1" />

          <div>
            <div className="fw-semibold">No classrooms available</div>
            <div>
              Your account has no accessible classrooms yet. Create or assign a
              classroom to start viewing performance data.
            </div>

            {!isStudent && (
              <Link to="/classrooms" className="btn btn-sm btn-primary mt-3">
                Open classrooms
                <ArrowUpRight size={15} className="ms-1" />
              </Link>
            )}
          </div>
        </div>
      )}

      {isStudent && (
        <div className="alert alert-info d-flex align-items-start gap-2">
          <GraduationCap size={20} className="flex-shrink-0 mt-1" />
          <div>
            <div className="fw-semibold">Student workspace</div>
            <div>
              Use the available modules below to access learning information.
              Classroom-wide analytics are not displayed for student accounts.
            </div>
          </div>
        </div>
      )}

      {/* Main statistics */}
      <div className="row g-3 mb-4">
        {stats.map(({ label, value, description, icon: Icon }) => (
          <div className="col-12 col-sm-6 col-xl-3" key={label}>
            <div className="gl-stat-card h-100">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="small text-secondary">{label}</div>
                <div className="gl-stat-icon">
                  <Icon size={21} />
                </div>
              </div>

              <div className="display-6 fw-bold mb-2">
                {!isStudent && loadingAnalytics && label !== 'Total Classrooms'
                  ? '…'
                  : value}
              </div>

              <div className="small text-secondary">{description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional classroom analytics */}
      {!isStudent && analytics && (
        <>
          <div className="d-flex align-items-center justify-content-between gap-2 mt-4 mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">Classroom performance</h2>
              <p className="small text-secondary mb-0">
                {selectedClassroom?.name ?? 'Selected classroom'} analytics
              </p>
            </div>

            <Link to="/analytics" className="btn btn-sm btn-outline-primary">
              Detailed analytics
              <ArrowUpRight size={15} className="ms-1" />
            </Link>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="gl-stat-card h-100">
                <div className="small text-secondary mb-2">
                  Homework Completion
                </div>

                <div className="h3 fw-bold">
                  {formatPercentage(summary?.homeworkCompletionRate)}
                </div>

                <div
                  className="progress mt-3"
                  style={{ height: 8 }}
                  aria-label="Homework completion"
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${
                        typeof summary?.homeworkCompletionRate === 'number' &&
                        Number.isFinite(summary.homeworkCompletionRate)
                          ? Math.min(
                              100,
                              Math.max(0, summary.homeworkCompletionRate),
                            )
                          : 0
                      }%`,
                    }}
                    aria-valuenow={
                      typeof summary?.homeworkCompletionRate === 'number' &&
                      Number.isFinite(summary.homeworkCompletionRate)
                        ? Math.min(
                            100,
                            Math.max(0, summary.homeworkCompletionRate),
                          )
                        : 0
                    }
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                <div className="small text-secondary mt-2">
                  Overall completion rate
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="gl-stat-card h-100">
                <div className="small text-secondary mb-2">
                  Average Homework Score
                </div>

                <div className="h3 fw-bold">
                  {formatPercentage(summary?.averageHomeworkPercentage)}
                </div>

                <div className="small text-secondary">
                  Across graded homework submissions
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="gl-stat-card h-100">
                <div className="small text-secondary mb-2">
                  Students Needing Review
                </div>

                <div className="h3 fw-bold">
                  {formatNumber(summary?.studentsNeedingSupport)}
                </div>

                <div className="small text-secondary">
                  Students flagged for teacher review
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Users size={21} className="text-primary" />
                  <h2 className="h5 fw-bold mb-0">
                    Student performance overview
                  </h2>
                </div>

                <Link
                  to="/students"
                  state={{
                    classroom: selectedClassroom,
                    classroomId: selectedClassroomId,
                  }}
                  className="btn btn-sm btn-outline-secondary"
                >
                  View students
                  <ArrowUpRight size={15} className="ms-1" />
                </Link>
              </div>

              {performance.length === 0 ? (
                <div className="text-center py-4">
                  <Users size={28} className="text-secondary mb-2" />
                  <p className="text-secondary mb-0">
                    No student performance records are available yet.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Student</th>
                        <th scope="col">Average quiz score</th>
                        <th scope="col">Review status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {performance.map((student) => (
                        <tr key={student.studentId}>
                          <td className="fw-semibold">
                         {  student.name?.trim() ||student.fullName?.trim() ||
  
    'Unnamed student'}
                          </td>

                          <td>
                            {formatPercentage(student.averageQuizPercentage)}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                student.needsSupport
                                  ? 'text-bg-warning'
                                  : 'text-bg-success'
                              }`}
                            >
                              {student.needsSupport
                                ? 'Needs support'
                                : 'No support needed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isStudent && loadingAnalytics && (
        <div className="d-flex align-items-center gap-2 text-secondary mt-3 mb-4">
          <RefreshCw size={16} className="spin" />
          Loading classroom performance...
        </div>
      )}

      {/* Navigation to existing GradeLens AI modules */}
      <section className="mt-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">GradeLens AI modules</h2>
            <p className="text-secondary small mb-0">
              Open a module to continue managing your classroom workflow.
            </p>
          </div>
        </div>

        <div className="row g-3">
          {visibleLinks.map(({ title, description, path, icon: Icon }) => (
            <div className="col-12 col-sm-6 col-xl-3" key={path}>
              <Link
                to={path}
                className="card h-100 border-0 shadow-sm text-decoration-none text-reset"
                style={{ transition: 'transform 150ms ease, box-shadow 150ms ease' }}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
                      <Icon size={23} />
                    </div>

                    <ArrowUpRight size={18} className="text-secondary" />
                  </div>

                  <h3 className="h6 fw-bold mb-2">{title}</h3>

                  <p className="small text-secondary mb-0">
                    {description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="text-secondary small mt-4 pt-3 border-top">
        <UserRound size={14} className="me-1" />
        Signed in as {getRoleLabel(user?.role)}.
        {' '}Dashboard metrics reflect the selected classroom and the data
        currently returned by the backend.
      </div>
    </div>
  )
}
