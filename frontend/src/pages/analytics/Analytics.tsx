 
// E:\GradeLens-AI\frontend\src\pages\analytics\Analytics.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  Users,
  Eye,
  Search,
  X,
  AlertCircle,
} from "lucide-react";

import { getClassrooms } from "../../services/classroom.service";
import type { Classroom } from "../../services/classroom.service";

import { getClassroomAnalytics } from "../../services/analytics.service";
import type {
  ClassroomAnalytics,
  StudentPerformance,
} from "../../services/analytics.service";

import { getApiError } from "../../services/getApiError";
import StudentDetails from "../students/StudentDetails";

const DEBOUNCE_DELAY = 300;
const DEFAULT_VISIBLE_STUDENTS = 5;

function formatPercentage(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(1)}%`;
}

function MetricCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>
              <p className="text-secondary small mb-2">{title}</p>
              <h3 className="fw-bold mb-1">{value}</h3>

              {subtitle && (
                <p className="text-secondary small mb-0">{subtitle}</p>
              )}
            </div>

            <div className="rounded-3 bg-primary-subtle text-primary p-2">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const validValue = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0;

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between gap-3 mb-2">
        <span className="fw-medium">{label}</span>
        <span className="text-secondary">{formatPercentage(value)}</span>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuenow={validValue}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: "8px" }}
      >
        <div
          className="progress-bar"
          style={{ width: `${validValue}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Displays the existing StudentDetails component inside a modal.
 * StudentDetails remains responsible for fetching and displaying the
 * selected student's profile and academic records.
 */
