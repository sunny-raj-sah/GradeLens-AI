 
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertCircle, BookOpen, GraduationCap, LoaderCircle, UserRound } from 'lucide-react'
import { getStudentDetails } from '../../services/analytics.service'
import type { StudentDetails as StudentDetailsType } from '../../services/analytics.service'

import {
  getQuizResultsByStudent,
} from '../../services/quiz.service'

import type {
  QuizResult,
} from '../../services/quiz.service'

interface StudentDetailsProps {
  studentId?: string
  embedded?: boolean
}

function formatDate(value?: string | null): string {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatScore(score?: number | null, maxScore?: number | null): string {
  if (score == null) return '—'
  if (maxScore == null) return String(score)

  return `${score} / ${maxScore}`
}

export default function StudentDetails({
  studentId: providedStudentId,
  embedded = false,
}: StudentDetailsProps) {
  const { studentId: routeStudentId } = useParams<{ studentId: string }>()
  const studentId = providedStudentId ?? routeStudentId

  const [student, setStudent] = useState<StudentDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
const [loadingQuizResults, setLoadingQuizResults] = useState(false)
const [quizResultsError, setQuizResultsError] = useState('')


  useEffect(() => {
    let cancelled = false

    async function loadStudentDetails() {
      if (!studentId) {
        setStudent(null)
        setError('Student ID is missing.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setStudent(null)

      try {
        const result = await getStudentDetails(studentId)

        if (!cancelled) {
          if (!result) {
            setError('Student details could not be found.')
          } else {
            setStudent(result)
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Unable to load student details. Please try again.'

          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadStudentDetails()

    return () => {
      cancelled = true
    }
  }, [studentId])


  // Load quiz results using the same service as the Quiz Results page.
useEffect(() => {
  let cancelled = false

  async function loadQuizResults() {
    if (!studentId) {
      setQuizResults([])
      setLoadingQuizResults(false)
      return
    }

    setLoadingQuizResults(true)
    setQuizResultsError('')

    try {
      const results = await getQuizResultsByStudent(studentId)

      if (!cancelled) {
        setQuizResults(results)
      }
    } catch (err: unknown) {
      if (!cancelled) {
        setQuizResults([])
        setQuizResultsError(
          err instanceof Error
            ? err.message
            : 'Unable to load quiz results.',
        )
      }
    } finally {
      if (!cancelled) {
        setLoadingQuizResults(false)
      }
    }
  }

  void loadQuizResults()

  return () => {
    cancelled = true
  }
}, [studentId])



  const pageClassName = embedded
    ? 'container-fluid p-3'
    : 'container-fluid px-3 px-md-4 py-4'

  if (loading) {
    return (
      <div className={`${pageClassName} text-center py-5`}>
        <LoaderCircle
          size={30}
          className="text-primary mb-3"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <p className="text-secondary mb-0">Loading student details...</p>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className={pageClassName}>
        <div className="alert alert-danger d-flex align-items-start gap-2 mb-0" role="alert">
          <AlertCircle size={20} className="flex-shrink-0 mt-1" />
          <div>
            <div className="fw-semibold">Unable to load student details</div>
            <div>{error || 'Student details are unavailable.'}</div>
          </div>
        </div>
      </div>
    )
  }

  // const classroom = student.classroom
  // const homeworkSubmissions = student.homeworkSubmissions ?? []
  // const quizResults = student.quizResults ?? []
const classroom = student.classroom
const homeworkSubmissions = student.homeworkSubmissions ?? []
  return (
    <div className={pageClassName}>
      {!embedded && (
        <div className="mb-4">
          <h2 className="h4 fw-bold mb-1">Student Details</h2>
          <p className="text-secondary mb-0">
            Student profile, classroom information, and academic records.
          </p>
        </div>
      )}

      {/* Student profile */}
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 56, height: 56 }}
            >
              <UserRound size={28} />
            </div>

            <div className="min-w-0">
              <h3 className="h5 fw-bold mb-1 text-break">{student.fullName}</h3>
              <p className="text-secondary mb-0">
                Roll number: {student.rollNumber || '—'}
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="small text-secondary mb-1">Student ID</div>
              <div className="fw-medium text-break">{student.id}</div>
            </div>

            <div className="col-12 col-md-6">
              <div className="small text-secondary mb-1">Email</div>
              <div className="fw-medium text-break">{student.email || '—'}</div>
            </div>

            <div className="col-12 col-md-6">
              <div className="small text-secondary mb-1">Date Added</div>
              <div className="fw-medium">{formatDate(student.createdAt)}</div>
            </div>

            <div className="col-12 col-md-6">
              <div className="small text-secondary mb-1">Last Updated</div>
              <div className="fw-medium">{formatDate(student.updatedAt)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Classroom information */}
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <GraduationCap size={19} className="text-primary" />
            Classroom Information
          </h3>
        </div>

        <div className="card-body p-3 p-md-4">
          {classroom ? (
            <>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <div className="small text-secondary mb-1">Classroom</div>
                  <div className="fw-semibold">{classroom.name || '—'}</div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="small text-secondary mb-1">Grade</div>
                  <div className="fw-medium">{classroom.gradeLevel || '—'}</div>
                </div>

                <div className="col-6 col-md-3">
                  <div className="small text-secondary mb-1">Section</div>
                  <div className="fw-medium">{classroom.section || '—'}</div>
                </div>

                <div className="col-12">
                  <div className="small text-secondary mb-1">Academic Year</div>
                  <div className="fw-medium">{classroom.academicYear || '—'}</div>
                </div>
              </div>

              <hr />

              <h4 className="small fw-bold mb-3">Assigned Teacher</h4>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="small text-secondary mb-1">Teacher Name</div>
                  <div className="fw-medium">{classroom.teacher?.name || '—'}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="small text-secondary mb-1">Teacher Email</div>
                  <div className="fw-medium text-break">
                    {classroom.teacher?.email || '—'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-secondary mb-0">
              No classroom information is available for this student.
            </p>
          )}
        </div>
      </section>

      {/* Homework submissions */}
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <BookOpen size={19} className="text-primary" />
            Homework Submissions
            <span className="badge bg-light text-dark border">
              {homeworkSubmissions.length}
            </span>
          </h3>
        </div>

        <div className="card-body p-0">
          {homeworkSubmissions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-3 py-3">Homework</th>
                    <th className="py-3">Score</th>
                    <th className="py-3">Submitted</th>
                    <th className="px-3 py-3">Feedback</th>
                  </tr>
                </thead>

                <tbody>
                  {homeworkSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-3 fw-medium">
                        {submission.homework?.title || 'Untitled homework'}
                      </td>
                      <td className="text-nowrap">
                        {formatScore(submission.score, submission.maxScore)}
                      </td>
                      <td className="text-nowrap">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-3 text-secondary">
                        {submission.feedback || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-secondary p-3 mb-0">
              No homework submissions are available.
            </p>
          )}
        </div>
      </section>

      {/* Quiz results */}
     
{/* Quiz results */}
<section className="card border-0 shadow-sm mb-2">
  <div className="card-header bg-white border-bottom py-3">
    <h3 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
      <BookOpen size={19} className="text-primary" />
      Quiz Results
      <span className="badge bg-light text-dark border">
        {quizResults.length}
      </span>
    </h3>
  </div>

  <div className="card-body p-0">
    {loadingQuizResults ? (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading quiz results"
        />
        <p className="text-secondary mt-3 mb-0">
          Loading quiz results...
        </p>
      </div>
    ) : quizResultsError ? (
      <div className="alert alert-danger m-3 mb-0" role="alert">
        {quizResultsError}
      </div>
    ) : quizResults.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="px-3 py-3">Quiz</th>
              <th className="py-3">Score</th>
              <th className="py-3">Percentage</th>
              <th className="py-3">Support Status</th>
              <th className="px-3 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {quizResults.map((quiz) => {
              const percentage =
                quiz.maxScore > 0
                  ? (quiz.score / quiz.maxScore) * 100
                  : 0

              return (
                <tr key={quiz.id}>
                  <td className="px-3 fw-medium">
                    {quiz.quizName || 'Untitled quiz'}
                  </td>

                  <td className="text-nowrap">
                    {quiz.score} / {quiz.maxScore}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        percentage >= 75
                          ? 'text-bg-success'
                          : percentage >= 40
                            ? 'text-bg-warning'
                            : 'text-bg-danger'
                      }`}
                    >
                      {percentage.toFixed(1)}%
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        quiz.needsSupport
                          ? 'text-bg-warning'
                          : 'text-bg-success'
                      }`}
                    >
                      {quiz.needsSupport
                        ? 'Needs support'
                        : 'No support needed'}
                    </span>
                  </td>

                  <td className="px-3 text-nowrap">
                    {formatDate(quiz.takenAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-secondary p-3 mb-0">
        No quiz results are available for this student.
      </p>
    )}
  </div>
</section>

    </div>
  )
}
