 
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  School,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  GraduationCap,
  ArrowRight,
  UserRound,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom,
  type Classroom,
  type CreateClassroomInput,
  type UpdateClassroomInput,
} from '../../services/classroom.service'
import {
  getTeachers,
  type Teacher,
} from '../../services/teacher.service'
import { getApiError } from '../../services/getApiError'

const initialForm = {
  name: '',
  gradeLevel: '',
  section: '',
  academicYear: '',
  teacherId: '',
}

type ClassroomForm = typeof initialForm

export default function Classrooms() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const [loading, setLoading] = useState(true)
  const [teachersLoading, setTeachersLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState<ClassroomForm>(initialForm)

  const [teacherSearch, setTeacherSearch] = useState('')
  const [debouncedTeacherSearch, setDebouncedTeacherSearch] = useState('')
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const teacherDropdownRef = useRef<HTMLDivElement>(null)

  const canManage =
    user?.role === 'ADMIN' || user?.role === 'TEACHER'
  const isAdmin = user?.role === 'ADMIN'

  const loadClassrooms = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true)

      setError('')

      try {
        const data = await getClassrooms()
        setClassrooms(data)
      } catch (err) {
        setError(getApiError(err, 'Failed to load classrooms.'))
      } finally {
        if (showLoader) setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    let cancelled = false

    async function fetchClassrooms() {
      try {
        const data = await getClassrooms()

        if (!cancelled) {
          setClassrooms(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiError(err, 'Failed to load classrooms.'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchClassrooms()

    return () => {
      cancelled = true
    }
  }, [])

  // Load teachers for both creating and editing classrooms.
  useEffect(() => {
    if (!isAdmin || !showForm) return

    let cancelled = false

    async function fetchTeachers() {
      setTeachersLoading(true)

      try {
        const data = await getTeachers()

        if (!cancelled) {
          setTeachers(
            data.filter((teacher) => teacher.role === 'TEACHER'),
          )
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiError(err, 'Failed to load teachers.'))
        }
      } finally {
        if (!cancelled) {
          setTeachersLoading(false)
        }
      }
    }

    void fetchTeachers()

    return () => {
      cancelled = true
    }
  }, [isAdmin, showForm])

  // Debounce teacher search.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedTeacherSearch(teacherSearch.trim().toLowerCase())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [teacherSearch])

  const filteredTeachers = useMemo(() => {
    if (!debouncedTeacherSearch) return teachers

    return teachers.filter((teacher) =>
      [teacher.name, teacher.email, teacher.id].some((value) =>
        value?.toLowerCase().includes(debouncedTeacherSearch),
      ),
    )
  }, [teachers, debouncedTeacherSearch])

  const selectedTeacher = useMemo(
    () => teachers.find((teacher) => teacher.id === form.teacherId),
    [teachers, form.teacherId],
  )

  // Close the teacher dropdown when clicking outside it.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        teacherDropdownRef.current &&
        !teacherDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTeacherDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function openCreateForm() {
    setEditingId(null)
    setForm(initialForm)
    setTeacherSearch('')
    setDebouncedTeacherSearch('')
    setShowTeacherDropdown(false)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  function openEditForm(classroom: Classroom) {
    setEditingId(classroom.id)
    setForm({
      name: classroom.name,
      gradeLevel: classroom.gradeLevel,
      section: classroom.section ?? '',
      academicYear: classroom.academicYear,
      teacherId: classroom.teacherId ?? '',
    })
    setTeacherSearch('')
    setDebouncedTeacherSearch('')
    setShowTeacherDropdown(false)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
    setTeacherSearch('')
    setDebouncedTeacherSearch('')
    setShowTeacherDropdown(false)
  }

  function selectTeacher(teacher: Teacher) {
    setForm((current) => ({
      ...current,
      teacherId: teacher.id,
    }))

    setTeacherSearch('')
    setDebouncedTeacherSearch('')
    setShowTeacherDropdown(false)
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (isAdmin && !form.teacherId) {
      setError('Please select an assigned teacher.')
      return
    }

    if (isAdmin && teachersLoading) {
      setError('Please wait until the teacher list finishes loading.')
      return
    }

    setSubmitting(true)

    try {
      if (editingId) {
        const input: UpdateClassroomInput = {
          name: form.name.trim(),
          gradeLevel: form.gradeLevel.trim(),
          section: form.section.trim() || null,
          academicYear: form.academicYear.trim(),
          ...(isAdmin ? { teacherId: form.teacherId } : {}),
        }

        const updated = await updateClassroom(editingId, input)

        setClassrooms((current) =>
          current.map((item) =>
            item.id === editingId ? updated : item,
          ),
        )

        setSuccess('Classroom updated successfully.')
      } else {
        const input: CreateClassroomInput = {
          name: form.name.trim(),
          gradeLevel: form.gradeLevel.trim(),
          section: form.section.trim(),
          academicYear: form.academicYear.trim(),
          ...(isAdmin ? { teacherId: form.teacherId } : {}),
        }

        const created = await createClassroom(input)

        setClassrooms((current) => [
          created,
          ...current.filter((item) => item.id !== created.id),
        ])

        setSuccess('Classroom created successfully.')
      }

      closeForm()
    } catch (err) {
      setError(
        getApiError(
          err,
          editingId
            ? 'Failed to update classroom.'
            : 'Failed to create classroom.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(classroom: Classroom) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${classroom.name}"?`,
    )

    if (!confirmed) return

    setError('')
    setSuccess('')
    setDeletingId(classroom.id)

    try {
      await deleteClassroom(classroom.id)

      setClassrooms((current) =>
        current.filter((item) => item.id !== classroom.id),
      )

      if (editingId === classroom.id) {
        closeForm()
      }

      setSuccess(`"${classroom.name}" was deleted successfully.`)
    } catch (err) {
      setError(
        getApiError(
          err,
          'Failed to delete classroom. Classrooms containing students or homework may not be deletable.',
        ),
      )
    } finally {
      setDeletingId(null)
    }
  }

  function openStudents(classroom: Classroom) {
    navigate('/students', {
      state: {
        classroom,
        classroomId: classroom.id,
      },
    })
  }

  function handleCardKeyDown(
    event: KeyboardEvent<HTMLElement>,
    classroom: Classroom,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openStudents(classroom)
    }
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Classrooms</h2>
          <p className="text-secondary mb-0">
            Manage classrooms and open a classroom to view its students.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => void loadClassrooms()}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? 'spin' : ''}
            />
            Refresh
          </button>

          {canManage && (
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={showForm ? closeForm : openCreateForm}
            >
              {showForm ? <X size={17} /> : <Plus size={17} />}
              {showForm ? 'Cancel' : 'Add Classroom'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-start gap-2"
          role="alert"
        >
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
        <div
          className="alert alert-success d-flex justify-content-between align-items-start gap-2"
          role="status"
        >
          <span>{success}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss success message"
            onClick={() => setSuccess('')}
          />
        </div>
      )}

      {showForm && canManage && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="rounded-3 bg-primary bg-opacity-10 p-2 text-primary">
                {editingId ? <Pencil size={20} /> : <Plus size={20} />}
              </div>

              <div>
                <h5 className="fw-semibold mb-1">
                  {editingId ? 'Edit Classroom' : 'Create a Classroom'}
                </h5>
                <p className="text-secondary small mb-0">
                  {editingId
                    ? 'Update classroom information and its assigned teacher.'
                    : 'Enter the details for your new classroom.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="classroom-name" className="form-label">
                    Classroom Name
                  </label>
                  <input
                    id="classroom-name"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Mathematics"
                    value={form.name}
                    onChange={handleChange}
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="grade-level" className="form-label">
                    Grade Level
                  </label>
                  <input
                    id="grade-level"
                    name="gradeLevel"
                    className="form-control"
                    placeholder="e.g. Grade 10"
                    value={form.gradeLevel}
                    onChange={handleChange}
                    maxLength={30}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="classroom-section" className="form-label">
                    Section (Optional)
                  </label>
                  <input
                    id="classroom-section"
                    name="section"
                    className="form-control"
                    placeholder="e.g. A"
                    value={form.section}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="academic-year" className="form-label">
                    Academic Year
                  </label>
                  <input
                    id="academic-year"
                    name="academicYear"
                    className="form-control"
                    placeholder="e.g. 2026-2027"
                    value={form.academicYear}
                    onChange={handleChange}
                    minLength={4}
                    maxLength={20}
                    required
                  />
                </div>

                {/* Admin can assign or reassign a teacher. */}
                {isAdmin && (
                  <div className="col-12">
                    <label htmlFor="teacher-search" className="form-label">
                      Assigned Teacher <span className="text-danger">*</span>
                    </label>

                    <div
                      className="position-relative"
                      ref={teacherDropdownRef}
                    >
                      <div className="input-group">
                        <span className="input-group-text">
                          <UserRound size={17} />
                        </span>

                        <input
                          id="teacher-search"
                          type="text"
                          className="form-control"
                          placeholder={
                            editingId
                              ? 'Search to change the assigned teacher...'
                              : 'Search by teacher name, email, or ID...'
                          }
                          value={
                            showTeacherDropdown
                              ? teacherSearch
                              : selectedTeacher
                                ? `${selectedTeacher.name} (${selectedTeacher.email})`
                                : ''
                          }
                          autoComplete="off"
                          role="combobox"
                          aria-expanded={showTeacherDropdown}
                          aria-controls="teacher-options"
                          aria-autocomplete="list"
                          onFocus={() => {
                            setTeacherSearch('')
                            setDebouncedTeacherSearch('')
                            setShowTeacherDropdown(true)
                          }}
                          onChange={(event) => {
                            setTeacherSearch(event.target.value)
                            setShowTeacherDropdown(true)

                            setForm((current) => ({
                              ...current,
                              teacherId: '',
                            }))
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                              setShowTeacherDropdown(false)
                            }
                          }}
                          required={!form.teacherId}
                        />

                        {form.teacherId && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            aria-label="Clear selected teacher"
                            title="Clear selected teacher"
                            onClick={() => {
                              setForm((current) => ({
                                ...current,
                                teacherId: '',
                              }))
                              setTeacherSearch('')
                              setDebouncedTeacherSearch('')
                              setShowTeacherDropdown(true)
                            }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      {showTeacherDropdown && (
                        <div
                          id="teacher-options"
                          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-3 shadow"
                          style={{
                            zIndex: 1050,
                            maxHeight: '260px',
                            overflowY: 'auto',
                          }}
                          role="listbox"
                          aria-label="Available teachers"
                        >
                          {teachersLoading ? (
                            <div className="d-flex align-items-center gap-2 p-3 text-secondary small">
                              <span
                                className="spinner-border spinner-border-sm"
                                aria-hidden="true"
                              />
                              Loading teachers...
                            </div>
                          ) : filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher) => (
                              <button
                                key={teacher.id}
                                type="button"
                                role="option"
                                aria-selected={form.teacherId === teacher.id}
                                className={`dropdown-item text-start p-3 border-bottom ${
                                  form.teacherId === teacher.id
                                    ? 'active'
                                    : ''
                                }`}
                                onClick={() => selectTeacher(teacher)}
                              >
                                <div className="fw-semibold">
                                  {teacher.name}
                                </div>
                                <div className="small opacity-75">
                                  {teacher.email}
                                </div>
                                <div className="small opacity-75 text-break">
                                  ID: {teacher.id}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-secondary small">
                              {teachers.length === 0
                                ? 'No teachers available.'
                                : 'No teachers match your search.'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="form-text">
                      {selectedTeacher
                        ? `Selected teacher: ${selectedTeacher.name} (${selectedTeacher.email})`
                        : editingId && form.teacherId
                          ? 'The current teacher is assigned. Open the search to choose another teacher.'
                          : 'Search and select a teacher. Results update after you stop typing.'}
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
                  className="btn btn-primary d-flex align-items-center gap-2"
                  disabled={submitting || (isAdmin && teachersLoading)}
                >
                  {submitting && (
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    />
                  )}

                  {submitting
                    ? 'Saving...'
                    : editingId
                      ? 'Save Changes'
                      : 'Create Classroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading classrooms...</span>
            </div>
            <p className="text-secondary mt-3 mb-0">
              Loading classrooms...
            </p>
          </div>
        </div>
      ) : classrooms.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 px-3">
            <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3 text-primary">
              <School size={32} />
            </div>

            <h5 className="fw-semibold">No classrooms found</h5>
            <p className="text-secondary mb-3">
              {canManage
                ? 'Create your first classroom to get started.'
                : 'No classrooms are currently available for your account.'}
            </p>

            {canManage && (
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={openCreateForm}
              >
                <Plus size={17} />
                Add Classroom
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-secondary small">
              {classrooms.length} classroom
              {classrooms.length === 1 ? '' : 's'}
            </span>
            <span className="text-secondary small">
              Select a card to view students
            </span>
          </div>

          <div className="row g-4">
            {classrooms.map((classroom) => (
              <div className="col-12 col-md-6 col-xl-4" key={classroom.id}>
                <article
                  className="card classroom-card h-100 border-0 shadow-sm"
                  role="link"
                  tabIndex={0}
                  aria-label={`Open students in ${classroom.name}`}
                  onClick={() => openStudents(classroom)}
                  onKeyDown={(event) =>
                    handleCardKeyDown(event, classroom)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                      <div className="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
                        <School size={26} />
                      </div>

                      {canManage && (
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            aria-label={`Edit ${classroom.name}`}
                            title="Edit classroom"
                            onClick={(event) => {
                              event.stopPropagation()
                              openEditForm(classroom)
                            }}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            aria-label={`Delete ${classroom.name}`}
                            title="Delete classroom"
                            disabled={deletingId === classroom.id}
                            onClick={(event) => {
                              event.stopPropagation()
                              void handleDelete(classroom)
                            }}
                          >
                            {deletingId === classroom.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <h5 className="fw-bold mb-2">{classroom.name}</h5>

                    <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                      <GraduationCap size={16} />
                      <span>{classroom.gradeLevel}</span>

                      {classroom.section && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Section {classroom.section}</span>
                        </>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <CalendarDays size={16} />
                      <span>{classroom.academicYear}</span>
                    </div>

                    <hr className="my-4" />

                    <div className="d-flex align-items-center justify-content-between">
                      <span className="d-inline-flex align-items-center gap-2 text-primary fw-semibold small">
                        <Users size={16} />
                        View Students
                      </span>
                      <ArrowRight size={18} className="text-primary" />
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