function StudentDetailModal({
  studentId,
  onClose,
}: {
  studentId: string;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-detail-title"
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: 1060,
        padding: "12px",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <div className="min-w-0">
              <h5
                id="student-detail-title"
                className="modal-title fw-bold"
              >
                Student Details
              </h5>

              <p className="text-secondary small mb-0 mt-1">
                View the student's profile and academic records.
              </p>
            </div>

            {/* <button
              type="button"
              className="btn-close flex-shrink-0 ms-3"
              aria-label="Close student details"
              onClick={onClose}
            /> */}
          </div>

          <div className="modal-body p-0">
            <StudentDetails studentId={studentId} embedded />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomId, setClassroomId] = useState("");

  const [analytics, setAnalytics] =
    useState<ClassroomAnalytics | null>(null);

  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAllStudents, setShowAllStudents] = useState(false);

  // Store only the selected ID. StudentDetails fetches the student record.
  const [selectedStudentId, setSelectedStudentId] =useState<string | null>(null);

  // Debounce the search input.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, DEBOUNCE_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  // Reset pagination when the search or classroom changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowAllStudents(false);
  }, [debouncedSearch, classroomId]);

  // Load classrooms.
  useEffect(() => {
    let cancelled = false;

    async function loadClassrooms() {
      try {
        const data = await getClassrooms();

        if (cancelled) return;

        setClassrooms(data);

        setClassroomId((currentId) => {
          if (currentId && data.some((item) => item.id === currentId)) {
            return currentId;
          }

          return data[0]?.id ?? "";
        });
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

  // Load analytics for the selected classroom.
  useEffect(() => {
    if (!classroomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnalytics(null);
      setLoadingAnalytics(false);
      return;
    }

    let cancelled = false;

    async function loadAnalytics() {
      setLoadingAnalytics(true);
      setError("");

      try {
        const data = await getClassroomAnalytics(classroomId);

        if (!cancelled) {
          setAnalytics(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setAnalytics(null);
          setError(
            getApiError(err, "Failed to load classroom analytics."),
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAnalytics(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [classroomId, refreshKey]);

  const closeStudentModal = useCallback(() => {
    setSelectedStudentId(null);
  }, []);

  function handleClassroomChange(value: string) {
    setClassroomId(value);
    setAnalytics(null);
    setError("");
    setSelectedStudentId(null);
    setSearchInput("");
    setDebouncedSearch("");
    setShowAllStudents(false);
  }

  function handleViewStudent(studentId: string) {
    if (!studentId) return;

    setSelectedStudentId(studentId);
  }

  const summary = analytics?.summary;

  // const studentPerformance: StudentPerformance[] =
  //   analytics?.studentPerformance ?? [];

const studentPerformance = useMemo<StudentPerformance[]>(
  () => analytics?.studentPerformance ?? [],
  [analytics?.studentPerformance]
);
  // Search by name, roll number, or student ID.
  const filteredStudents = useMemo(() => {
    if (!debouncedSearch) return studentPerformance;

    return studentPerformance.filter((student) => {
      const searchableText = [
        student.name,
        student.rollNumber,
        student.studentId,
      ]
        .filter((value) => value != null)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(debouncedSearch);
    });
  }, [studentPerformance, debouncedSearch]);

  // Show five rows by default or all matching rows when expanded.
  const visibleStudents = showAllStudents
    ? filteredStudents
    : filteredStudents.slice(0, DEFAULT_VISIBLE_STUDENTS);

  const canExpand =
    filteredStudents.length > DEFAULT_VISIBLE_STUDENTS;
console.log("Student performance data:", visibleStudents);
  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Page header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Analytics</h2>
          <p className="text-secondary mb-0">
            Monitor classroom progress and student performance.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setError("");
            setRefreshKey((previous) => previous + 1);
          }}
          disabled={!classroomId || loadingAnalytics}
        >
          <RefreshCw size={16} className="me-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} className="me-2" />
          {error}
        </div>
      )}

      {/* Classroom selector */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <label
            htmlFor="analytics-classroom"
            className="form-label fw-semibold"
          >
            Select Classroom
          </label>

          <select
            id="analytics-classroom"
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
                : "Choose a classroom"}
            </option>

            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
                {classroom.gradeLevel
                  ? ` — Grade ${classroom.gradeLevel}`
                  : ""}
                {classroom.section
                  ? ` (${classroom.section})`
                  : ""}
              </option>
            ))}
          </select>

          {!loadingClassrooms && classrooms.length === 0 && (
            <p className="text-secondary small mt-2 mb-0">
              No classrooms are available for your account.
            </p>
          )}
        </div>
      </div>

      {loadingAnalytics ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                Loading analytics...
              </span>
            </div>

            <p className="text-secondary mt-3 mb-0">
              Loading classroom analytics...
            </p>
          </div>
        </div>
      ) : !classroomId ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <GraduationCap
              size={36}
              className="text-secondary mb-3"
            />

            <h5>No classroom selected</h5>

            <p className="text-secondary mb-0">
              Select a classroom to view its analytics.
            </p>
          </div>
        </div>
      ) : summary ? (
        <>
          {/* Summary cards */}
          <div className="row g-3 mb-4">
            <MetricCard
              title="Total Students"
              value={summary.totalStudents}
              icon={<Users size={22} />}
              subtitle="Enrolled in this classroom"
            />

            <MetricCard
              title="Quiz Assessments"
              value={summary.totalQuizzes}
              icon={<ClipboardCheck size={22} />}
              subtitle="Recorded quiz results"
            />

            <MetricCard
              title="Homework Assignments"
              value={summary.totalHomework}
              icon={<BookOpen size={22} />}
              subtitle={`${summary.gradedHomeworkCount} graded`}
            />

            <MetricCard
              title="Students Needing Support"
              value={summary.studentsNeedingSupport}
              icon={<TrendingUp size={22} />}
              subtitle="Based on classroom analytics"
            />
          </div>

          {/* Classroom performance overview */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    Academic Performance
                  </h5>

                  <ProgressMetric
                    label="Average Quiz Percentage"
                    value={summary.averageQuizPercentage}
                  />

                  <ProgressMetric
                    label="Average Homework Percentage"
                    value={summary.averageHomeworkPercentage}
                  />

                  <ProgressMetric
                    label="Homework Completion Rate"
                    value={summary.homeworkCompletionRate}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    Classroom Overview
                  </h5>

                  <div className="d-flex justify-content-between py-3 border-bottom gap-3">
                    <span className="text-secondary">
                      Students enrolled
                    </span>
                    <strong>{summary.totalStudents}</strong>
                  </div>

                  <div className="d-flex justify-content-between py-3 border-bottom gap-3">
                    <span className="text-secondary">
                      Homework graded
                    </span>
                    <strong>{summary.gradedHomeworkCount}</strong>
                  </div>

                  <div className="d-flex justify-content-between py-3 gap-3">
                    <span className="text-secondary">
                      Students needing support
                    </span>
                    <strong>{summary.studentsNeedingSupport}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student performance table */}
          <section className="card border-0 shadow-sm">
            <div className="card-header bg-white p-3 p-md-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    Student Performance
                  </h5>

                  <p className="small text-secondary mb-0">
                    Search students and open their individual academic records.
                  </p>
                </div>

                {/* Search bar */}
                <div
                  className="position-relative"
                  style={{ width: "100%", maxWidth: "320px" }}
                >
                  <Search
                    size={17}
                    className="position-absolute text-secondary"
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />

                  <input
                    type="search"
                    className="form-control form-control-sm"
                    style={{
                      paddingLeft: "36px",
                      paddingRight: searchInput ? "34px" : undefined,
                      minHeight: "38px",
                    }}
                    placeholder="Search name, roll no. or ID..."
                    aria-label="Search students by name, roll number, or ID"
                    value={searchInput}
                    onChange={(event) =>
                      setSearchInput(event.target.value)
                    }
                  />

                  {searchInput && (
                    <button
                      type="button"
                      className="btn btn-sm position-absolute text-secondary p-1"
                      style={{
                        right: "6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      aria-label="Clear student search"
                      onClick={() => {
                        setSearchInput("");
                        setDebouncedSearch("");
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                <span
                  className="small text-secondary"
                  aria-live="polite"
                >
                  {filteredStudents.length === 0
                    ? "No matching students"
                    : `Showing ${visibleStudents.length} of ${filteredStudents.length} matching students`}
                </span>

                {canExpand && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      setShowAllStudents((previous) => !previous)
                    }
                  >
                    {showAllStudents
                      ? "Show Less"
                      : "Show All Students"}
                  </button>
                )}
              </div>
            </div>

            <div className="card-body p-0">
              {studentPerformance.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <Users
                    size={32}
                    className="text-secondary mb-3"
                  />

                  <h6 className="fw-semibold">
                    No student performance data
                  </h6>

                  <p className="text-secondary mb-0">
                    No performance records are available for this classroom.
                  </p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <Search
                    size={30}
                    className="text-secondary mb-3"
                  />

                  <h6 className="fw-semibold">No students found</h6>

                  <p className="text-secondary mb-3">
                    Try a different name, roll number, or student ID.
                  </p>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setSearchInput("");
                      setDebouncedSearch("");
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table
                    className="table table-hover align-middle mb-0"
                    style={{ minWidth: "800px" }}
                  >
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3 py-3">Student</th>
                        <th className="py-3">Roll Number</th>
                        <th className="py-3">Quiz Average</th>
                        <th className="py-3">Homework Average</th>
                        <th className="py-3">Completion</th>
                        <th className="text-end pe-3 py-3">Details</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleStudents.map(
                        (student: StudentPerformance, index) => (
                          <tr
                            key={
                              student.studentId ||
                              `${student.rollNumber}-${index}`
                            }
                          >
                            <td className="ps-3">
                              <div className="fw-medium">
                                {student.name || "Unnamed student"}
                              </div>
                            </td>

                            <td>{student.rollNumber || "—"}</td>

                            <td>
                              {formatPercentage(
                                student.averageQuizPercentage,
                              )}
                            </td>

                            <td>
                              {formatPercentage(
                                student.averageHomeworkPercentage,
                              )}
                            </td>

                            <td>
                              {formatPercentage(
                                student.homeworkCompletionRate,
                              )}
                            </td>

                            <td className="text-end pe-3">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                                disabled={!student.studentId}
                                onClick={() =>
                                  handleViewStudent(student.studentId)
                                }
                              >
                                <Eye size={15} />
                                View
                              </button>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {canExpand && (
              <div className="card-footer bg-white text-center py-3">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() =>
                    setShowAllStudents((previous) => !previous)
                  }
                >
                  {showAllStudents
                    ? "Show only the first 5 students"
                    : `View all ${filteredStudents.length} matching students`}
                </button>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-0">
              Analytics data is not available for this classroom.
            </p>
          </div>
        </div>
      )}

      {/* Student details modal */}
      {selectedStudentId && (
        <StudentDetailModal
          studentId={selectedStudentId}
          onClose={closeStudentModal}
        />
      )}
    </div>
  );
}
// ---------------------------------------------------------


// // E:\GradeLens-AI\frontend\src\pages\analytics\Analytics.tsx
// //to render the route for student details
// import {
//   useEffect,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";

// import { useNavigate,useLocation } from "react-router-dom";

// import {
//   BookOpen,
//   ClipboardCheck,
//   GraduationCap,
//   RefreshCw,
//   TrendingUp,
//   Users,
//   Eye,
//   Search,
//   X,
//   AlertCircle,
// } from "lucide-react";

// import { getClassrooms } from "../../services/classroom.service";
// import type { Classroom } from "../../services/classroom.service";

// import { getClassroomAnalytics } from "../../services/analytics.service";
// import type {
//   ClassroomAnalytics,
//   StudentPerformance,
// } from "../../services/analytics.service";

// import { getApiError } from "../../services/getApiError";

// const DEBOUNCE_DELAY = 300;
// const DEFAULT_VISIBLE_STUDENTS = 5;

// function formatPercentage(value: number | null | undefined): string {
//   if (typeof value !== "number" || !Number.isFinite(value)) {
//     return "—";
//   }

//   return `${value.toFixed(1)}%`;
// }

// function MetricCard({
//   title,
//   value,
//   icon,
//   subtitle,
// }: {
//   title: string;
//   value: string | number;
//   icon: ReactNode;
//   subtitle?: string;
// }) {
//   return (
//     <div className="col-12 col-sm-6 col-xl-3">
//       <div className="card border-0 shadow-sm h-100">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-start gap-3">
//             <div>
//               <p className="text-secondary small mb-2">{title}</p>
//               <h3 className="fw-bold mb-1">{value}</h3>

//               {subtitle && (
//                 <p className="text-secondary small mb-0">{subtitle}</p>
//               )}
//             </div>

//             <div className="rounded-3 bg-primary-subtle text-primary p-2">
//               {icon}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ProgressMetric({
//   label,
//   value,
// }: {
//   label: string;
//   value: number;
// }) {
//   const validValue = Number.isFinite(value)
//     ? Math.min(100, Math.max(0, value))
//     : 0;

//   return (
//     <div className="mb-4">
//       <div className="d-flex justify-content-between gap-3 mb-2">
//         <span className="fw-medium">{label}</span>
//         <span className="text-secondary">{formatPercentage(value)}</span>
//       </div>

//       <div
//         className="progress"
//         role="progressbar"
//         aria-label={label}
//         aria-valuenow={validValue}
//         aria-valuemin={0}
//         aria-valuemax={100}
//         style={{ height: "8px" }}
//       >
//         <div
//           className="progress-bar"
//           style={{ width: `${validValue}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// export default function Analytics() {
//   const navigate = useNavigate();
// const location = useLocation();
//   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
//   const [classroomId, setClassroomId] = useState("");

//   const [analytics, setAnalytics] =
//     useState<ClassroomAnalytics | null>(null);

//   const [loadingClassrooms, setLoadingClassrooms] = useState(true);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [error, setError] = useState("");

//   const [searchInput, setSearchInput] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [showAllStudents, setShowAllStudents] = useState(false);

//   // Debounce the search input.
//   useEffect(() => {
//     const timeoutId = window.setTimeout(() => {
//       setDebouncedSearch(searchInput.trim().toLowerCase());
//     }, DEBOUNCE_DELAY);

//     return () => window.clearTimeout(timeoutId);
//   }, [searchInput]);

//   // Reset pagination when the search or classroom changes.
//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setShowAllStudents(false);
//   }, [debouncedSearch, classroomId]);

//   // Load classrooms.
//   useEffect(() => {
//     let cancelled = false;

//     async function loadClassrooms() {
//       try {
//         const data = await getClassrooms();

//         if (cancelled) return;

//         setClassrooms(data);

//         setClassroomId((currentId) => {
//           if (currentId && data.some((item) => item.id === currentId)) {
//             return currentId;
//           }

//           return data[0]?.id ?? "";
//         });
//       } catch (err: unknown) {
//         if (!cancelled) {
//           setError(getApiError(err, "Failed to load classrooms."));
//         }
//       } finally {
//         if (!cancelled) {
//           setLoadingClassrooms(false);
//         }
//       }
//     }

//     void loadClassrooms();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Load analytics for the selected classroom.
//   useEffect(() => {
//     if (!classroomId) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setAnalytics(null);
//       setLoadingAnalytics(false);
//       return;
//     }

//     let cancelled = false;

//     async function loadAnalytics() {
//       setLoadingAnalytics(true);
//       setError("");

//       try {
//         const data = await getClassroomAnalytics(classroomId);

//         if (!cancelled) {
//           setAnalytics(data);
//         }
//       } catch (err: unknown) {
//         if (!cancelled) {
//           setAnalytics(null);
//           setError(
//             getApiError(err, "Failed to load classroom analytics."),
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoadingAnalytics(false);
//         }
//       }
//     }

//     void loadAnalytics();

//     return () => {
//       cancelled = true;
//     };
//   }, [classroomId, refreshKey]);

//   function handleClassroomChange(value: string) {
//     setClassroomId(value);
//     setAnalytics(null);
//     setError("");
//     setSearchInput("");
//     setDebouncedSearch("");
//     setShowAllStudents(false);
//   }

//   // Navigate to the existing student details page instead of opening a modal.
// function handleViewStudent(studentId: string) {
//   if (!studentId) return;

//   navigate(`/students/${encodeURIComponent(studentId)}`, {
//     state: {
//       from: location.pathname,
//     },
//   });
// }

//   const summary = analytics?.summary;

//   const studentPerformance = useMemo<StudentPerformance[]>(
//     () => analytics?.studentPerformance ?? [],
//     [analytics?.studentPerformance],
//   );

//   // Search by name, roll number, or student ID.
//   const filteredStudents = useMemo(() => {
//     if (!debouncedSearch) return studentPerformance;

//     return studentPerformance.filter((student) => {
//       const searchableText = [
//         student.name,
//         student.rollNumber,
//         student.studentId,
//       ]
//         .filter((value) => value != null)
//         .join(" ")
//         .toLowerCase();

//       return searchableText.includes(debouncedSearch);
//     });
//   }, [studentPerformance, debouncedSearch]);

//   // Show five rows by default or all matching rows when expanded.
//   const visibleStudents = showAllStudents
//     ? filteredStudents
//     : filteredStudents.slice(0, DEFAULT_VISIBLE_STUDENTS);

//   const canExpand =
//     filteredStudents.length > DEFAULT_VISIBLE_STUDENTS;

//   return (
//     <div className="container-fluid py-3 py-md-4">
//       {/* Page header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <h2 className="fw-bold mb-1">Analytics</h2>
//           <p className="text-secondary mb-0">
//             Monitor classroom progress and student performance.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn-outline-secondary"
//           onClick={() => {
//             setError("");
//             setRefreshKey((previous) => previous + 1);
//           }}
//           disabled={!classroomId || loadingAnalytics}
//         >
//           <RefreshCw size={16} className="me-2" />
//           Refresh
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           <AlertCircle size={18} className="me-2" />
//           {error}
//         </div>
//       )}

//       {/* Classroom selector */}
//       <div className="card border-0 shadow-sm mb-4">
//         <div className="card-body">
//           <label
//             htmlFor="analytics-classroom"
//             className="form-label fw-semibold"
//           >
//             Select Classroom
//           </label>

//           <select
//             id="analytics-classroom"
//             className="form-select"
//             value={classroomId}
//             disabled={loadingClassrooms}
//             onChange={(event) =>
//               handleClassroomChange(event.target.value)
//             }
//           >
//             <option value="">
//               {loadingClassrooms
//                 ? "Loading classrooms..."
//                 : "Choose a classroom"}
//             </option>

//             {classrooms.map((classroom) => (
//               <option key={classroom.id} value={classroom.id}>
//                 {classroom.name}
//                 {classroom.gradeLevel
//                   ? ` — Grade ${classroom.gradeLevel}`
//                   : ""}
//                 {classroom.section
//                   ? ` (${classroom.section})`
//                   : ""}
//               </option>
//             ))}
//           </select>

//           {!loadingClassrooms && classrooms.length === 0 && (
//             <p className="text-secondary small mt-2 mb-0">
//               No classrooms are available for your account.
//             </p>
//           )}
//         </div>
//       </div>

//       {loadingAnalytics ? (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">
//                 Loading analytics...
//               </span>
//             </div>

//             <p className="text-secondary mt-3 mb-0">
//               Loading classroom analytics...
//             </p>
//           </div>
//         </div>
//       ) : !classroomId ? (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body text-center py-5">
//             <GraduationCap
//               size={36}
//               className="text-secondary mb-3"
//             />

//             <h5>No classroom selected</h5>

//             <p className="text-secondary mb-0">
//               Select a classroom to view its analytics.
//             </p>
//           </div>
//         </div>
//       ) : summary ? (
//         <>
//           {/* Summary cards */}
//           <div className="row g-3 mb-4">
//             <MetricCard
//               title="Total Students"
//               value={summary.totalStudents}
//               icon={<Users size={22} />}
//               subtitle="Enrolled in this classroom"
//             />

//             <MetricCard
//               title="Quiz Assessments"
//               value={summary.totalQuizzes}
//               icon={<ClipboardCheck size={22} />}
//               subtitle="Recorded quiz results"
//             />

//             <MetricCard
//               title="Homework Assignments"
//               value={summary.totalHomework}
//               icon={<BookOpen size={22} />}
//               subtitle={`${summary.gradedHomeworkCount} graded`}
//             />

//             <MetricCard
//               title="Students Needing Support"
//               value={summary.studentsNeedingSupport}
//               icon={<TrendingUp size={22} />}
//               subtitle="Based on classroom analytics"
//             />
//           </div>

//           {/* Classroom performance overview */}
//           <div className="row g-3 mb-4">
//             <div className="col-12 col-lg-6">
//               <div className="card border-0 shadow-sm h-100">
//                 <div className="card-body p-4">
//                   <h5 className="fw-bold mb-4">
//                     Academic Performance
//                   </h5>

//                   <ProgressMetric
//                     label="Average Quiz Percentage"
//                     value={summary.averageQuizPercentage}
//                   />

//                   <ProgressMetric
//                     label="Average Homework Percentage"
//                     value={summary.averageHomeworkPercentage}
//                   />

//                   <ProgressMetric
//                     label="Homework Completion Rate"
//                     value={summary.homeworkCompletionRate}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-lg-6">
//               <div className="card border-0 shadow-sm h-100">
//                 <div className="card-body p-4">
//                   <h5 className="fw-bold mb-3">
//                     Classroom Overview
//                   </h5>

//                   <div className="d-flex justify-content-between py-3 border-bottom gap-3">
//                     <span className="text-secondary">
//                       Students enrolled
//                     </span>
//                     <strong>{summary.totalStudents}</strong>
//                   </div>

//                   <div className="d-flex justify-content-between py-3 border-bottom gap-3">
//                     <span className="text-secondary">
//                       Homework graded
//                     </span>
//                     <strong>{summary.gradedHomeworkCount}</strong>
//                   </div>

//                   <div className="d-flex justify-content-between py-3 gap-3">
//                     <span className="text-secondary">
//                       Students needing support
//                     </span>
//                     <strong>{summary.studentsNeedingSupport}</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Student performance table */}
//           <section className="card border-0 shadow-sm">
//             <div className="card-header bg-white p-3 p-md-4">
//               <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
//                 <div>
//                   <h5 className="fw-bold mb-1">
//                     Student Performance
//                   </h5>

//                   <p className="small text-secondary mb-0">
//                     Search students and open their individual academic records.
//                   </p>
//                 </div>

//                 {/* Search bar */}
//                 <div
//                   className="position-relative"
//                   style={{ width: "100%", maxWidth: "320px" }}
//                 >
//                   <Search
//                     size={17}
//                     className="position-absolute text-secondary"
//                     style={{
//                       left: "12px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                     }}
//                   />

//                   <input
//                     type="search"
//                     className="form-control form-control-sm"
//                     style={{
//                       paddingLeft: "36px",
//                       paddingRight: searchInput ? "34px" : undefined,
//                       minHeight: "38px",
//                     }}
//                     placeholder="Search name, roll no. or ID..."
//                     aria-label="Search students by name, roll number, or ID"
//                     value={searchInput}
//                     onChange={(event) =>
//                       setSearchInput(event.target.value)
//                     }
//                   />

//                   {searchInput && (
//                     <button
//                       type="button"
//                       className="btn btn-sm position-absolute text-secondary p-1"
//                       style={{
//                         right: "6px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                       }}
//                       aria-label="Clear student search"
//                       onClick={() => {
//                         setSearchInput("");
//                         setDebouncedSearch("");
//                       }}
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
//                 <span
//                   className="small text-secondary"
//                   aria-live="polite"
//                 >
//                   {filteredStudents.length === 0
//                     ? "No matching students"
//                     : `Showing ${visibleStudents.length} of ${filteredStudents.length} matching students`}
//                 </span>

//                 {canExpand && (
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() =>
//                       setShowAllStudents((previous) => !previous)
//                     }
//                   >
//                     {showAllStudents
//                       ? "Show Less"
//                       : "Show All Students"}
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="card-body p-0">
//               {studentPerformance.length === 0 ? (
//                 <div className="text-center py-5 px-3">
//                   <Users
//                     size={32}
//                     className="text-secondary mb-3"
//                   />

//                   <h6 className="fw-semibold">
//                     No student performance data
//                   </h6>

//                   <p className="text-secondary mb-0">
//                     No performance records are available for this classroom.
//                   </p>
//                 </div>
//               ) : filteredStudents.length === 0 ? (
//                 <div className="text-center py-5 px-3">
//                   <Search
//                     size={30}
//                     className="text-secondary mb-3"
//                   />

//                   <h6 className="fw-semibold">No students found</h6>

//                   <p className="text-secondary mb-3">
//                     Try a different name, roll number, or student ID.
//                   </p>

//                   <button
//                     type="button"
//                     className="btn btn-sm btn-outline-secondary"
//                     onClick={() => {
//                       setSearchInput("");
//                       setDebouncedSearch("");
//                     }}
//                   >
//                     Clear Search
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table
//                     className="table table-hover align-middle mb-0"
//                     style={{ minWidth: "800px" }}
//                   >
//                     <thead className="table-light">
//                       <tr>
//                         <th className="ps-3 py-3">Student</th>
//                         <th className="py-3">Roll Number</th>
//                         <th className="py-3">Quiz Average</th>
//                         <th className="py-3">Homework Average</th>
//                         <th className="py-3">Completion</th>
//                         <th className="text-end pe-3 py-3">Details</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {visibleStudents.map(
//                         (student: StudentPerformance, index) => (
//                           <tr
//                             key={
//                               student.studentId ||
//                               `${student.rollNumber}-${index}`
//                             }
//                           >
//                             <td className="ps-3">
//                               <div className="fw-medium">
//                                 {student.name || "Unnamed student"}
//                               </div>
//                             </td>

//                             <td>{student.rollNumber || "—"}</td>

//                             <td>
//                               {formatPercentage(
//                                 student.averageQuizPercentage,
//                               )}
//                             </td>

//                             <td>
//                               {formatPercentage(
//                                 student.averageHomeworkPercentage,
//                               )}
//                             </td>

//                             <td>
//                               {formatPercentage(
//                                 student.homeworkCompletionRate,
//                               )}
//                             </td>

//                             <td className="text-end pe-3">
//                               <button
//                                 type="button"
//                                 className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
//                                 disabled={!student.studentId}
//                                 onClick={() =>
//                                   handleViewStudent(student.studentId)
//                                 }
//                               >
//                                 <Eye size={15} />
//                                 View
//                               </button>
//                             </td>
//                           </tr>
//                         ),
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {canExpand && (
//               <div className="card-footer bg-white text-center py-3">
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-link text-decoration-none"
//                   onClick={() =>
//                     setShowAllStudents((previous) => !previous)
//                   }
//                 >
//                   {showAllStudents
//                     ? "Show only the first 5 students"
//                     : `View all ${filteredStudents.length} matching students`}
//                 </button>
//               </div>
//             )}
//           </section>
//         </>
//       ) : (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body text-center py-5">
//             <p className="text-secondary mb-0">
//               Analytics data is not available for this classroom.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
