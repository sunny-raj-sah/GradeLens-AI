 
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  ClipboardList,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

import { getClassrooms } from '../../services/classroom.service'
import type { Classroom } from '../../services/classroom.service'
import { getStudentsByClassroom } from '../../services/student.service'
import type { Student } from '../../services/student.service'
import { getHomeworkByClassroom } from '../../services/homework.service'
import type { Homework } from '../../services/homework.service'
import {
  createSubmission,
  getSubmissionsByHomework,
  updateSubmission,
  deleteSubmission,
} from '../../services/submission.service'
import type { Submission } from '../../services/submission.service'
import { getApiError } from '../../services/getApiError'
import { useAuth } from '../../context/AuthContext'

const SEARCH_DEBOUNCE_MS = 300

export default function Submissions() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

const initialClassroomId = searchParams.get('classroomId') ?? ''
const initialHomeworkId = searchParams.get('homeworkId') ?? ''

  const studentSearchRef = useRef<HTMLDivElement>(null)

  const canManage =
    user?.role === 'ADMIN' || user?.role === 'TEACHER'

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [homeworkItems, setHomeworkItems] = useState<Homework[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])

 const [classroomId, setClassroomId] = useState(initialClassroomId)
const [homeworkId, setHomeworkId] = useState(initialHomeworkId)
  const [studentId, setStudentId] = useState('')
  const [studentSearch, setStudentSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showStudentOptions, setShowStudentOptions] = useState(false)

  const [score, setScore] = useState('')
  const [maxScore, setMaxScore] = useState('100')
  const [feedback, setFeedback] = useState('')
  const [editingSubmission, setEditingSubmission] =
    useState<Submission | null>(null)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingSubmissionId, setDeletingSubmissionId] =
    useState<string | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Debounce student search input.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(studentSearch.trim().toLowerCase())
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [studentSearch])

  // Close the student suggestions when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        studentSearchRef.current &&
        !studentSearchRef.current.contains(event.target as Node)
      ) {
        setShowStudentOptions(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  // Load classrooms.
  // useEffect(() => {
  //   let cancelled = false

  //   async function loadClassrooms() {
  //     try {
  //       const result = await getClassrooms()

  //       if (cancelled) return

  //       setClassrooms(result)
  //       setClassroomId((current) =>
  //         current && result.some((item) => item.id === current)
  //           ? current
  //           : result[0]?.id ?? '',
  //       )
  //     } catch (err) {
  //       if (!cancelled) {
  //         setError(getApiError(err, 'Failed to load classrooms.'))
  //       }
  //     }
  //   }

  //   void loadClassrooms()

  //   return () => {
  //     cancelled = true
  //   }
  // }, [])

  // Load classrooms and select the classroom passed in the URL.
useEffect(() => {
  let cancelled = false

  async function loadClassrooms() {
    try {
      const result = await getClassrooms()

      if (cancelled) return

      setClassrooms(result)

      const requestedClassroomExists =
        initialClassroomId &&
        result.some((item) => item.id === initialClassroomId)

      setClassroomId((current) => {
        if (current && result.some((item) => item.id === current)) {
          return current
        }

        return requestedClassroomExists
          ? initialClassroomId
          : result[0]?.id ?? ''
      })
    } catch (err) {
      if (!cancelled) {
        setError(getApiError(err, 'Failed to load classrooms.'))
      }
    }
  }

  void loadClassrooms()

  return () => {
    cancelled = true
  }
}, [initialClassroomId])

  // Load students and homework whenever the classroom changes.
  useEffect(() => {
    let cancelled = false

    async function loadClassroomData() {
      setStudents([])
      setHomeworkItems([])
      setSubmissions([])
      setHomeworkId('')
      setStudentId('')
      setStudentSearch('')
      setDebouncedSearch('')
      setScore('')
      setMaxScore('100')
      setFeedback('')
      setEditingSubmission(null)
      setShowStudentOptions(false)

      if (!classroomId) return

      try {
        const [studentResult, homeworkResult] = await Promise.all([
          getStudentsByClassroom(classroomId),
          getHomeworkByClassroom(classroomId),
        ])

        if (cancelled) return

        // setStudents(studentResult)
        // setHomeworkItems(homeworkResult)
setStudents(studentResult)
setHomeworkItems(homeworkResult)

setHomeworkId((current) => {
  // Preserve the homework passed in the URL when it belongs
  // to the selected classroom.
  if (
    current &&
    homeworkResult.some((item) => item.id === current)
  ) {
    return current
  }

  // If the requested homework is available in this classroom,
  // select it automatically.
  if (
    initialHomeworkId &&
    homeworkResult.some((item) => item.id === initialHomeworkId)
  ) {
    return initialHomeworkId
  }

  // Otherwise, require the user to select homework manually.
  return ''
})

      } catch (err) {
        if (!cancelled) {
          setError(
            getApiError(err, 'Failed to load classroom data.'),
          )
        }
      }
    }

    void loadClassroomData()

    return () => {
      cancelled = true
    }
  }, [classroomId, initialHomeworkId])

  // Load submissions whenever the selected homework changes.
  useEffect(() => {
    let cancelled = false

    async function loadSubmissions() {
      setSubmissions([])

      if (!homeworkId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const result = await getSubmissionsByHomework(homeworkId)

        if (!cancelled) {
          setSubmissions(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiError(err, 'Failed to load submissions.'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadSubmissions()

    return () => {
      cancelled = true
    }
  }, [homeworkId])

  const filteredStudents = students.filter((student) => {
    if (!debouncedSearch) return true

    return (
      student.fullName.toLowerCase().includes(debouncedSearch) ||
      student.rollNumber.toLowerCase().includes(debouncedSearch) ||
      student.id.toLowerCase().includes(debouncedSearch)
    )
  })

  const selectedStudent = students.find(
    (student) => student.id === studentId,
  )

  function resetForm() {
    setStudentId('')
    setStudentSearch('')
    setDebouncedSearch('')
    setScore('')
    setMaxScore('100')
    setFeedback('')
    setEditingSubmission(null)
    setShowStudentOptions(false)
  }

  // Refresh submissions for the currently selected homework.
  async function refreshSubmissions() {
    if (!homeworkId) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await getSubmissionsByHomework(homeworkId)
      setSubmissions(result)
    } catch (err) {
      setError(
        getApiError(err, 'Failed to refresh submissions.'),
      )
    } finally {
      setLoading(false)
    }
  }

  // Create a submission or update an existing submission.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canManage) {
      setError('You do not have permission to manage submissions.')
      return
    }

    if (!homeworkId) {
      setError('Please select homework.')
      return
    }

    // A student is required when creating a submission.
    // Updating an existing submission does not change its student.
    if (!editingSubmission && !studentId) {
      setError('Please select a student from the suggestions.')
      return
    }

    if (editingSubmission && !editingSubmission.id) {
      setError('Cannot update this submission because its ID is missing.')
      return
    }

    const parsedScore = Number(score)
    const parsedMaxScore = Number(maxScore)

    if (
      score.trim() === '' ||
      !Number.isFinite(parsedScore) ||
      parsedScore < 0
    ) {
      setError('Please enter a valid score greater than or equal to 0.')
      return
    }

    if (
      maxScore.trim() === '' ||
      !Number.isFinite(parsedMaxScore) ||
      parsedMaxScore <= 0
    ) {
      setError('Maximum score must be greater than 0.')
      return
    }

    if (parsedScore > parsedMaxScore) {
      setError('Score cannot exceed the maximum score.')
      return
    }

    const wasEditing = Boolean(editingSubmission)
    const selectedHomeworkId = homeworkId

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingSubmission?.id) {
        await updateSubmission(editingSubmission.id, {
          score: parsedScore,
          maxScore: parsedMaxScore,
          feedback: feedback.trim(),
        })
      } else {
        await createSubmission({
          homeworkId: selectedHomeworkId,
          studentId,
          score: parsedScore,
          maxScore: parsedMaxScore,
          feedback: feedback.trim(),
        })
      }

      resetForm()

      setSuccess(
        wasEditing
          ? 'Submission updated successfully.'
          : 'Submission recorded successfully.',
      )

      // Reload the list after a successful create or update.
      try {
        const result =
          await getSubmissionsByHomework(selectedHomeworkId)

        setSubmissions(result)
      } catch (refreshError) {
        setError(
          getApiError(
            refreshError,
            wasEditing
              ? 'Submission updated, but the list could not be refreshed. Use Refresh to try again.'
              : 'Submission recorded, but the list could not be refreshed. Use Refresh to try again.',
          ),
        )
      }
    } catch (err) {
      setError(
        getApiError(
          err,
          wasEditing
            ? 'Failed to update submission.'
            : 'Failed to record submission.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  // Populate the form with the selected submission.
  function startEditing(item: Submission) {
    if (!item.id) {
      setError('Cannot edit this submission because its ID is missing.')
      return
    }

    const recordStudentId =
      item.studentId ?? item.student?.id ?? ''

    setEditingSubmission(item)
    setStudentId(recordStudentId)

    const student = students.find(
      (entry) => entry.id === recordStudentId,
    )

    const studentName =
      item.student?.fullName ?? student?.fullName ?? ''

    const studentRoll =
      item.student?.rollNumber ?? student?.rollNumber ?? ''

    setStudentSearch(
      studentName
        ? `${studentName}${studentRoll ? ` (${studentRoll})` : ''}`
        : recordStudentId,
    )

    setScore(item.score == null ? '' : String(item.score))
    setMaxScore(item.maxScore == null ? '100' : String(item.maxScore))
    setFeedback(item.feedback ?? '')

    setError('')
    setSuccess('')
    setShowStudentOptions(false)

    document.getElementById('submission-score')?.focus()
  }

  // Delete a submission after user confirmation.
  async function handleDeleteClick(item: Submission) {
    if (!canManage) {
      setError('You do not have permission to delete submissions.')
      return
    }

    if (!item.id) {
      setError('Cannot delete this submission because its ID is missing.')
      return
    }

    if (deletingSubmissionId) return

    const recordStudentId =
      item.studentId ?? item.student?.id ?? ''

    const studentName =
      item.student?.fullName ??
      students.find((student) => student.id === recordStudentId)
        ?.fullName ??
      'this student'

    const confirmed = window.confirm(
      `Delete the submission for ${studentName}? This action cannot be undone.`,
    )

    if (!confirmed) return

    const deletedId = item.id
    const selectedHomeworkId = homeworkId

    setDeletingSubmissionId(deletedId)
    setError('')
    setSuccess('')

    try {
      await deleteSubmission(deletedId)

      setSubmissions((current) =>
        current.filter((submission) => submission.id !== deletedId),
      )

      if (editingSubmission?.id === deletedId) {
        resetForm()
      }

      setSuccess('Submission deleted successfully.')

      // Re-fetch to keep the table consistent with the backend.
      if (selectedHomeworkId) {
        try {
          const result =
            await getSubmissionsByHomework(selectedHomeworkId)

          setSubmissions(result)
        } catch {
          // The deleted row has already been removed locally.
          // The Refresh button can retry loading the latest records.
        }
      }
    } catch (err) {
      setError(getApiError(err, 'Failed to delete submission.'))
    } finally {
      setDeletingSubmissionId(null)
    }
  }

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Submissions</h2>
          <p className="text-secondary mb-0">
            Record scores and review homework submissions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={!homeworkId || loading}
          onClick={() => void refreshSubmissions()}
        >
          <RefreshCw size={16} className="me-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      {/* Classroom and homework selection */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label
                htmlFor="submission-classroom"
                className="form-label"
              >
                Classroom
              </label>

              <select
                id="submission-classroom"
                className="form-select"
                value={classroomId}
                onChange={(event) => {
                  setClassroomId(event.target.value)
                  setError('')
                  setSuccess('')
                }}
              >
                <option value="">Select classroom</option>

                {classrooms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — Grade {item.gradeLevel}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label
                htmlFor="submission-homework"
                className="form-label"
              >
                Homework
              </label>

              <select
                id="submission-homework"
                className="form-select"
                value={homeworkId}
                onChange={(event) => {
                  setHomeworkId(event.target.value)
                  resetForm()
                  setError('')
                  setSuccess('')
                }}
                disabled={!classroomId}
              >
                <option value="">Select homework</option>

                {homeworkItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Create and edit submission form */}
      {canManage && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">
              {editingSubmission
                ? 'Edit Submission'
                : 'Record a Submission'}
            </h5>

            {editingSubmission && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  resetForm()
                  setError('')
                  setSuccess('')
                }}
              >
                <X size={15} className="me-1" />
                Cancel edit
              </button>
            )}
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div
                  className="col-12 col-md-6 position-relative"
                  ref={studentSearchRef}
                >
                  <label
                    htmlFor="submission-student"
                    className="form-label"
                  >
                    Search student
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={16} />
                    </span>

                    <input
                      id="submission-student"
                      className="form-control"
                      type="text"
                      value={studentSearch}
                      placeholder="Search by name, roll number or ID..."
                      autoComplete="off"
                      disabled={Boolean(editingSubmission)}
                      onFocus={() => setShowStudentOptions(true)}
                      onChange={(event) => {
                        setStudentSearch(event.target.value)
                        setStudentId('')
                        setShowStudentOptions(true)
                        setError('')
                        setSuccess('')
                      }}
                      required={!editingSubmission}
                    />
                  </div>

                  {showStudentOptions &&
                    !selectedStudent &&
                    !editingSubmission && (
                      <div
                        className="list-group position-absolute start-0 end-0 shadow"
                        style={{
                          zIndex: 20,
                          maxHeight: '240px',
                          overflowY: 'auto',
                          marginTop: '4px',
                        }}
                      >
                        {!classroomId ? (
                          <div className="list-group-item text-secondary">
                            Select a classroom first.
                          </div>
                        ) : !studentSearch.trim() ? (
                          <div className="list-group-item text-secondary">
                            Start typing to search students.
                          </div>
                        ) : filteredStudents.length === 0 ? (
                          <div className="list-group-item text-secondary">
                            No matching students found.
                          </div>
                        ) : (
                          filteredStudents.slice(0, 10).map((student) => (
                            <button
                              key={student.id}
                              type="button"
                              className="list-group-item list-group-item-action text-start"
                              onClick={() => {
                                setStudentId(student.id)
                                setStudentSearch(
                                  `${student.fullName} (${student.rollNumber})`,
                                )
                                setShowStudentOptions(false)
                                setError('')
                                setSuccess('')
                              }}
                            >
                              <div className="fw-semibold">
                                {student.fullName}
                              </div>

                              <small className="text-secondary d-block">
                                Roll: {student.rollNumber}
                              </small>

                              <small className="text-secondary text-break">
                                ID: {student.id}
                              </small>
                            </button>
                          ))
                        )}
                      </div>
                    )}

                  {selectedStudent && (
                    <div className="form-text text-success">
                      Selected: {selectedStudent.fullName} · Roll{' '}
                      {selectedStudent.rollNumber}

                      {!editingSubmission && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 ms-2"
                          onClick={() => {
                            setStudentId('')
                            setStudentSearch('')
                            setShowStudentOptions(true)
                          }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  )}

                  {editingSubmission && (
                    <div className="form-text">
                      The student cannot be changed while editing a submission.
                    </div>
                  )}
                </div>

                <div className="col-6 col-md-3">
                  <label
                    htmlFor="submission-score"
                    className="form-label"
                  >
                    Score
                  </label>

                  <input
                    id="submission-score"
                    className="form-control"
                    type="number"
                    min="0"
                    step="any"
                    value={score}
                    onChange={(event) => setScore(event.target.value)}
                    required
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label
                    htmlFor="submission-max-score"
                    className="form-label"
                  >
                    Maximum score
                  </label>

                  <input
                    id="submission-max-score"
                    className="form-control"
                    type="number"
                    min="0.01"
                    step="any"
                    value={maxScore}
                    onChange={(event) => setMaxScore(event.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label
                    htmlFor="submission-feedback"
                    className="form-label"
                  >
                    Feedback
                  </label>

                  <textarea
                    id="submission-feedback"
                    className="form-control"
                    rows={2}
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    placeholder="Optional feedback for the student"
                  />
                </div>

                <div className="col-12 text-end">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={
                      saving ||
                      !homeworkId ||
                      (!editingSubmission && !studentId) ||
                      Boolean(deletingSubmissionId)
                    }
                  >
                    {saving
                      ? 'Saving...'
                      : editingSubmission
                        ? 'Update Submission'
                        : 'Record Submission'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission records table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">Submission Records</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
                aria-label="Loading submissions"
              />

              <p className="text-secondary mt-3 mb-0">
                Loading submissions...
              </p>
            </div>
          ) : !homeworkId ? (
            <div className="text-center py-5">
              <ClipboardList
                size={34}
                className="text-secondary mb-3"
              />

              <p className="text-secondary mb-0">
                Select homework to view its submissions.
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-5">
              <ClipboardList
                size={34}
                className="text-secondary mb-3"
              />

              <p className="text-secondary mb-0">
                No submissions found for this homework.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Student</th>
                    <th>Student ID</th>
                    <th>Score</th>
                    <th>Feedback</th>
                    <th>Submitted</th>
                    {canManage && (
                      <th className="text-end pe-3">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((item, index) => {
                    const recordStudentId =
                      item.studentId ?? item.student?.id ?? ''

                    const student = students.find(
                      (entry) => entry.id === recordStudentId,
                    )

                    const studentName =
                      item.student?.fullName ??
                      student?.fullName ??
                      'Unknown student'

                    const studentRoll =
                      item.student?.rollNumber ??
                      student?.rollNumber ??
                      '—'

                    return (
                      <tr
                        key={
                          item.id ??
                          `${recordStudentId || 'unknown'}-${index}`
                        }
                      >
                        <td className="ps-3">
                          <div className="fw-semibold">
                            {studentName}
                          </div>

                          <small className="text-secondary">
                            Roll: {studentRoll}
                          </small>
                        </td>

                        <td className="text-break">
                          {recordStudentId || '—'}
                        </td>

                        <td>
                          {item.score ?? '—'} / {item.maxScore ?? '—'}
                        </td>

                        <td>{item.feedback || '—'}</td>

                        <td>
                          {item.submittedAt &&
                          !Number.isNaN(Date.parse(item.submittedAt))
                            ? new Date(
                                item.submittedAt,
                              ).toLocaleDateString()
                            : '—'}
                        </td>

                        {canManage && (
                          <td className="text-end pe-3">
                            <div className="d-inline-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                title="Edit submission"
                                aria-label="Edit submission"
                                disabled={
                                  !item.id ||
                                  Boolean(deletingSubmissionId)
                                }
                                onClick={() => startEditing(item)}
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                title="Delete submission"
                                aria-label="Delete submission"
                                disabled={
                                  !item.id ||
                                  Boolean(deletingSubmissionId) ||
                                  saving
                                }
                                onClick={() =>
                                  void handleDeleteClick(item)
                                }
                              >
                                {deletingSubmissionId === item.id ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-label="Deleting submission"
                                  />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
