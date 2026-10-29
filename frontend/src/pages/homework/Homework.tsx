
// // import { useCallback, useEffect, useState } from 'react'
// // import {
// //   BookOpen,
// //   CalendarDays,
// //   Plus,
// //   RefreshCw,
// // //   Trash2,
// // } from 'lucide-react'

// // import {
// //   createHomework,
// //   getHomeworkByClassroom,
// //   type Homework as HomeworkType,
// // } from '../../services/homework.service'
// // import { getClassrooms } from '../../services/classroom.service'
// // import type { Classroom } from '../../services/classroom.service'
// // import { getApiError } from '../../services/getApiError'
// // import { useAuth } from '../../context/AuthContext'

// // export default function Homework() {
// //   const { user } = useAuth()

// //   const [classrooms, setClassrooms] = useState<Classroom[]>([])
// //   const [selectedClassroomId, setSelectedClassroomId] = useState('')
// //   const [homework, setHomework] = useState<HomeworkType[]>([])

// //   const [title, setTitle] = useState('')
// //   const [description, setDescription] = useState('')
// //   const [dueDate, setDueDate] = useState('')

// //   const [loadingClassrooms, setLoadingClassrooms] = useState(true)
// //   const [loadingHomework, setLoadingHomework] = useState(false)
// //   const [creating, setCreating] = useState(false)
// //   const [showForm, setShowForm] = useState(false)

// //   const [error, setError] = useState('')
// //   const [success, setSuccess] = useState('')

// //   const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER'

// //   useEffect(() => {
// //     let cancelled = false

// //     async function loadClassrooms() {
// //       try {
// //         setLoadingClassrooms(true)
// //         setError('')

// //         const result = await getClassrooms()

// //         if (!cancelled) {
// //           setClassrooms(result)
// //           setSelectedClassroomId((current) => {
// //             if (current && result.some((item) => item.id === current)) {
// //               return current
// //             }

// //             return result[0]?.id ?? ''
// //           })
// //         }
// //       } catch (err) {
// //         if (!cancelled) {
// //           setError(getApiError(err, 'Failed to load classrooms.'))
// //         }
// //       } finally {
// //         if (!cancelled) {
// //           setLoadingClassrooms(false)
// //         }
// //       }
// //     }

// //     void loadClassrooms()

// //     return () => {
// //       cancelled = true
// //     }
// //   }, [])

// //   const loadHomework = useCallback(async () => {
// //     if (!selectedClassroomId) {
// //       setHomework([])
// //       setLoadingHomework(false)
// //       return
// //     }

// //     setLoadingHomework(true)
// //     setError('')

// //     try {
// //       const result = await getHomeworkByClassroom(
// //         selectedClassroomId,
// //       )
// //       setHomework(result)
// //     } catch (err) {
// //       setHomework([])
// //       setError(getApiError(err, 'Failed to load homework.'))
// //     } finally {
// //       setLoadingHomework(false)
// //     }
// //   }, [selectedClassroomId])

// //   useEffect(() => {
// //     let cancelled = false

// //     async function load() {
// //       if (!selectedClassroomId) {
// //         setHomework([])
// //         setLoadingHomework(false)
// //         return
// //       }

// //       setLoadingHomework(true)
// //       setError('')

// //       try {
// //         const result = await getHomeworkByClassroom(
// //           selectedClassroomId,
// //         )

// //         if (!cancelled) {
// //           setHomework(result)
// //         }
// //       } catch (err) {
// //         if (!cancelled) {
// //           setHomework([])
// //           setError(getApiError(err, 'Failed to load homework.'))
// //         }
// //       } finally {
// //         if (!cancelled) {
// //           setLoadingHomework(false)
// //         }
// //       }
// //     }

// //     void load()

// //     return () => {
// //       cancelled = true
// //     }
// //   }, [selectedClassroomId])

// //   async function handleCreateHomework(
// //     event: React.FormEvent<HTMLFormElement>,
// //   ) {
// //     event.preventDefault()
// //     setError('')
// //     setSuccess('')

// //     if (!selectedClassroomId) {
// //       setError('Please select a classroom first.')
// //       return
// //     }

// //     if (!title.trim()) {
// //       setError('Homework title is required.')
// //       return
// //     }

// //     try {
// //       setCreating(true)

// //        await createHomework({
// //   title: title.trim(),
// //   description: description.trim() || undefined,
// //   dueDate: dueDate
// //     ? new Date(`${dueDate}T00:00:00.000Z`).toISOString()
// //     : undefined,
// //   classroomId: selectedClassroomId,
// // })
// //       setTitle('')
// //       setDescription('')
// //       setDueDate('')
// //       setShowForm(false)
// //       setSuccess('Homework created successfully.')

// //       await loadHomework()
// //     } catch (err) {
// //       setError(getApiError(err, 'Failed to create homework.'))
// //     } finally {
// //       setCreating(false)
// //     }
// //   }

// //   // FUTURE FEATURE — there is no backend DELETE homework route yet.
// //   // Add the handler when the backend endpoint has been implemented.
// //   //
// //   // async function handleDeleteHomework(homeworkId: string) {
// //   //   await deleteHomework(homeworkId)
// //   //   await loadHomework()
// //   // }

