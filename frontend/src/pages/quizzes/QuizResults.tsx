

import { useEffect, useState, type FormEvent } from "react";
import {
  ClipboardCheck,
  RefreshCw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { getClassrooms } from "../../services/classroom.service";
import type { Classroom } from "../../services/classroom.service";
import { getStudentsByClassroom } from "../../services/student.service";
import type { Student } from "../../services/student.service";

import {
  createQuizResult,
  getQuizResultsByStudent,
  updateQuizResult,
  deleteQuizResult,
} from "../../services/quiz.service";

import type { QuizResult } from "../../services/quiz.service";
import { getApiError } from "../../services/getApiError";
import { useAuth } from "../../context/AuthContext";

function toDateInputValue(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString();
}

export default function QuizResults() {
  const { user } = useAuth();

  const canManage =
    user?.role === "ADMIN" || user?.role === "TEACHER";

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  const [classroomId, setClassroomId] = useState("");
  const [studentId, setStudentId] = useState("");

  const [quizName, setQuizName] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");

  const [takenAt, setTakenAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [needsSupport, setNeedsSupport] = useState(false);

  const [editingResult, setEditingResult] =
    useState<QuizResult | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load classrooms.
  useEffect(() => {
    let cancelled = false;

    async function loadClassrooms() {
      try {
        const data = await getClassrooms();

        if (!cancelled) {
          setClassrooms(data);
          setClassroomId((currentId) => {
            if (currentId && data.some((item) => item.id === currentId)) {
              return currentId;
            }

            return data[0]?.id ?? "";
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiError(err, "Failed to load classrooms."));
        }
      } finally {
        if (!cancelled) {
          setLoadingClassrooms(false);
        }
      }
    }

    void loadClassrooms();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load students when the classroom changes.
  useEffect(() => {
    if (!classroomId) return;

    let cancelled = false;

    async function loadStudents() {
      setLoadingStudents(true);

      try {
        const data = await getStudentsByClassroom(classroomId);

        if (!cancelled) {
          setStudents(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setStudents([]);
          setError(getApiError(err, "Failed to load students."));
        }
      } finally {
        if (!cancelled) {
          setLoadingStudents(false);
        }
      }
    }

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, [classroomId]);

  // Load results when the selected student or refresh key changes.
  useEffect(() => {
    if (!studentId) return;

    let cancelled = false;

    async function loadResults() {
      setLoadingResults(true);
      setError("");

      try {
        const data = await getQuizResultsByStudent(studentId);

        if (!cancelled) {
          setResults(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setResults([]);
          setError(getApiError(err, "Failed to load quiz results."));
        }
      } finally {
        if (!cancelled) {
          setLoadingResults(false);
        }
      }
    }

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, [studentId, refreshKey]);

  function resetForm() {
    setQuizName("");
    setScore("");
    setMaxScore("100");
    setTakenAt(new Date().toISOString().slice(0, 10));
    setEditingResult(null);
    setShowForm(false);
    setNeedsSupport(false);
  }

  function handleClassroomChange(value: string) {
    setClassroomId(value);
    setStudents([]);
    setStudentId("");
    setResults([]);
    setError("");
    setSuccess("");
    resetForm();
  }

  function handleStudentChange(value: string) {
    setStudentId(value);
    setResults([]);
    setError("");
    setSuccess("");
    resetForm();
  }

  function startCreating() {
    setError("");
    setSuccess("");
    setEditingResult(null);
    setQuizName("");
    setScore("");
    setMaxScore("100");
    setTakenAt(new Date().toISOString().slice(0, 10));
    setShowForm(true);
    setNeedsSupport(false);
  }

  function startEditing(result: QuizResult) {
    setError("");
    setSuccess("");
    setEditingResult(result);
    setQuizName(result.quizName);
    setScore(String(result.score));
    setMaxScore(String(result.maxScore));
    setTakenAt(toDateInputValue(result.takenAt));
    setShowForm(true);
    setNeedsSupport(result.needsSupport ?? false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManage) {
      setError("You do not have permission to manage quiz results.");
      return;
    }

    if (!studentId) {
      setError("Please select a student.");
      return;
    }

    const trimmedName = quizName.trim();
    const numericScore = Number(score);
    const numericMaxScore = Number(maxScore);

    if (trimmedName.length < 2 || trimmedName.length > 150) {
      setError("Quiz name must contain between 2 and 150 characters.");
      return;
    }

    if (
      score.trim() === "" ||
      maxScore.trim() === "" ||
      !Number.isFinite(numericScore) ||
      !Number.isFinite(numericMaxScore) ||
      numericScore < 0 ||
      numericMaxScore <= 0 ||
      numericScore > numericMaxScore
    ) {
      setError("Enter a valid score between zero and the maximum score.");
      return;
    }

    let takenAtIso: string | undefined;

    if (takenAt) {
      const date = new Date(`${takenAt}T00:00:00`);

      if (Number.isNaN(date.getTime())) {
        setError("Please enter a valid quiz date.");
        return;
      }

      takenAtIso = date.toISOString();
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingResult?.id) {
        await updateQuizResult(editingResult.id, {
          quizName: trimmedName,
          score: numericScore,
          maxScore: numericMaxScore,
          ...(takenAtIso ? { takenAt: takenAtIso } : {}),
        });

        setSuccess("Quiz result updated successfully.");
      } else {
        await createQuizResult({
          quizName: trimmedName,
          score: numericScore,
          maxScore: numericMaxScore,
          studentId,
          needsSupport,
          ...(takenAtIso ? { takenAt: takenAtIso } : {}),
        });

        setSuccess("Quiz result recorded successfully.");
      }

      resetForm();
      setRefreshKey((previous) => previous + 1);
    } catch (err: unknown) {
      setError(getApiError(err, "Failed to save quiz result."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(result: QuizResult) {
    if (!canManage || !result.id) {
      setError("This quiz result cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete the quiz result "${result.quizName}"?`,
    );

    if (!confirmed) return;

    setDeletingId(result.id);
    setError("");
    setSuccess("");

    try {
      await deleteQuizResult(result.id);

      setResults((current) =>
        current.filter((item) => item.id !== result.id),
      );

      if (editingResult?.id === result.id) {
        resetForm();
      }

      setSuccess("Quiz result deleted successfully.");
    } catch (err: unknown) {
      setError(getApiError(err, "Failed to delete quiz result."));
    } finally {
      setDeletingId(null);
    }
  }

  const selectedStudent = students.find(
    (student) => student.id === studentId,
  );

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Page header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quiz Results</h2>
          <p className="text-secondary mb-0">
            Record assessment scores and review student performance.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={!studentId || loadingResults}
            onClick={() => {
              setError("");
              setRefreshKey((previous) => previous + 1);
            }}
          >
            <RefreshCw size={16} className="me-2" />
            Refresh
          </button>

          {canManage && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!studentId}
              onClick={startCreating}
            >
              Record Result
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          />
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible" role="status">
          {success}
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss notification"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      {/* Classroom and student selection */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="quiz-classroom" className="form-label">
                Classroom
              </label>

              <select
                id="quiz-classroom"
                className="form-select"
                value={classroomId}
                disabled={loadingClassrooms}
                onChange={(event) =>
                  handleClassroomChange(event.target.value)
                }
              >
                <option value="">
                  {loadingClassrooms
                    ? "Loading classrooms..."
                    : "Select classroom"}
                </option>

                {classrooms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.gradeLevel ? ` — Grade ${item.gradeLevel}` : ""}
                  </option>
                ))}
              </select>

              {!loadingClassrooms && classrooms.length === 0 && (
                <div className="form-text">
                  No classrooms are available.
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="quiz-student" className="form-label">
                Student
              </label>

              <select
                id="quiz-student"
                className="form-select"
                value={studentId}
                disabled={!classroomId || loadingStudents}
                onChange={(event) =>
                  handleStudentChange(event.target.value)
                }
              >
                <option value="">
                  {loadingStudents ? "Loading students..." : "Select student"}
                </option>

                {students.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName} ({item.rollNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedStudent && (
            <div className="small text-secondary mt-3">
              Viewing quiz history for{" "}
              <strong>{selectedStudent.fullName}</strong>.
            </div>
          )}
        </div>
      </div>

      {/* Create/edit form */}
      {showForm && canManage && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">
              {editingResult ? "Edit Quiz Result" : "Record Quiz Result"}
            </h5>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              aria-label="Close form"
              disabled={saving}
              onClick={resetForm}
            >
              <X size={16} />
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="quiz-name" className="form-label">
                    Quiz name
                  </label>

                  <input
                    id="quiz-name"
                    className="form-control"
                    value={quizName}
                    onChange={(event) => setQuizName(event.target.value)}
                    placeholder="e.g. Mathematics Unit Test"
                    minLength={2}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label htmlFor="quiz-score" className="form-label">
                    Score
                  </label>

                  <input
                    id="quiz-score"
                    type="number"
                    className="form-control"
                    value={score}
                    onChange={(event) => setScore(event.target.value)}
                    min={0}
                    step="any"
                    required
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label htmlFor="quiz-max-score" className="form-label">
                    Maximum score
                  </label>

                  <input
                    id="quiz-max-score"
                    type="number"
                    className="form-control"
                    value={maxScore}
                    onChange={(event) => setMaxScore(event.target.value)}
                    min="0.01"
                    step="any"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="quiz-taken-at" className="form-label">
                    Quiz date
                  </label>

                  <input
                    id="quiz-taken-at"
                    type="date"
                    className="form-control"
                    value={takenAt}
                    onChange={(event) => setTakenAt(event.target.value)}
                  />

                  {!editingResult && (
                    <div className="form-text">
                      Saving a custom quiz date requires the backend create
                      handler to support the takenAt field.
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="quiz-needs-support" className="form-label">
                    Does this student need additional support?
                  </label>

                  <select
                    id="quiz-needs-support"
                    className="form-select"
                    value={needsSupport ? "yes" : "no"}
                    onChange={(event) =>
                      setNeedsSupport(event.target.value === "yes")
                    }
                    disabled={saving}
                    required
                  >
                    <option value="no">No — No support needed</option>
                    <option value="yes">Yes — Needs support</option>
                  </select>

                  <div className="form-text">
                    Select based on your assessment of the student's learning needs.
                    This decision is saved with the quiz result.
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={saving}
                      onClick={resetForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving || !studentId}
                    >
                      {saving
                        ? "Saving..."
                        : editingResult
                          ? "Update Result"
                          : "Save Quiz Result"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-semibold">Quiz History</h5>
        </div>

        <div className="card-body p-0">
          {loadingResults ? (
            <div className="text-center py-5" role="status">
              <div
                className="spinner-border text-primary"
                aria-hidden="true"
              />
              <p className="text-secondary mt-3 mb-0">
                Loading quiz results...
              </p>
            </div>
          ) : !studentId ? (
            <div className="text-center py-5">
              <ClipboardCheck
                size={34}
                className="text-secondary mb-3"
              />
              <p className="text-secondary mb-0">
                Select a student to view quiz history.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-5">
              <ClipboardCheck
                size={34}
                className="text-secondary mb-3"
              />
              <p className="text-secondary mb-0">
                No quiz results found for this student.
              </p>

              {canManage && (
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={startCreating}
                >
                  Record First Result
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Quiz</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Support status</th>
                    <th>Date</th>
                    {canManage && <th className="text-end pe-3">Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {results.map((item, index) => {
                    const percentage =
                      item.maxScore > 0
                        ? (item.score / item.maxScore) * 100
                        : 0;

                    return (
                      <tr key={item.id ?? `${item.quizName}-${index}`}>
                        <td className="ps-3 fw-medium">{item.quizName}</td>

                        <td>
                          {item.score} / {item.maxScore}
                        </td>

                        <td>
                          <span
                            className={`badge ${percentage >= 75
                                ? "text-bg-success"
                                : percentage >= 40
                                  ? "text-bg-warning"
                                  : "text-bg-danger"
                              }`}
                          >
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${item.needsSupport
                                ? "text-bg-warning"
                                : "text-bg-success"
                              }`}
                          >
                            {item.needsSupport
                              ? "Needs support"
                              : "No support needed"}
                          </span>
                        </td>
                        <td>{formatDate(item.takenAt)}</td>

                        {canManage && (
                          <td className="text-end pe-3">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                aria-label={`Edit ${item.quizName}`}
                                title="Edit result"
                                disabled={
                                  !item.id ||
                                  saving ||
                                  deletingId !== null
                                }
                                onClick={() => startEditing(item)}
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                aria-label={`Delete ${item.quizName}`}
                                title="Delete result"
                                disabled={
                                  !item.id ||
                                  saving ||
                                  deletingId !== null
                                }
                                onClick={() => void handleDelete(item)}
                              >
                                {deletingId === item.id ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

