
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Plus,
  RefreshCw,
  Search,
  X,
  Pencil,
  Trash2,
  Eye,
  Users,
  School,
  Mail,
  CalendarDays,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react'

import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  type Teacher,
  type CreateTeacherInput,
  type UpdateTeacherInput,
} from '../../services/teacher.service'
import { getApiError } from '../../services/getApiError'

const initialForm = {
  name: '',
  email: '',
  password: '',
}

type TeacherForm = typeof initialForm
type FormMode = 'create' | 'edit'

export default function Teachers() {
const navigate = useNavigate()

  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
    null,
  )

  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TeacherForm>(initialForm)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTeachers = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true)

    setError('')

    try {
      const data = await getTeachers()
      setTeachers(data)
    } catch (err) {
      setError(getApiError(err, 'Failed to load teachers.'))
    } finally {
      if (showLoader) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchTeachers() {
      try {
        const data = await getTeachers()

        if (!cancelled) {
          setTeachers(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiError(err, 'Failed to load teachers.'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchTeachers()

    return () => {
      cancelled = true
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  const filteredTeachers = useMemo(() => {
    if (!debouncedSearch) return teachers

    return teachers.filter((teacher) =>
      [
        teacher.name,
        teacher.email,
        teacher.id,
      ].some((value) =>
        value?.toLowerCase().includes(debouncedSearch),
      ),
    )
  }, [teachers, debouncedSearch])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function openCreateForm() {
    setFormMode('create')
    setEditingId(null)
    setForm(initialForm)
    setShowForm(true)
    setSelectedTeacher(null)
    setError('')
    setSuccess('')
  }

  function openEditForm(teacher: Teacher) {
    setFormMode('edit')
    setEditingId(teacher.id)
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: '',
    })
    setShowForm(true)
    setSelectedTeacher(null)
    setError('')
    setSuccess('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    setSubmitting(true)

    try {
      if (formMode === 'create') {
        const input: CreateTeacherInput = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }

        const created = await createTeacher(input)

        setTeachers((current) => [
          created,
          ...current.filter((teacher) => teacher.id !== created.id),
        ])

        setSuccess('Teacher created successfully.')
      } else {
        if (!editingId) {
          setError('No teacher selected for editing.')
          return
        }

        const input: UpdateTeacherInput = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
        }

        const updated = await updateTeacher(editingId, input)

        setTeachers((current) =>
          current.map((teacher) =>
            teacher.id === updated.id
              ? { ...teacher, ...updated }
              : teacher,
          ),
        )

        if (selectedTeacher?.id === updated.id) {
          setSelectedTeacher((current) =>
            current ? { ...current, ...updated } : current,
          )
        }

        setSuccess('Teacher updated successfully.')
      }

      closeForm()
    } catch (err) {
      setError(
        getApiError(
          err,
          formMode === 'create'
            ? 'Failed to create teacher.'
            : 'Failed to update teacher.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleViewDetails(teacher: Teacher) {
    setSelectedTeacher(null)
    setDetailsLoading(true)
    setError('')
    setSuccess('')

    try {
      const details = await getTeacherById(teacher.id)
      setSelectedTeacher(details)
    } catch (err) {
      setError(getApiError(err, 'Failed to load teacher details.'))
    } finally {
      setDetailsLoading(false)
    }
  }

  async function handleDelete(teacher: Teacher) {
    const confirmed = window.confirm(
      `Are you sure you want to delete teacher "${teacher.name}"?`,
    )

    if (!confirmed) return

    setError('')
    setSuccess('')
    setDeletingId(teacher.id)

    try {
      await deleteTeacher(teacher.id)

      setTeachers((current) =>
        current.filter((item) => item.id !== teacher.id),
      )

      if (selectedTeacher?.id === teacher.id) {
        setSelectedTeacher(null)
      }

      if (editingId === teacher.id) {
        closeForm()
      }

      setSuccess(`Teacher "${teacher.name}" deleted successfully.`)
    } catch (err) {
      setError(
        getApiError(
          err,
          'Failed to delete teacher. Reassign or remove assigned classrooms and proctor assignments first.',
        ),
      )
    } finally {
      setDeletingId(null)
    }
  }

  function closeDetails() {
    setSelectedTeacher(null)
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Teachers</h2>
          <p className="text-secondary mb-0">
            Manage teacher accounts and assigned classrooms.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => void loadTeachers()}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={showForm ? closeForm : openCreateForm}
          >
            {showForm ? <X size={17} /> : <Plus size={17} />}
            {showForm ? 'Cancel' : 'Add Teacher'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between gap-2" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss error"
            onClick={() => setError('')}
          />
        </div>
      )}

      {success && (
        <div className="alert alert-success d-flex justify-content-between gap-2" role="status">
          <span>{success}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss success"
            onClick={() => setSuccess('')}
          />
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-semibold mb-4">
              {formMode === 'create' ? 'Create Teacher' : 'Edit Teacher'}
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="teacher-name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="teacher-name"
                    name="name"
                    className="form-control"
                    placeholder="Enter teacher name"
                    value={form.name}
                    onChange={handleChange}
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="teacher-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="teacher-email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="teacher@example.com"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={254}
                    required
                  />
                </div>

                {formMode === 'create' && (
                  <div className="col-md-6">
                    <label htmlFor="teacher-password" className="form-label">
                      Initial Password
                    </label>
                    <input
                      id="teacher-password"
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      required
                    />
                    <div className="form-text">
                      The backend securely hashes this password before storing it.
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={closeForm}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Saving...'
                    : formMode === 'create'
                      ? 'Create Teacher'
                      : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher details */}
      {detailsLoading && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-4 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading teacher details...</span>
            </div>
            <p className="text-secondary mt-2 mb-0">
              Loading teacher details...
            </p>
          </div>
        </div>
      )}

      {selectedTeacher && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
                  <GraduationCap size={28} />
                </div>

                <div>
                  <h5 className="fw-bold mb-1">{selectedTeacher.name}</h5>
                  <p className="text-secondary mb-0">
                    {selectedTeacher.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                onClick={closeDetails}
              >
                <ArrowLeft size={16} />
                Back to Teachers
              </button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="bg-light rounded-3 p-3 h-100">
                  <div className="text-secondary small mb-1">Teacher ID</div>
                  <div className="fw-semibold text-break">
                    {selectedTeacher.id}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded-3 p-3 h-100">
                  <div className="text-secondary small mb-1">Role</div>
                  <div className="fw-semibold">{selectedTeacher.role}</div>
                </div>
              </div>

              {selectedTeacher.createdAt && (
                <div className="col-md-6">
                  <div className="bg-light rounded-3 p-3 h-100">
                    <div className="text-secondary small mb-1">
                      Account Created
                    </div>
                    <div className="fw-semibold">
                      {new Date(selectedTeacher.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {selectedTeacher.updatedAt && (
                <div className="col-md-6">
                  <div className="bg-light rounded-3 p-3 h-100">
                    <div className="text-secondary small mb-1">
                      Last Updated
                    </div>
                    <div className="fw-semibold">
                      {new Date(selectedTeacher.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <h6 className="fw-bold mb-3">
              Assigned Classrooms (
              {selectedTeacher.taughtClasses?.length ?? 0})
            </h6>

            {!selectedTeacher.taughtClasses?.length ? (
              <div className="text-secondary bg-light rounded-3 p-4 text-center">
                <School size={26} className="mb-2" />
                <p className="mb-0">No classrooms assigned to this teacher.</p>
              </div>
            ) : (
              <div className="row g-3">
              
{selectedTeacher.taughtClasses.map((classroom) => (
  <div className="col-md-6 col-xl-4" key={classroom.id}>
    <div
      className="card border shadow-sm h-100"
      role="button"
      tabIndex={0}
      aria-label={`View students in ${classroom.name}`}
      style={{ cursor: 'pointer' }}
      onClick={() =>
        navigate('/students', {
          state: { classroomId: classroom.id },
        })
      }
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate('/students', {
            state: { classroomId: classroom.id },
          })
        }
      }}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <School size={19} className="text-primary" />
          <h6 className="fw-semibold mb-0">
            {classroom.name}
          </h6>
        </div>

        <p className="text-secondary small mb-2">
          {classroom.gradeLevel}
          {classroom.section
            ? ` · Section ${classroom.section}`
            : ''}
        </p>

        <div className="text-secondary small mb-3">
          <CalendarDays size={14} className="me-2" />
          {classroom.academicYear}
        </div>

        {classroom._count && (
          <div className="d-flex flex-wrap gap-3 small text-secondary">
            <span>
              <Users size={14} className="me-1" />
              {classroom._count.students} students
            </span>
            <span>
              {classroom._count.homeworks} homework items
            </span>
          </div>
        )}

        <div className="text-primary small fw-semibold mt-3">
          View students →
        </div>
      </div>
    </div>
  </div>
))}

              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and teacher list */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="p-3 p-md-4 border-bottom">
            <div className="row align-items-center g-3">
              <div className="col-md-6">
                <h5 className="fw-semibold mb-1">Teacher Directory</h5>
                <p className="text-secondary small mb-0">
                  {teachers.length} teacher account
                  {teachers.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Search size={17} />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search name, email, or ID..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search teachers"
                  />
                  {search && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label="Clear search"
                      onClick={() => setSearch('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading teachers...</span>
              </div>
              <p className="text-secondary mt-3 mb-0">
                Loading teachers...
              </p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-5 px-3">
              <GraduationCap
                size={38}
                className="text-secondary mb-3"
              />
              <h5 className="fw-semibold">
                {teachers.length === 0
                  ? 'No teachers found'
                  : 'No matching teachers'}
              </h5>
              <p className="text-secondary mb-3">
                {teachers.length === 0
                  ? 'Create a teacher account to get started.'
                  : 'Try another name, email, or teacher ID.'}
              </p>
              {teachers.length === 0 && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openCreateForm}
                >
                  <Plus size={16} className="me-2" />
                  Add Teacher
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Teacher</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Classrooms</th>
                    <th className="py-3">Created</th>
                    <th className="py-3 text-end pe-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2">
                            <GraduationCap size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold">{teacher.name}</div>
                            <div className="text-secondary small text-break">
                              ID: {teacher.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="d-inline-flex align-items-center gap-2">
                          <Mail size={15} className="text-secondary" />
                          {teacher.email}
                        </span>
                      </td>

                      <td>
                        <span className="badge text-bg-light">
                          {teacher.taughtClasses?.length ?? 0}
                        </span>
                      </td>

                      <td>
                        {teacher.createdAt
                          ? new Date(teacher.createdAt).toLocaleDateString()
                          : '—'}
                      </td>

                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            title="View details"
                            aria-label={`View ${teacher.name}`}
                            onClick={() => void handleViewDetails(teacher)}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit teacher"
                            aria-label={`Edit ${teacher.name}`}
                            onClick={() => openEditForm(teacher)}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete teacher"
                            aria-label={`Delete ${teacher.name}`}
                            disabled={deletingId === teacher.id}
                            onClick={() => void handleDelete(teacher)}
                          >
                            {deletingId === teacher.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