// //   const selectedClassroom = classrooms.find(
// //     (item) => item.id === selectedClassroomId,
// //   )

// //   return (
// //     <div className="container-fluid py-3 py-md-4">
// //       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
// //         <div>
// //           <h2 className="fw-bold mb-1">Homework</h2>
// //           <p className="text-secondary mb-0">
// //             Create and manage classroom assignments.
// //           </p>
// //         </div>

// //         <div className="d-flex gap-2">
// //           <button
// //             type="button"
// //             className="btn btn-outline-secondary"
// //             onClick={() => void loadHomework()}
// //             disabled={loadingHomework || !selectedClassroomId}
// //           >
// //             <RefreshCw size={16} className="me-2" />
// //             Refresh
// //           </button>

// //           {canManage && (
// //             <button
// //               type="button"
// //               className="btn btn-primary"
// //               onClick={() => {
// //                 setError('')
// //                 setSuccess('')
// //                 setShowForm((current) => !current)
// //               }}
// //               disabled={!selectedClassroomId}
// //             >
// //               <Plus size={17} className="me-1" />
// //               Add Homework
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {error && (
// //         <div className="alert alert-danger" role="alert">
// //           {error}
// //         </div>
// //       )}

// //       {success && (
// //         <div className="alert alert-success" role="status">
// //           {success}
// //         </div>
// //       )}

// //       <div className="card border-0 shadow-sm mb-4">
// //         <div className="card-body">
// //           <label
// //             htmlFor="homework-classroom"
// //             className="form-label fw-semibold"
// //           >
// //             Select classroom
// //           </label>

// //           <select
// //             id="homework-classroom"
// //             className="form-select"
// //             value={selectedClassroomId}
// //             disabled={loadingClassrooms}
// //             onChange={(event) => {
// //               setSelectedClassroomId(event.target.value)
// //               setSuccess('')
// //               setError('')
// //             }}
// //           >
// //             <option value="">
// //               {loadingClassrooms
// //                 ? 'Loading classrooms...'
// //                 : 'Choose a classroom'}
// //             </option>

// //             {classrooms.map((classroom) => (
// //               <option key={classroom.id} value={classroom.id}>
// //                 {classroom.name} — Grade {classroom.gradeLevel}
// //                 {classroom.section ? ` (${classroom.section})` : ''}
// //               </option>
// //             ))}
// //           </select>

// //           {!loadingClassrooms && classrooms.length === 0 && (
// //             <p className="text-secondary small mt-2 mb-0">
// //               No classrooms found. Create a classroom before adding homework.
// //             </p>
// //           )}
// //         </div>
// //       </div>

// //       {showForm && canManage && (
// //         <div className="card border-0 shadow-sm mb-4">
// //           <div className="card-header bg-white py-3">
// //             <h5 className="mb-0 fw-semibold">Create Homework</h5>
// //           </div>

// //           <div className="card-body">
// //             <form onSubmit={handleCreateHomework}>
// //               <div className="mb-3">
// //                 <label htmlFor="homework-title" className="form-label">
// //                   Title <span className="text-danger">*</span>
// //                 </label>
// //                 <input
// //                   id="homework-title"
// //                   className="form-control"
// //                   value={title}
// //                   onChange={(event) => setTitle(event.target.value)}
// //                   placeholder="Enter homework title"
// //                   maxLength={200}
// //                   required
// //                 />
// //               </div>

// //               <div className="mb-3">
// //                 <label
// //                   htmlFor="homework-description"
// //                   className="form-label"
// //                 >
// //                   Description
// //                 </label>
// //                 <textarea
// //                   id="homework-description"
// //                   className="form-control"
// //                   rows={3}
// //                   value={description}
// //                   onChange={(event) => setDescription(event.target.value)}
// //                   placeholder="Add instructions or details"
// //                 />
// //               </div>

// //               <div className="mb-3">
// //                 <label htmlFor="homework-due-date" className="form-label">
// //                   Due date
// //                 </label>
// //                 <input
// //                   id="homework-due-date"
// //                   type="date"
// //                   className="form-control"
// //                   value={dueDate}
// //                   onChange={(event) => setDueDate(event.target.value)}
// //                 />
// //               </div>

// //               <div className="d-flex justify-content-end gap-2">
// //                 <button
// //                   type="button"
// //                   className="btn btn-outline-secondary"
// //                   onClick={() => setShowForm(false)}
// //                   disabled={creating}
// //                 >
// //                   Cancel
// //                 </button>

// //                 <button
// //                   type="submit"
// //                   className="btn btn-primary"
// //                   disabled={creating || !selectedClassroomId}
// //                 >
// //                   {creating ? 'Creating...' : 'Create Homework'}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <div>
// //           <h5 className="fw-bold mb-1">Assignments</h5>
// //           <p className="text-secondary small mb-0">
// //             {selectedClassroom?.name ?? 'No classroom selected'}
// //           </p>
// //         </div>

// //         {!loadingHomework && (
// //           <span className="badge text-bg-light border">
// //             {homework.length} assignment{homework.length === 1 ? '' : 's'}
// //           </span>
// //         )}
// //       </div>

// //       {loadingHomework ? (
// //         <div className="card border-0 shadow-sm">
// //           <div className="card-body text-center py-5">
// //             <div className="spinner-border text-primary mb-3" role="status">
// //               <span className="visually-hidden">Loading...</span>
// //             </div>
// //             <p className="text-secondary mb-0">Loading homework...</p>
// //           </div>
// //         </div>
// //       ) : homework.length === 0 ? (
// //         <div className="card border-0 shadow-sm">
// //           <div className="card-body text-center py-5">
// //             <BookOpen size={36} className="text-secondary mb-3" />
// //             <h5>No homework yet</h5>
// //             <p className="text-secondary mb-0">
// //               {selectedClassroomId
// //                 ? 'There are no assignments for this classroom yet.'
// //                 : 'Select a classroom to view its assignments.'}
// //             </p>
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="row g-3">
// //           {homework.map((item) => (
// //             <div className="col-12 col-lg-6 col-xl-4" key={item.id}>
// //               <div className="card h-100 border-0 shadow-sm">
// //                 <div className="card-body d-flex flex-column">
// //                   <div className="d-flex justify-content-between gap-2 mb-3">
// //                     <div className="rounded-3 bg-primary-subtle text-primary p-2">
// //                       <BookOpen size={21} />
// //                     </div>

// //                     {/* FUTURE FEATURE — no DELETE route exists yet.
// //                         Uncomment a delete button only after the backend supports it. */}
// //                     {/*
// //                     <button
// //                       type="button"
// //                       className="btn btn-sm btn-outline-danger"
// //                       onClick={() => handleDeleteHomework(item.id)}
// //                       aria-label={`Delete ${item.title}`}
// //                     >
// //                       <Trash2 size={16} />
// //                     </button>
// //                     */}
// //                   </div>

// //                   <h5 className="fw-semibold">{item.title}</h5>

// //                   <p className="text-secondary flex-grow-1 mb-3">
// //                     {item.description || 'No description provided.'}
// //                   </p>

// //                   <div className="d-flex align-items-center gap-2 text-secondary small">
// //                     <CalendarDays size={16} />
// //                     <span>
// //                       {item.dueDate
// //                         ? `Due ${new Date(item.dueDate).toLocaleDateString()}`
// //                         : 'No due date'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
// // -------------------------------------------------------


// import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
// import {
//   BookOpen,
//   CalendarDays,
//   Plus,
//   RefreshCw,
//   Pencil,
//   Trash2,
//   X,
// } from 'lucide-react'

// import {
//   createHomework,
//   getHomeworkByClassroom,
//   updateHomework,
//   deleteHomework,
// } from '../../services/homework.service'
// import type {
//   Homework as HomeworkType,
//   CreateHomeworkInput,
//   UpdateHomeworkInput,
// } from '../../services/homework.service'
// import { getClassrooms } from '../../services/classroom.service'
// import type { Classroom } from '../../services/classroom.service'
// import { getApiError } from '../../services/getApiError'
// import { useAuth } from '../../context/AuthContext'

// function formatDateForInput(dateValue?: string | null): string {
//   if (!dateValue) return ''

//   const date = new Date(dateValue)

//   if (Number.isNaN(date.getTime())) return ''

//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const day = String(date.getDate()).padStart(2, '0')

//   return `${year}-${month}-${day}`
// }

// function formatDateForDisplay(dateValue?: string | null): string {
//   if (!dateValue) return 'No due date'

//   const date = new Date(dateValue)

//   if (Number.isNaN(date.getTime())) return 'No due date'

//   return `Due ${date.toLocaleDateString()}`
// }

// export default function Homework() {
//   const { user } = useAuth()

//   const canManage =
//     user?.role === 'ADMIN' || user?.role === 'TEACHER'

//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [selectedClassroomId, setSelectedClassroomId] = useState('')
//   const [homework, setHomework] = useState<HomeworkType[]>([])

//   const [editingHomework, setEditingHomework] =
//     useState<HomeworkType | null>(null)

//   const [title, setTitle] = useState('')
//   const [description, setDescription] = useState('')
//   const [dueDate, setDueDate] = useState('')

//   const [loadingClassrooms, setLoadingClassrooms] = useState(true)
//   const [loadingHomework, setLoadingHomework] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [deletingHomeworkId, setDeletingHomeworkId] =
//     useState<string | null>(null)
//   const [showForm, setShowForm] = useState(false)

//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   // Prevent an older classroom request from replacing newer results.
//   const homeworkRequestId = useRef(0)

//   const selectedClassroom = classrooms.find(
//     (item) => item.id === selectedClassroomId,
//   )

//   function resetForm() {
//     setTitle('')
//     setDescription('')
//     setDueDate('')
//     setEditingHomework(null)
//     setShowForm(false)
//   }

//   function startCreating() {
//     resetForm()
//     setError('')
//     setSuccess('')
//     setShowForm(true)
//   }

//   function startEditing(item: HomeworkType) {
//     setEditingHomework(item)
//     setTitle(item.title)
//     setDescription(item.description ?? '')
//     setDueDate(formatDateForInput(item.dueDate))
//     setShowForm(true)
//     setError('')
//     setSuccess('')
//   }

//   const loadHomework = useCallback(async () => {
//     const requestId = ++homeworkRequestId.current

//     if (!selectedClassroomId) {
//       setHomework([])
//       setLoadingHomework(false)
//       return
//     }

//     setLoadingHomework(true)
//     setError('')

//     try {
//       const result = await getHomeworkByClassroom(
//         selectedClassroomId,
//       )

//       if (requestId === homeworkRequestId.current) {
//         setHomework(result)
//       }
//     } catch (err) {
//       if (requestId === homeworkRequestId.current) {
//         setHomework([])
//         setError(getApiError(err, 'Failed to load homework.'))
//       }
//     } finally {
//       if (requestId === homeworkRequestId.current) {
//         setLoadingHomework(false)
//       }
//     }
//   }, [selectedClassroomId])

//   // Load classrooms once.
//   useEffect(() => {
//     let cancelled = false

//     async function loadClassrooms() {
//       setLoadingClassrooms(true)

//       try {
//         const result = await getClassrooms()

//         if (cancelled) return

//         setClassrooms(result)
//         setSelectedClassroomId((current) => {
//           if (current && result.some((item) => item.id === current)) {
//             return current
//           }

//           return result[0]?.id ?? ''
//         })
//       } catch (err) {
//         if (!cancelled) {
//           setError(getApiError(err, 'Failed to load classrooms.'))
//         }
//       } finally {
//         if (!cancelled) {
//           setLoadingClassrooms(false)
//         }
//       }
//     }

//     void loadClassrooms()

//     return () => {
//       cancelled = true
//     }
//   }, [])

//   // Reload assignments when the selected classroom changes.
//   // useEffect(() => {
//   //   void loadHomework()

//   //   return () => {
//   //     // Invalidate an outstanding request when the classroom changes.
//   //     homeworkRequestId.current += 1
//   //   }
//   // }, [loadHomework])
//  useEffect(() => {
//   if (!selectedClassroomId) {
//     return;
//   }

//   let cancelled = false;

//   const fetchHomework = async () => {
//     setLoadingHomework(true);
//     setError("");

//     try {
//       const result = await getHomeworkByClassroom(
//         selectedClassroomId
//       );

//       if (!cancelled) {
//         setHomework(result);
//       }
//     } catch (error: unknown) {
//       if (!cancelled) {
//         setHomework([]);
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Failed to load homework."
//         );
//       }
//     } finally {
//       if (!cancelled) {
//         setLoadingHomework(false);
//       }
//     }
//   };

//   void fetchHomework();

//   return () => {
//     cancelled = true;
//   };
// }, [selectedClassroomId, refreshKey]);

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()

//     if (!canManage) {
//       setError('You do not have permission to manage homework.')
//       return
//     }

//     if (!selectedClassroomId) {
//       setError('Please select a classroom first.')
//       return
//     }

//     const trimmedTitle = title.trim()
//     const trimmedDescription = description.trim()

//     if (trimmedTitle.length < 2) {
//       setError('Homework title must contain at least 2 characters.')
//       return
//     }

//     if (trimmedTitle.length > 150) {
//       setError('Homework title cannot exceed 150 characters.')
//       return
//     }

//     if (trimmedDescription.length > 2000) {
//       setError('Description cannot exceed 2000 characters.')
//       return
//     }

//     let isoDueDate: string | undefined

//     if (dueDate) {
//       const parsedDate = new Date(`${dueDate}T00:00:00.000Z`)

//       if (
//         Number.isNaN(parsedDate.getTime()) ||
//         parsedDate.toISOString().slice(0, 10) !== dueDate
//       ) {
//         setError('Please enter a valid due date.')
//         return
//       }

//       isoDueDate = parsedDate.toISOString()
//     }

//     const wasEditing = Boolean(editingHomework)
//     const classroomId = selectedClassroomId

//     setSaving(true)
//     setError('')
//     setSuccess('')

//     try {
//       if (editingHomework) {
//         const input: UpdateHomeworkInput = {
//           title: trimmedTitle,
//           description: trimmedDescription,
//           // null explicitly clears an existing due date.
//           dueDate: isoDueDate ?? null,
//         }

//         await updateHomework(editingHomework.id, input)
//       } else {
//         const input: CreateHomeworkInput = {
//           title: trimmedTitle,
//           classroomId,
//           ...(trimmedDescription
//             ? { description: trimmedDescription }
//             : {}),
//           ...(isoDueDate ? { dueDate: isoDueDate } : {}),
//         }

//         await createHomework(input)
//       }

//       resetForm()

//       setSuccess(
//         wasEditing
//           ? 'Homework updated successfully.'
//           : 'Homework created successfully.',
//       )

//       // Reload the selected classroom's assignments.
//       try {
//         const result = await getHomeworkByClassroom(classroomId)

//         if (classroomId === selectedClassroomId) {
//           setHomework(result)
//         }
//       } catch {
//         setError(
//           wasEditing
//             ? 'Homework updated, but the list could not be refreshed. Use Refresh to try again.'
//             : 'Homework created, but the list could not be refreshed. Use Refresh to try again.',
//         )
//       }
//     } catch (err) {
//       setError(
//         getApiError(
//           err,
//           wasEditing
//             ? 'Failed to update homework.'
//             : 'Failed to create homework.',
//         ),
//       )
//     } finally {
//       setSaving(false)
//     }
//   }

//   async function handleDeleteHomework(item: HomeworkType) {
//     if (!canManage) {
//       setError('You do not have permission to delete homework.')
//       return
//     }

//     if (!item.id) {
//       setError('Cannot delete this homework because its ID is missing.')
//       return
//     }

//     if (deletingHomeworkId) return

//     const confirmed = window.confirm(
//       `Delete "${item.title}"? This action cannot be undone.`,
//     )

//     if (!confirmed) return

//     const classroomId = selectedClassroomId

//     setDeletingHomeworkId(item.id)
//     setError('')
//     setSuccess('')

//     try {
//       await deleteHomework(item.id)

//       setHomework((current) =>
//         current.filter((homeworkItem) => homeworkItem.id !== item.id),
//       )

//       if (editingHomework?.id === item.id) {
//         resetForm()
//       }

//       setSuccess('Homework deleted successfully.')

//       // Refresh from the server to keep the list consistent.
//       try {
//         const result = await getHomeworkByClassroom(classroomId)

//         if (classroomId === selectedClassroomId) {
//           setHomework(result)
//         }
//       } catch {
//         // The deleted item is already removed from the local list.
//         // The Refresh button can retry loading server data.
//       }
//     } catch (err) {
//       setError(getApiError(err, 'Failed to delete homework.'))
//     } finally {
//       setDeletingHomeworkId(null)
//     }
//   }

//   return (
//     <div className="container-fluid py-3 py-md-4">
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <h2 className="fw-bold mb-1">Homework</h2>
//           <p className="text-secondary mb-0">
//             Create and manage classroom assignments.
//           </p>
//         </div>

//         <div className="d-flex gap-2">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={() => void loadHomework()}
//             disabled={loadingHomework || !selectedClassroomId}
//           >
//             <RefreshCw size={16} className="me-2" />
//             Refresh
//           </button>

//           {canManage && (
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={startCreating}
//               disabled={
//                 !selectedClassroomId ||
//                 saving ||
//                 Boolean(deletingHomeworkId)
//               }
//             >
//               <Plus size={17} className="me-1" />
//               Add Homework
//             </button>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="alert alert-success" role="status">
//           {success}
//         </div>
//       )}

//       {/* Classroom selector */}
//       <div className="card border-0 shadow-sm mb-4">
//         <div className="card-body">
//           <label
//             htmlFor="homework-classroom"
//             className="form-label fw-semibold"
//           >
//             Select classroom
//           </label>

//           <select
//             id="homework-classroom"
//             className="form-select"
//             value={selectedClassroomId}
//             disabled={loadingClassrooms || saving || Boolean(deletingHomeworkId)}
//             onChange={(event) => {
//               setSelectedClassroomId(event.target.value)
//               resetForm()
//               setError('')
//               setSuccess('')
//             }}
//           >
//             <option value="">
//               {loadingClassrooms
//                 ? 'Loading classrooms...'
//                 : 'Choose a classroom'}
//             </option>

//             {classrooms.map((classroom) => (
//               <option key={classroom.id} value={classroom.id}>
//                 {classroom.name} — Grade {classroom.gradeLevel}
//                 {classroom.section ? ` (${classroom.section})` : ''}
//               </option>
//             ))}
//           </select>

//           {!loadingClassrooms && classrooms.length === 0 && (
//             <p className="text-secondary small mt-2 mb-0">
//               No classrooms found. Create a classroom before adding homework.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Create and edit form */}
//       {showForm && canManage && (
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 fw-semibold">
//               {editingHomework ? 'Edit Homework' : 'Create Homework'}
//             </h5>

//             <button
//               type="button"
//               className="btn btn-sm btn-outline-secondary"
//               aria-label="Close homework form"
//               onClick={() => {
//                 resetForm()
//                 setError('')
//                 setSuccess('')
//               }}
//               disabled={saving}
//             >
//               <X size={16} />
//             </button>
//           </div>

//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label htmlFor="homework-title" className="form-label">
//                   Title <span className="text-danger">*</span>
//                 </label>

//                 <input
//                   id="homework-title"
//                   className="form-control"
//                   value={title}
//                   onChange={(event) => setTitle(event.target.value)}
//                   placeholder="Enter homework title"
//                   minLength={2}
//                   maxLength={150}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label
//                   htmlFor="homework-description"
//                   className="form-label"
//                 >
//                   Description
//                 </label>

//                 <textarea
//                   id="homework-description"
//                   className="form-control"
//                   rows={3}
//                   value={description}
//                   onChange={(event) => setDescription(event.target.value)}
//                   placeholder="Add instructions or details"
//                   maxLength={2000}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label
//                   htmlFor="homework-due-date"
//                   className="form-label"
//                 >
//                   Due date
//                 </label>

//                 <input
//                   id="homework-due-date"
//                   type="date"
//                   className="form-control"
//                   value={dueDate}
//                   onChange={(event) => setDueDate(event.target.value)}
//                 />
//               </div>

//               <div className="d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     resetForm()
//                     setError('')
//                     setSuccess('')
//                   }}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={
//                     saving ||
//                     !selectedClassroomId ||
//                     Boolean(deletingHomeworkId)
//                   }
//                 >
//                   {saving
//                     ? 'Saving...'
//                     : editingHomework
//                       ? 'Update Homework'
//                       : 'Create Homework'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Assignment list */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h5 className="fw-bold mb-1">Assignments</h5>
//           <p className="text-secondary small mb-0">
//             {selectedClassroom?.name ?? 'No classroom selected'}
//           </p>
//         </div>

//         {!loadingHomework && (
//           <span className="badge text-bg-light border">
//             {homework.length} assignment
//             {homework.length === 1 ? '' : 's'}
//           </span>
//         )}
//       </div>

//       {loadingHomework ? (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body text-center py-5">
//             <div
//               className="spinner-border text-primary mb-3"
//               role="status"
//               aria-label="Loading homework"
//             />

//             <p className="text-secondary mb-0">
//               Loading homework...
//             </p>
//           </div>
//         </div>
//       ) : homework.length === 0 ? (
//         <div className="card border-0 shadow-sm">
//           <div className="card-body text-center py-5">
//             <BookOpen size={36} className="text-secondary mb-3" />
//             <h5>No homework yet</h5>

//             <p className="text-secondary mb-0">
//               {selectedClassroomId
//                 ? 'There are no assignments for this classroom yet.'
//                 : 'Select a classroom to view its assignments.'}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="row g-3">
//           {homework.map((item) => (
//             <div className="col-12 col-lg-6 col-xl-4" key={item.id}>
//               <div className="card h-100 border-0 shadow-sm">
//                 <div className="card-body d-flex flex-column">
//                   <div className="d-flex justify-content-between gap-2 mb-3">
//                     <div className="rounded-3 bg-primary-subtle text-primary p-2">
//                       <BookOpen size={21} />
//                     </div>

//                     {canManage && (
//                       <div className="d-flex gap-2">
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary"
//                           title="Edit homework"
//                           aria-label={`Edit ${item.title}`}
//                           onClick={() => startEditing(item)}
//                           disabled={
//                             saving || Boolean(deletingHomeworkId)
//                           }
//                         >
//                           <Pencil size={15} />
//                         </button>

//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-danger"
//                           title="Delete homework"
//                           aria-label={`Delete ${item.title}`}
//                           onClick={() => void handleDeleteHomework(item)}
//                           disabled={
//                             saving || Boolean(deletingHomeworkId)
//                           }
//                         >
//                           {deletingHomeworkId === item.id ? (
//                             <span
//                               className="spinner-border spinner-border-sm"
//                               role="status"
//                               aria-label="Deleting homework"
//                             />
//                           ) : (
//                             <Trash2 size={15} />
//                           )}
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <h5 className="fw-semibold">{item.title}</h5>

//                   <p className="text-secondary flex-grow-1 mb-3">
//                     {item.description || 'No description provided.'}
//                   </p>

//                   <div className="d-flex align-items-center gap-2 text-secondary small">
//                     <CalendarDays size={16} />
//                     <span>{formatDateForDisplay(item.dueDate)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
// -----------------------------------------------


import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import {
  BookOpen,
  CalendarDays,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  MoreVertical,
} from "lucide-react";

import {
  createHomework,
  getHomeworkByClassroom,
  updateHomework,
  deleteHomework,
  type Homework as HomeworkType,
} from "../../services/homework.service";

import {
  getClassrooms,
  type Classroom,
} from "../../services/classroom.service";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function toDateInputValue(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDueDate(value?: string | null): string {
  if (!value) {
    return "No due date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid due date";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCurrentUserRole(): string {
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user: unknown = JSON.parse(storedUser);

      if (typeof user === "object" && user !== null && "role" in user) {
        const role = (user as { role?: unknown }).role;

        if (typeof role === "string") {
          return role.toUpperCase();
        }
      }
    }
  } catch {
    // Ignore malformed local user data.
  }

  return (localStorage.getItem("role") ?? "").toUpperCase();
}

export default function Homework() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const classroomIdFromUrl = searchParams.get("classroomId");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [homework, setHomework] = useState<HomeworkType[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editingHomework, setEditingHomework] =
    useState<HomeworkType | null>(null);

  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [loadingHomework, setLoadingHomework] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingHomeworkId, setDeletingHomeworkId] = useState<string | null>(
    null
  );

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const role = getCurrentUserRole();
  const canManage = role === "ADMIN" || role === "TEACHER";

  //To synchronize it, add this effect 
  useEffect(() => {
    if (!selectedClassroomId) return;

    if (searchParams.get("classroomId") === selectedClassroomId) {
      return;
    }

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("classroomId", selectedClassroomId);
      return nextParams;
    }, { replace: true });
  }, [selectedClassroomId, searchParams, setSearchParams]);



  const handleViewSubmissions = (homeworkId: string) => {
    navigate(
      `/submissions?classroomId=${encodeURIComponent(
        selectedClassroomId,
      )}&homeworkId=${encodeURIComponent(homeworkId)}`,
    );
  };

  // Load classrooms.
  useEffect(() => {
    let cancelled = false;

    async function fetchClassrooms() {
      try {
        const result = await getClassrooms();

        if (cancelled) {
          return;
        }

        setClassrooms(result);

        // setSelectedClassroomId((currentId) => {
        //   if (currentId && result.some((item) => item.id === currentId)) {
        //     return currentId;
        //   }

        //   return result[0]?.id ?? "";
        // });
        setSelectedClassroomId((currentId) => {
          if (
            classroomIdFromUrl &&
            result.some((item) => item.id === classroomIdFromUrl)
          ) {
            return classroomIdFromUrl;
          }

          if (currentId && result.some((item) => item.id === currentId)) {
            return currentId;
          }

          return result[0]?.id ?? "";
        });

      } catch (requestError: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setLoadingClassrooms(false);
        }
      }
    }

    void fetchClassrooms();

    return () => {
      cancelled = true;
    };
  }, [classroomIdFromUrl]);

  // Load homework whenever the selected classroom or refresh key changes.
  // No synchronous state updates are performed in the effect body.
  useEffect(() => {
    if (!selectedClassroomId) {
      return;
    }

    let cancelled = false;

    async function fetchHomework() {
      setLoadingHomework(true);
      setError("");

      try {
        const result = await getHomeworkByClassroom(selectedClassroomId);

        if (!cancelled) {
          setHomework(result);
        }
      } catch (requestError: unknown) {
        if (!cancelled) {
          setHomework([]);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setLoadingHomework(false);
        }
      }
    }

    void fetchHomework();

    return () => {
      cancelled = true;
    };
  }, [selectedClassroomId, refreshKey]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingHomework(null);
    setShowForm(false);
  }, []);

  // function handleClassroomChange(value: string) {
  //   setSelectedClassroomId(value);
  //   setHomework([]);
  //   setError("");
  //   setSuccess("");
  //   resetForm();
  // }
  function handleClassroomChange(value: string) {
    setSelectedClassroomId(value);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (value) {
        nextParams.set("classroomId", value);
      } else {
        nextParams.delete("classroomId");
      }

      return nextParams;
    });

    setHomework([]);
    setError("");
    setSuccess("");
    resetForm();
  }

  function startCreating() {
    setError("");
    setSuccess("");
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingHomework(null);
    setShowForm(true);
  }

  function startEditing(item: HomeworkType) {
    setError("");
    setSuccess("");
    setEditingHomework(item);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setDueDate(toDateInputValue(item.dueDate));
    setShowForm(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManage) {
      setError("You do not have permission to manage homework.");
      return;
    }

    if (!selectedClassroomId) {
      setError("Please select a classroom first.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < 2 || trimmedTitle.length > 150) {
      setError("The title must contain between 2 and 150 characters.");
      return;
    }

    if (trimmedDescription.length > 2000) {
      setError("The description cannot exceed 2000 characters.");
      return;
    }

    let dueDateIso: string | undefined;

    if (dueDate) {
      const parsedDate = new Date(`${dueDate}T00:00:00`);

      if (Number.isNaN(parsedDate.getTime())) {
        setError("Please enter a valid due date.");
        return;
      }

      dueDateIso = parsedDate.toISOString();
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingHomework) {
        await updateHomework(editingHomework.id, {
          title: trimmedTitle,
          description: trimmedDescription || null,
          dueDate: dueDateIso ?? null,
        });

        setSuccess("Homework updated successfully.");
      } else {
        await createHomework({
          title: trimmedTitle,
          description: trimmedDescription || undefined,
          dueDate: dueDateIso,
          classroomId: selectedClassroomId,
        });

        setSuccess("Homework created successfully.");
      }

      resetForm();
      setRefreshKey((previous) => previous + 1);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: HomeworkType) {
    if (!canManage) {
      setError("You do not have permission to delete homework.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingHomeworkId(item.id);
    setError("");
    setSuccess("");

    try {
      await deleteHomework(item.id);

      setHomework((current) =>
        current.filter((entry) => entry.id !== item.id)
      );

      if (editingHomework?.id === item.id) {
        resetForm();
      }

      setSuccess("Homework deleted successfully.");
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingHomeworkId(null);
    }
  }

  const selectedClassroom = classrooms.find(
    (classroom) => classroom.id === selectedClassroomId
  );

  return (
    <div className="container-fluid py-4">
      {/* Page header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <BookOpen size={27} className="me-2" />
            Homework
          </h2>
          <p className="text-muted mb-0">
            Manage and review classroom assignments.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setRefreshKey((previous) => previous + 1)}
            disabled={!selectedClassroomId || loadingHomework}
          >
            <RefreshCw size={16} className="me-2" />
            Refresh
          </button>

          {canManage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={startCreating}
              disabled={!selectedClassroomId}
            >
              <Plus size={17} className="me-1" />
              Add Homework
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
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

      {/* Classroom selector */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <label htmlFor="homework-classroom" className="form-label fw-semibold">
            Select Classroom
          </label>

          <select
            id="homework-classroom"
            className="form-select"
            value={selectedClassroomId}
            disabled={loadingClassrooms}
            onChange={(event) => handleClassroomChange(event.target.value)}
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
                {classroom.section ? ` (${classroom.section})` : ""}
              </option>
            ))}
          </select>

          {!loadingClassrooms && classrooms.length === 0 && (
            <p className="text-muted small mt-2 mb-0">
              No classrooms are available for your account.
            </p>
          )}

          {selectedClassroom && (
            <div className="text-muted small mt-2">
              {selectedClassroom.academicYear
                ? `Academic year: ${selectedClassroom.academicYear}`
                : ""}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit form */}
      {showForm && canManage && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
            <h5 className="mb-0 fw-semibold">
              {editingHomework ? "Edit Homework" : "Create Homework"}
            </h5>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={resetForm}
              disabled={saving}
              aria-label="Close homework form"
            >
              <X size={17} />
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="homework-title" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>

                <input
                  id="homework-title"
                  type="text"
                  className="form-control"
                  placeholder="Enter homework title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  minLength={2}
                  maxLength={150}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="homework-description" className="form-label">
                  Description
                </label>

                <textarea
                  id="homework-description"
                  className="form-control"
                  rows={4}
                  placeholder="Enter homework instructions"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={2000}
                />

                <div className="form-text text-end">
                  {description.length}/2000 characters
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="homework-due-date" className="form-label">
                  Due Date
                </label>

                <input
                  id="homework-due-date"
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !selectedClassroomId}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Saving...
                    </>
                  ) : editingHomework ? (
                    "Update Homework"
                  ) : (
                    "Create Homework"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework list */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h4 className="fw-semibold mb-0">Assignments</h4>

        <span className="badge bg-light text-dark border">
          {homework.length} {homework.length === 1 ? "assignment" : "assignments"}
        </span>
      </div>

      {loadingHomework ? (
        <div className="text-center py-5" role="status">
          <div className="spinner-border text-primary mb-3" aria-hidden="true" />
          <p className="text-muted mb-0">Loading homework...</p>
        </div>
      ) : !selectedClassroomId ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <BookOpen size={38} className="text-muted mb-3" />
            <h5>No classroom selected</h5>
            <p className="text-muted mb-0">
              Select a classroom to view its homework assignments.
            </p>
          </div>
        </div>
      ) : homework.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <BookOpen size={38} className="text-muted mb-3" />
            <h5>No homework found</h5>
            <p className="text-muted mb-3">
              There are no assignments for this classroom yet.
            </p>

            {canManage && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={startCreating}
              >
                <Plus size={17} className="me-1" />
                Create First Assignment
              </button>
            )}
          </div>
        </div>
      ) : (
 
<div className="row g-3">
  {homework.map((item) => (
    <div className="col-12 col-md-6 col-xl-4" key={item.id}>
      <div
        className="card h-100 border-0 shadow-sm"
        role="button"
        tabIndex={0}
        aria-label={`Homework assignment: ${item.title}`}
        onClick={() => handleViewSubmissions(item.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleViewSubmissions(item.id);
          }
        }}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
            <h5 className="card-title fw-semibold mb-0">
              {item.title}
            </h5>

            <div className="d-flex align-items-start gap-2">
              <BookOpen
                size={20}
                className="text-primary flex-shrink-0 mt-1"
              />

              {/* Three-dot menu */}
              {canManage && (
                <div
                  className="dropdown position-relative"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    aria-label={`Homework actions for ${item.title}`}
                    aria-expanded={openMenuId === item.id}
                    disabled={
                      saving || deletingHomeworkId !== null
                    }
                    onClick={() =>
                      setOpenMenuId((current) =>
                        current === item.id ? null : item.id
                      )
                    }
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === item.id && (
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
                        disabled={
                          saving || deletingHomeworkId !== null
                        }
                        onClick={() => {
                          setOpenMenuId(null);
                          startEditing(item);
                        }}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="dropdown-item text-danger d-flex align-items-center gap-2"
                        disabled={
                          saving || deletingHomeworkId !== null
                        }
                        onClick={() => {
                          setOpenMenuId(null);
                          void handleDelete(item);
                        }}
                      >
                        {deletingHomeworkId === item.id ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        {deletingHomeworkId === item.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="card-text text-muted flex-grow-1">
            {item.description?.trim() || "No description provided."}
          </p>

          <div className="small text-muted mb-3">
            <CalendarDays size={15} className="me-2" />
            {formatDueDate(item.dueDate)}
          </div>
        </div>

        {/* Submissions link */}
        <div className="card-footer bg-body border-0 pt-0 pb-3">
          <button
            type="button"
            className="btn btn-link text-decoration-none p-0"
            onClick={(event) => {
              event.stopPropagation();
              handleViewSubmissions(item.id);
            }}
          >
            View Submissions
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


      )}
    </div>
  );
}
