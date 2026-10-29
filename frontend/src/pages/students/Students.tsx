 
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Mail,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import StudentDetails from "./StudentDetails";

import {
  createStudent,
  deleteStudent,
  getStudentsByClassroom,
  updateStudent,
  type Student,
} from "../../services/student.service";

import {
  getClassrooms,
  type Classroom,
} from "../../services/classroom.service";

interface StudentFormData {
  fullName: string;
  rollNumber: string;
  email: string;
}


const EMPTY_FORM: StudentFormData = {
  fullName: "",
  rollNumber: "",
  email: "",
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export default function Students() {

  const location = useLocation();
  const navigationState = location.state as
  | {
      classroomId?: string;
      classroom?: Classroom;
    }
  | null;

const navigationClassroomId = navigationState?.classroomId ?? "";

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomId, setClassroomId] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingStudentId, setEditingStudentId] =
    useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] =
    useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [formData, setFormData] =
    useState<StudentFormData>(EMPTY_FORM);

  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingStudentId, setDeletingStudentId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedClassroom = classrooms.find(
    (classroom) => classroom.id === classroomId
  );

  // Debounced search.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  // Load classrooms.
  // const loadClassrooms = useCallback(async () => {
  //   setLoadingClassrooms(true);

  //   try {
  //     const result = await getClassrooms();
  //     setClassrooms(result);

  //     setClassroomId((currentId) => {
  //       if (currentId && result.some((item) => item.id === currentId)) {
  //         return currentId;
  //       }

  //       return result[0]?.id ?? "";
  //     });

  //     setError("");
  //   } catch (err) {
  //     setError(getErrorMessage(err));
  //   } finally {
  //     setLoadingClassrooms(false);
  //   }
  // }, []);

  const loadClassrooms = useCallback(async () => {
  try {
    const result = await getClassrooms();

    setClassrooms(result);

    setClassroomId((currentId) => {
      // Preserve the current selection when it still exists.
      if (currentId && result.some((item) => item.id === currentId)) {
        return currentId;
      }

      // Prefer the classroom selected on the previous page.
      if (
        navigationClassroomId &&
        result.some((item) => item.id === navigationClassroomId)
      ) {
        return navigationClassroomId;
      }

      // Fall back to the first classroom if no matching ID exists.
      return result[0]?.id ?? "";
    });

    setError("");
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setLoadingClassrooms(false);
  }
}, [navigationClassroomId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadClassrooms();
  }, [loadClassrooms]);

  // Load students for the selected classroom.
  const loadStudents = useCallback(async () => {
    if (!classroomId) {
      setStudents([]);
      setLoadingStudents(false);
      return;
    }

    setLoadingStudents(true);

    try {
      const result = await getStudentsByClassroom(classroomId);
      setStudents(result);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingStudents(false);
    }
  }, [classroomId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStudents();
  }, [loadStudents]);

  // Close the three-dot menu when clicking outside it.
  useEffect(() => {
    if (!openMenuId) return;

    const closeMenu = () => setOpenMenuId(null);

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  // Close the details popup with Escape.
  // useEffect(() => {
  //   if (!selectedStudentId) return;

  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === "Escape") {
  //       setSelectedStudentId(null);
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, [selectedStudentId]);
useEffect(() => {
  if (!selectedStudentId) return;

  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    if (event.key === "Escape") {
      setSelectedStudentId(null);
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [selectedStudentId]);
  const filteredStudents = useMemo(() => {
    if (!debouncedSearch) return students;

    return students.filter((student) =>
      [
        student.fullName,
        student.rollNumber,
        student.email ?? "",
        student.id,
      ].some((value) =>
        String(value).toLowerCase().includes(debouncedSearch)
      )
    );
  }, [students, debouncedSearch]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingStudentId(null);
    setShowForm(false);
  };

  const handleAddStudent = () => {
    setError("");
    setSuccess("");
    setFormData(EMPTY_FORM);
    setEditingStudentId(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setOpenMenuId(null);
    setError("");
    setSuccess("");

    setFormData({
      fullName: student.fullName,
      rollNumber: student.rollNumber,
      email: student.email ?? "",
    });

    setEditingStudentId(student.id);
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!classroomId) {
      setError("Please select a classroom first.");
      return;
    }

    const fullName = formData.fullName.trim();
    const rollNumber = formData.rollNumber.trim();
    const email = formData.email.trim();

    if (!fullName || !rollNumber) {
      setError("Student name and roll number are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingStudentId) {
        await updateStudent(editingStudentId, {
          fullName,
          rollNumber,
          email: email || undefined,
        });

        setSuccess("Student updated successfully.");
      } else {
        await createStudent({
          fullName,
          rollNumber,
          classroomId,
          email: email || undefined,
        });

        setSuccess("Student added successfully.");
      }

      resetForm();
      await loadStudents();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    setOpenMenuId(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.fullName}?`
    );

    if (!confirmed) return;

    setDeletingStudentId(student.id);
    setError("");
    setSuccess("");

    try {
      await deleteStudent(student.id);

      setStudents((current) =>
        current.filter((item) => item.id !== student.id)
      );

      setSuccess("Student deleted successfully.");

      if (selectedStudentId === student.id) {
        setSelectedStudentId(null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingStudentId(null);
    }
  };

  const handleRefresh = async () => {
    setError("");
    setSuccess("");
    await loadStudents();
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    student: Student
  ) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedStudentId(student.id);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Page heading */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Students</h2>
          <p className="text-secondary mb-0">
            Manage student records and academic details.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
            onClick={() => void handleRefresh()}
            disabled={loadingStudents || !classroomId}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2"
            onClick={handleAddStudent}
            disabled={!classroomId}
          >
            <Plus size={17} />
            Add Student
          </button>
        </div>
      </div>

      {/* Alerts */}
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
            aria-label="Dismiss message"
            onClick={() => setSuccess("")}
          />
        </div>
      )}

      {/* Classroom and search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <label htmlFor="classroom" className="form-label fw-semibold">
                Classroom
              </label>

              <select
                id="classroom"
                className="form-select"
                value={classroomId}
                disabled={loadingClassrooms}
                onChange={(event) => {
                  setClassroomId(event.target.value);
                  setSearch("");
                  setSuccess("");
                  setError("");
                }}
              >
                <option value="">
                  {loadingClassrooms
                    ? "Loading classrooms..."
                    : "Select a classroom"}
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
            </div>

            <div className="col-12 col-md-7">
              <label htmlFor="studentSearch" className="form-label fw-semibold">
                Search students
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>

                <input
                  id="studentSearch"
                  type="search"
                  className="form-control"
                  placeholder="Search name, roll number, or student ID"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  disabled={!classroomId}
                />

                {search && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student list heading */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-semibold mb-1">
            {selectedClassroom?.name ?? "Student Records"}
          </h5>
          <p className="text-secondary small mb-0">
            {filteredStudents.length}{" "}
            {filteredStudents.length === 1 ? "student" : "students"}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loadingStudents && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5" role="status">
            <div className="spinner-border text-primary mb-3" />
            <p className="text-secondary mb-0">
              Loading student records...
            </p>
          </div>
        </div>
      )}

      {/* No classroom */}
      {!loadingClassrooms && !classroomId && !loadingStudents && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <Users size={32} className="text-secondary mb-3" />
            <h5>No classroom selected</h5>
            <p className="text-secondary mb-0">
              Select a classroom to view student records.
            </p>
          </div>
        </div>
      )}

      {/* Empty results */}
      {!loadingStudents && classroomId && filteredStudents.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <Users size={32} className="text-secondary mb-3" />
            <h5>
              {debouncedSearch ? "No matching students" : "No students found"}
            </h5>
            <p className="text-secondary mb-3">
              {debouncedSearch
                ? "Try another search term."
                : "There are no students in this classroom yet."}
            </p>

            {!debouncedSearch && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddStudent}
              >
                <Plus size={16} className="me-2" />
                Add Student
              </button>
            )}
          </div>
        </div>
      )}

      {/* Student cards */}
      {!loadingStudents && filteredStudents.length > 0 && (
        <div className="row g-3">
          {filteredStudents.map((student) => (
            <div className="col-12 col-md-6 col-xl-4" key={student.id}>
              <div
                className="card h-100 shadow-sm"
                role="button"
                tabIndex={0}
                aria-label={`Student record for ${student.fullName}`}
                onClick={() => setSelectedStudentId(student.id)}
                onKeyDown={(event) => handleCardKeyDown(event, student)}
              >
                <div className="card-body">
                  <div className="d-flex align-items-start gap-3">
                    <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0 fw-bold p-3">
                      {student.fullName
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{student.fullName}</h6>
                      <p className="text-secondary small mb-0">
                        Roll No: {student.rollNumber}
                      </p>
                    </div>

                    {/* Only Edit and Delete in the three-dot menu */}
                    <div
                      className="dropdown"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        aria-label={`Student actions for ${student.fullName}`}
                        aria-expanded={openMenuId === student.id}
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === student.id ? null : student.id
                          )
                        }
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* {openMenuId === student.id && (
                        <div
  className="dropdown-menu dropdown-menu-start show"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="dropdown-item text-danger d-flex align-items-center gap-2"
                            disabled={deletingStudentId === student.id}
                            onClick={() => void handleDeleteStudent(student)}
                          >
                            <Trash2 size={16} />
                            {deletingStudentId === student.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      )} */}
                      {openMenuId === student.id && (
  <div
    className="dropdown-menu show position-absolute"
    style={{
      top: 0,
      right: "100%",
      left: "auto",
      marginRight: "4px",
      marginTop: 0,
    }}
    onClick={(event) => event.stopPropagation()}
  >
    <button
      type="button"
      className="dropdown-item d-flex align-items-center gap-2"
      onClick={() => handleEditStudent(student)}
    >
      <Pencil size={16} />
      Edit
    </button>

    <button
      type="button"
      className="dropdown-item text-danger d-flex align-items-center gap-2"
      disabled={deletingStudentId === student.id}
      onClick={() => void handleDeleteStudent(student)}
    >
      <Trash2 size={16} />
      {deletingStudentId === student.id ? "Deleting..." : "Delete"}
    </button>
  </div>
)}
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex align-items-start gap-2 text-secondary small">
                    <Mail size={16} className="mt-1 flex-shrink-0" />
                    <span className="text-break">
                      {student.email || "No email provided"}
                    </span>
                  </div>
                </div>

                {/* Separate link for opening the details popup */}
                <div className="card-footer bg-body border-0 pt-0 pb-3">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedStudentId(student.id);
                    }}
                  >
                    View Student Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit student modal */}
      {showForm && (
        <>
          <div
            className="modal show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="studentFormTitle"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={(event) => void handleSubmit(event)}>
                  <div className="modal-header">
                    <h5 className="modal-title" id="studentFormTitle">
                      {editingStudentId ? "Edit Student" : "Add Student"}
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={resetForm}
                      disabled={saving}
                    />
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        className="form-control"
                        value={formData.fullName}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            fullName: event.target.value,
                          }))
                        }
                        required
                        autoFocus
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="rollNumber" className="form-label">
                        Roll Number *
                      </label>
                      <input
                        id="rollNumber"
                        className="form-control"
                        value={formData.rollNumber}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            rollNumber: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <label className="form-label">Classroom</label>
                    <input
                      className="form-control"
                      value={selectedClassroom?.name ?? ""}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : editingStudentId ? (
                        "Save Changes"
                      ) : (
                        "Add Student"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop show"
            onClick={() => {
              if (!saving) resetForm();
            }}
          />
        </>
      )}

      {/* Existing StudentDetails component inside the details popup */}
      {selectedStudentId && (
        <>
          <div
            className="modal show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="studentDetailsTitle"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedStudentId(null);
              }
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="studentDetailsTitle">
                    Student Details
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close student details"
                    onClick={() => setSelectedStudentId(null)}
                  />
                </div>

                <div className="modal-body">
                  <StudentDetails
                    studentId={selectedStudentId}
                    embedded
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop show"
            onClick={() => setSelectedStudentId(null)}
          />
        </>
      )}
    </div>
  );
}
// -------------------------------------------------------------------------------

