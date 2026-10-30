// import {   useEffect,
//   useState,
//     useRef,
//   type FormEvent,
//   type KeyboardEvent, } from 'react'
// import {
//   Bot,
//   Send,
//   Sparkles,
//   User,
//   Trash2,
//   LoaderCircle,
//   MessageSquare,
// } from 'lucide-react'

// import { useAuth } from '../../context/AuthContext'
// import {
//   getClassrooms,
//   type Classroom,
// } from '../../services/classroom.service'
// import { askAI } from '../../services/ai.service'
// import { getApiError } from '../../services/getApiError'

// interface ChatMessage {
//   id: string
//   role: 'user' | 'assistant'
//   content: string
// }

// const staffSuggestedQuestions = [
//   'List the students in this classroom.',
//   'How can I identify students who need extra support?',
//   'Suggest strategies to improve student performance.',
// ]

// const studentSuggestedQuestions = [
//   'How can I improve my academic performance?',
//   'Give me a study plan to prepare for my next quiz.',
//   'How can I prepare better for my homework and exams?',
// ]

// export default function AIAssistant() {
//   const { user } = useAuth()
// const conversationEndRef = useRef<HTMLDivElement>(null)

//   const isStudent = user?.role === 'STUDENT'

//   const isAdminOrTeacher =
//     user?.role === 'ADMIN' || user?.role === 'TEACHER'

//   const canUseAssistant = isStudent || isAdminOrTeacher

//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [classroomId, setClassroomId] = useState('')
//   const [classroomsLoading, setClassroomsLoading] = useState(true)
//   const [classroomError, setClassroomError] = useState('')

//   const [question, setQuestion] = useState('')
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const suggestedQuestions = isStudent
//     ? studentSuggestedQuestions
//     : staffSuggestedQuestions

//     useEffect(() => {
//   conversationEndRef.current?.scrollIntoView({
//     behavior: 'smooth',
//     block: 'end',
//   })
// }, [messages, loading])

//   useEffect(() => {
//     if (!canUseAssistant) return

//     let active = true

//     async function loadClassrooms() {
//       try {
//         setClassroomError('')

//         const result = await getClassrooms()

//         if (!active) return

//         setClassrooms(result)

//         setClassroomId((current) => {
//           if (current && result.some((item) => item.id === current)) {
//             return current
//           }

//           return result[0]?.id ?? ''
//         })
//       } catch (err) {
//         if (active) {
//           setClassroomError(
//             getApiError(err, 'Unable to load classrooms.'),
//           )
//         }
//       } finally {
//         if (active) {
//           setClassroomsLoading(false)
//         }
//       }
//     }

//     void loadClassrooms()

//     return () => {
//       active = false
//     }
//   }, [canUseAssistant])
// const handleQuestionKeyDown = (
//   event: KeyboardEvent<HTMLTextAreaElement>,
// ) => {
//   if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
//     event.preventDefault()

//     if (
//       question.trim() &&
//       !loading &&
//       !(isAdminOrTeacher && classroomsLoading) &&
//       !(isAdminOrTeacher && !classroomId)
//     ) {
//       event.currentTarget.form?.requestSubmit()
//     }
//   }
// }

//   const handleAsk = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     const trimmedQuestion = question.trim()

//     if (!trimmedQuestion || loading || classroomsLoading) {
//       return
//     }

//     // ADMIN and TEACHER must select a classroom.
//     // STUDENT can ask general questions without a linked classroom.
//     if (isAdminOrTeacher && !classroomId) {
//       setError('Please select a classroom before asking a question.')
//       return
//     }

//     const userMessage: ChatMessage = {
//       id: `${Date.now()}-user`,
//       role: 'user',
//       content: trimmedQuestion,
//     }

//     setMessages((previous) => [...previous, userMessage])
//     setQuestion('')
//     setError('')
//     setLoading(true)

//     try {
//       const result = await askAI({
//         ...(classroomId ? { classroomId } : {}),
//         question: trimmedQuestion,
//       })

//       const assistantMessage: ChatMessage = {
//         id: `${Date.now()}-assistant`,
//         role: 'assistant',
//         content: result.answer,
//       }

//       setMessages((previous) => [...previous, assistantMessage])
//     } catch (err) {
//       setError(
//         getApiError(
//           err,
//           'Unable to get an answer right now. Please try again.',
//         ),
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const clearConversation = () => {
//     if (loading) return

//     setMessages([])
//     setError('')
//     setQuestion('')
//   }

//   if (!canUseAssistant) {
//     return (
//       <div className="container-fluid py-3">
//         <div className="alert alert-warning" role="alert">
//           The AI Assistant is available to students, teachers, and administrators.
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container-fluid py-3">
//       {/* Page heading */}
//       {/* <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"> */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
//         <div>
//           <div className="d-flex align-items-center gap-2 mb-2">
//             <div className="rounded-3 p-2 bg-primary-subtle text-primary">
//               <Bot size={25} />
//             </div>

//             <h1 className="h3 mb-0">AI Assistant</h1>
//           </div>

//           <p className="text-secondary mb-0">
//             {isStudent
//               ? 'Get personalized learning guidance and help with your academic progress.'
//               : 'Get AI-powered guidance for teaching and student performance.'}
//           </p>
//         </div>

//         {messages.length > 0 && (
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={clearConversation}
//             disabled={loading}
//           >
//             <Trash2 size={16} className="me-2" />
//             Clear conversation
//           </button>
//         )}
//       </div>

//       {/* Assistant card */}
//       {/* <div className="card border-0 shadow-sm"> */}
//       <div
//   className="card border-0 shadow-sm"
//   style={{
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: 0,
//   }}
// >
//         <div className="card-header bg-white py-3">
//           <div className="d-flex align-items-center gap-2">
//             <div className="rounded-circle bg-primary-subtle text-primary p-2">
//               <Sparkles size={19} />
//             </div>

//             <div>
//               <h2 className="h6 mb-1">GradeLens AI</h2>
//               <small className="text-secondary">
//                 {isStudent
//                   ? 'Your personal learning assistant'
//                   : 'Classroom-aware AI assistance'}
//               </small>
//             </div>
//           </div>
//         </div>

//         {/* Conversation */}
//         {/* <div
//           className="card-body p-3 p-md-4"
//           style={{ minHeight: '360px' }}
//         > */}
//        <div
//   className="card-body p-3 p-md-4 overflow-y-auto"
//   style={{
//     height: 'min(70vh, 760px)',
//     minHeight: '400px',
//     overflowWrap: 'anywhere',
//     scrollBehavior: 'smooth',
//   }}
// >
//           {messages.length === 0 ? (
//             <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
//               <div className="rounded-circle bg-primary-subtle text-primary p-3 mb-3">
//                 <MessageSquare size={30} />
//               </div>

//               <h2 className="h5 mb-2">
//                 {isStudent
//                   ? 'How can I help you learn today?'
//                   : 'How can I help you today?'}
//               </h2>

//               <p
//                 className="text-secondary mb-4"
//                 style={{ maxWidth: '460px' }}
//               >
//                 {isStudent
//                   ? classroomId
//                     ? 'Ask about your academic progress, quiz results, homework, or ways to improve your learning.'
//                     : 'Ask general questions about GradeLens AI, study strategies, learning, and academic improvement.'
//                   : 'Select a classroom and ask a question about its students, performance, or learning improvement.'}
//               </p>

//               <div
//                 className="d-flex flex-column gap-2 w-100"
//                 style={{ maxWidth: '560px' }}
//               >
//                 {suggestedQuestions.map((suggestion) => (
//                   <button
//                     key={suggestion}
//                     type="button"
//                     className="btn btn-outline-secondary text-start"
//                     onClick={() => setQuestion(suggestion)}
//                     disabled={loading}
//                   >
//                     <Sparkles
//                       size={15}
//                       className="me-2 text-primary"
//                     />
//                     {suggestion}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`d-flex gap-3 ${
//                     message.role === 'user'
//                       ? 'flex-row-reverse'
//                       : 'flex-row'
//                   }`}
//                 >
//                   <div
//                     className={`rounded-circle p-2 flex-shrink-0 ${
//                       message.role === 'user'
//                         ? 'bg-secondary-subtle text-secondary'
//                         : 'bg-primary-subtle text-primary'
//                     }`}
//                     style={{ height: '38px' }}
//                     aria-hidden="true"
//                   >
//                     {message.role === 'user' ? (
//                       <User size={21} />
//                     ) : (
//                       <Bot size={21} />
//                     )}
//                   </div>

//                   <div
//                     className={`rounded-3 px-3 py-3 ${
//                       message.role === 'user'
//                         ? 'bg-primary text-white'
//                         : 'bg-body-tertiary'
//                     }`}
//                     style={{
//                       maxWidth: '85%',
//                       minWidth: 0,
//                       overflowWrap: 'anywhere',
//                     }}
//                   >
//                     <div className="small fw-semibold mb-2">
//                       {message.role === 'user' ? 'You' : 'GradeLens AI'}
//                     </div>

//                     <div
//                       style={{
//                         whiteSpace: 'pre-wrap',
//                         lineHeight: 1.6,
//                       }}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {loading && (
//                 <div className="d-flex align-items-center gap-3">
//                   <div className="rounded-circle bg-primary-subtle text-primary p-2">
//                     <Bot size={21} />
//                   </div>

//                   <div className="bg-body-tertiary rounded-3 px-3 py-3">
//                     <LoaderCircle
//                       size={17}
//                       className="me-2"
//                       style={{
//                         verticalAlign: 'text-bottom',
//                         animation: 'spin 1s linear infinite',
//                       }}
//                     />
//                     <span className="text-secondary">
//                       Generating an answer...
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {error && (
//             <div className="alert alert-danger mt-4 mb-0" role="alert">
//               <div className="fw-semibold mb-1">
//                 Unable to get an answer
//               </div>
//               <div>{error}</div>
//             </div>
//           )}
//           <div ref={conversationEndRef} />
//         </div>

//         {/* Question form */}
       
//         <div
//   className="card-footer bg-white p-2 p-md-3"
//   style={{
//     position: 'sticky',
//     bottom: 0,
//     zIndex: 2,
//     flexShrink: 0,
//   }}
// >
//           <form onSubmit={handleAsk}>
//             {/* Only ADMIN and TEACHER choose a classroom. */}
//             {isAdminOrTeacher && (
//               <div className="mb-3">
//                 <label
//                   htmlFor="ai-classroom"
//                   className="form-label fw-semibold"
//                 >
//                   Select classroom
//                 </label>

//                 <select
//                   id="ai-classroom"
//                   className="form-select"
//                   value={classroomId}
//                   onChange={(event) => setClassroomId(event.target.value)}
//                   disabled={
//                     classroomsLoading ||
//                     loading ||
//                     classrooms.length === 0
//                   }
//                   required
//                 >
//                   <option value="">
//                     {classroomsLoading
//                       ? 'Loading classrooms...'
//                       : 'Choose a classroom'}
//                   </option>

//                   {classrooms.map((classroom) => (
//                     <option key={classroom.id} value={classroom.id}>
//                       {classroom.name} — Grade {classroom.gradeLevel}
//                       {classroom.section ? ` (${classroom.section})` : ''}
//                     </option>
//                   ))}
//                 </select>

//                 {classroomError && (
//                   <div className="text-danger small mt-2" role="alert">
//                     {classroomError}
//                   </div>
//                 )}

//                 {!classroomsLoading &&
//                   !classroomError &&
//                   classrooms.length === 0 && (
//                     <div className="text-secondary small mt-2">
//                       No classrooms available. Create a classroom first.
//                     </div>
//                   )}
//               </div>
//             )}

//             {isStudent && classroomError && (
//               <div className="alert alert-warning py-2" role="alert">
//                 We couldn't load your classroom. You can still ask general
//                 questions.
//               </div>
//             )}

//             <label
//               htmlFor="ai-question"
//               className="form-label fw-semibold"
//             >
//               Your question
//             </label>

//             <div className="d-flex align-items-end gap-2">
//               <textarea
//                 id="ai-question"
//                 className="form-control"
//                 rows={2}
//                 placeholder={
//                   isStudent
//                     ? 'Ask about learning, study strategies, or your academic progress...'
//                     : 'Ask about students, performance, or teaching strategies...'
//                 }
//                 value={question}
//                 onChange={(event) => setQuestion(event.target.value)}
//                  onKeyDown={handleQuestionKeyDown}
//                 // disabled={loading || classroomsLoading}
//                 disabled={
//   loading ||
//   (isAdminOrTeacher && classroomsLoading)
// }
//                 maxLength={3000}
//                 required
//               />

//               <button
//                 type="submit"
//                 className="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
//                 style={{ minHeight: '46px', minWidth: '48px' }}
//                 disabled={
//                   loading ||
//                   classroomsLoading ||
//                   (isAdminOrTeacher && !classroomId) ||
//                   !question.trim()
//                 }
//                 aria-label="Send question"
//                 title="Send question"
//               >
//                 {loading ? (
//                   <LoaderCircle
//                     size={19}
//                     style={{
//                       animation: 'spin 1s linear infinite',
//                     }}
//                   />
//                 ) : (
//                   <Send size={19} />
//                 )}
//               </button>
//             </div>

//             <div className="d-flex justify-content-between flex-wrap gap-2 mt-2">
//               <small className="text-secondary">
//                 AI-generated answers may need verification.
//               </small>

//               <small className="text-secondary">
//                 {question.length}/3000 characters
//               </small>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }
// ----------------------------------------------------------------
 
// import {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type FormEvent,
//   type KeyboardEvent,
// } from 'react'

// import {
//   Bot,
//   Send,
//   Sparkles,
//   User,
//   Trash2,
//   LoaderCircle,
//   MessageSquare,
//   ChevronDown,
// } from 'lucide-react'

// import { useAuth } from '../../context/AuthContext'
// import {
//   getClassrooms,
//   type Classroom,
// } from '../../services/classroom.service'
// import { askAI } from '../../services/ai.service'
// import { getApiError } from '../../services/getApiError'

// interface ChatMessage {
//   id: string
//   role: 'user' | 'assistant'
//   content: string
// }

// const staffSuggestedQuestions = [
//   'List the students in this classroom.',
//   'How can I identify students who need extra support?',
//   'Suggest strategies to improve student performance.',
// ]

// const studentSuggestedQuestions = [
//   'How can I improve my academic performance?',
//   'Give me a study plan to prepare for my next quiz.',
//   'How can I prepare better for my homework and exams?',
// ]

// export default function AIAssistant() {
//   const { user } = useAuth()

//   const conversationEndRef = useRef<HTMLDivElement>(null)
//   const classroomDropdownRef = useRef<HTMLDivElement>(null)
//   const classroomSearchInputRef = useRef<HTMLInputElement>(null)

//   const isStudent = user?.role === 'STUDENT'

//   const isAdminOrTeacher =
//     user?.role === 'ADMIN' || user?.role === 'TEACHER'

//   const canUseAssistant = isStudent || isAdminOrTeacher

//   // Classroom state
//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [classroomId, setClassroomId] = useState('')
//   const [classroomsLoading, setClassroomsLoading] = useState(true)
//   const [classroomError, setClassroomError] = useState('')

//   // Searchable classroom dropdown
//   const [classroomSearch, setClassroomSearch] = useState('')
//   const [debouncedClassroomSearch, setDebouncedClassroomSearch] =
//     useState('')
//   const [classroomDropdownOpen, setClassroomDropdownOpen] =
//     useState(false)

//   // Chat state
//   const [question, setQuestion] = useState('')
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const suggestedQuestions = isStudent
//     ? studentSuggestedQuestions
//     : staffSuggestedQuestions

//   const selectedClassroom = useMemo(
//     () => classrooms.find((classroom) => classroom.id === classroomId),
//     [classrooms, classroomId],
//   )

//   // Debounce classroom search.
//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setDebouncedClassroomSearch(
//         classroomSearch.trim().toLowerCase(),
//       )
//     }, 300)

//     return () => window.clearTimeout(timer)
//   }, [classroomSearch])

//   // Filter loaded classrooms by name, grade, or section.
//   const filteredClassrooms = useMemo(() => {
//     if (!debouncedClassroomSearch) {
//       return classrooms
//     }

//     return classrooms.filter((classroom) => {
//       const searchableText = [
//         classroom.name,
//         `grade ${classroom.gradeLevel}`,
//         classroom.section ?? '',
//       ]
//         .join(' ')
//         .toLowerCase()

//       return searchableText.includes(debouncedClassroomSearch)
//     })
//   }, [classrooms, debouncedClassroomSearch])

//   // Load classrooms.
//   useEffect(() => {
//     if (!canUseAssistant) {
//       setClassroomsLoading(false)
//       return
//     }

//     let active = true

//     async function loadClassrooms() {
//       try {
//         setClassroomError('')

//         const result = await getClassrooms()

//         if (!active) return

//         setClassrooms(result)

//         setClassroomId((current) => {
//           if (current && result.some((item) => item.id === current)) {
//             return current
//           }

//           return result[0]?.id ?? ''
//         })
//       } catch (err) {
//         if (active) {
//           setClassroomError(
//             getApiError(err, 'Unable to load classrooms.'),
//           )
//         }
//       } finally {
//         if (active) {
//           setClassroomsLoading(false)
//         }
//       }
//     }

//     void loadClassrooms()

//     return () => {
//       active = false
//     }
//   }, [canUseAssistant])

//   // Keep the latest conversation message visible.
//   useEffect(() => {
//     conversationEndRef.current?.scrollIntoView({
//       behavior: 'smooth',
//       block: 'end',
//     })
//   }, [messages, loading])

//   // Focus the search field when the classroom dropdown opens.
//   useEffect(() => {
//     if (classroomDropdownOpen) {
//       classroomSearchInputRef.current?.focus()
//     }
//   }, [classroomDropdownOpen])

//   // Close classroom dropdown when clicking outside.
//   useEffect(() => {
//     const handleOutsideClick = (event: MouseEvent) => {
//       if (
//         classroomDropdownRef.current &&
//         !classroomDropdownRef.current.contains(event.target as Node)
//       ) {
//         setClassroomDropdownOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleOutsideClick)

//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick)
//     }
//   }, [])

//   const openClassroomDropdown = () => {
//     if (classroomsLoading || loading || classrooms.length === 0) {
//       return
//     }

//     if (!classroomDropdownOpen) {
//       setClassroomSearch('')
//       setDebouncedClassroomSearch('')
//     }

//     setClassroomDropdownOpen((open) => !open)
//   }

//   const handleClassroomSelect = (id: string) => {
//     setClassroomId(id)
//     setClassroomDropdownOpen(false)
//     setClassroomSearch('')
//     setDebouncedClassroomSearch('')
//     setError('')
//   }

//   const handleQuestionKeyDown = (
//     event: KeyboardEvent<HTMLTextAreaElement>,
//   ) => {
//     if (
//       event.key === 'Enter' &&
//       !event.shiftKey &&
//       !event.nativeEvent.isComposing
//     ) {
//       event.preventDefault()

//       if (
//         question.trim() &&
//         !loading &&
//         !classroomsLoading &&
//         (!isAdminOrTeacher || Boolean(classroomId))
//       ) {
//         event.currentTarget.form?.requestSubmit()
//       }
//     }
//   }

//   const handleAsk = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     const trimmedQuestion = question.trim()

//     if (!trimmedQuestion || loading || classroomsLoading) {
//       return
//     }

//     if (isAdminOrTeacher && !classroomId) {
//       setError('Please select a classroom before asking a question.')
//       return
//     }

//     const userMessage: ChatMessage = {
//       id: `${Date.now()}-user`,
//       role: 'user',
//       content: trimmedQuestion,
//     }

//     setMessages((previous) => [...previous, userMessage])
//     setQuestion('')
//     setError('')
//     setLoading(true)

//     try {
//       const result = await askAI({
//         ...(classroomId ? { classroomId } : {}),
//         question: trimmedQuestion,
//       })

//       const assistantMessage: ChatMessage = {
//         id: `${Date.now()}-assistant`,
//         role: 'assistant',
//         content: result.answer,
//       }

//       setMessages((previous) => [...previous, assistantMessage])
//     } catch (err) {
//       setError(
//         getApiError(
//           err,
//           'Unable to get an answer right now. Please try again.',
//         ),
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const clearConversation = () => {
//     if (loading) return

//     setMessages([])
//     setError('')
//     setQuestion('')
//   }

//   if (!canUseAssistant) {
//     return (
//       <div className="container-fluid py-3">
//         <div className="alert alert-warning" role="alert">
//           The AI Assistant is available to students, teachers, and
//           administrators.
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container-fluid py-3">
//       {/* Page heading */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
//         <div>
//           <div className="d-flex align-items-center gap-2 mb-2">
//             <div className="rounded-3 p-2 bg-primary-subtle text-primary">
//               <Bot size={25} />
//             </div>

//             <h1 className="h3 mb-0">AI Assistant</h1>
//           </div>

//           <p className="text-secondary mb-0">
//             {isStudent
//               ? 'Get personalized learning guidance and help with your academic progress.'
//               : 'Get AI-powered guidance for teaching and student performance.'}
//           </p>
//         </div>

//         {messages.length > 0 && (
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={clearConversation}
//             disabled={loading}
//           >
//             <Trash2 size={16} className="me-2" />
//             Clear conversation
//           </button>
//         )}
//       </div>

//       {/* ChatGPT-style chat workspace */}
//       <div
//         className="card border-0 shadow-sm overflow-hidden"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: 'calc(100dvh - 190px)',
//           minHeight: '500px',
//         }}
//       >
//         {/* Header */}
//         <div className="card-header bg-white py-3 flex-shrink-0">
//           <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
//             {/* Assistant details */}
//             <div className="d-flex align-items-center gap-2">
//               <div className="rounded-circle bg-primary-subtle text-primary p-2">
//                 <Sparkles size={19} />
//               </div>

//               <div>
//                 <h2 className="h6 mb-1">GradeLens AI</h2>
//                 <small className="text-secondary">
//                   {isStudent
//                     ? 'Your personal learning assistant'
//                     : 'Classroom-aware AI assistance'}
//                 </small>
//               </div>
//             </div>

//             {/* Classroom selector: top-right */}
//             {isAdminOrTeacher && (
//               <div
//                 ref={classroomDropdownRef}
//                 className="position-relative ms-auto"
//                 style={{
//                   width: '100%',
//                   maxWidth: '320px',
//                 }}
//               >
//                 <label
//                   htmlFor="ai-classroom-search"
//                   className="form-label small fw-semibold mb-1"
//                 >
//                   Classroom
//                 </label>

//                 <button
//                   type="button"
//                   className="form-select d-flex align-items-center justify-content-between gap-2 text-start"
//                   aria-expanded={classroomDropdownOpen}
//                   aria-haspopup="listbox"
//                   disabled={
//                     classroomsLoading ||
//                     loading ||
//                     classrooms.length === 0
//                   }
//                   onClick={openClassroomDropdown}
//                 >
//                   <span className="text-truncate">
//                     {classroomsLoading
//                       ? 'Loading classrooms...'
//                       : selectedClassroom
//                         ? `${selectedClassroom.name} — Grade ${selectedClassroom.gradeLevel}${
//                             selectedClassroom.section
//                               ? ` (${selectedClassroom.section})`
//                               : ''
//                           }`
//                         : 'Choose a classroom'}
//                   </span>

//                   <ChevronDown
//                     size={16}
//                     className="flex-shrink-0"
//                   />
//                 </button>

//                 {classroomDropdownOpen && (
//                   <div
//                     className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow p-2"
//                     style={{
//                       width: 'min(320px, 85vw)',
//                       zIndex: 1050,
//                     }}
//                   >
//                     <input
//                       ref={classroomSearchInputRef}
//                       id="ai-classroom-search"
//                       type="search"
//                       className="form-control form-control-sm mb-2"
//                       placeholder="Search name, grade, or section..."
//                       autoComplete="off"
//                       value={classroomSearch}
//                       onChange={(event) =>
//                         setClassroomSearch(event.target.value)
//                       }
//                     />

//                     <div
//                       role="listbox"
//                       aria-label="Available classrooms"
//                       style={{
//                         maxHeight: '240px',
//                         overflowY: 'auto',
//                       }}
//                     >
//                       {filteredClassrooms.length > 0 ? (
//                         filteredClassrooms.map((classroom) => {
//                           const selected =
//                             classroom.id === classroomId

//                           return (
//                             <button
//                               key={classroom.id}
//                               type="button"
//                               role="option"
//                               aria-selected={selected}
//                               className={`btn w-100 text-start mb-1 ${
//                                 selected
//                                   ? 'btn-primary'
//                                   : 'btn-light'
//                               }`}
//                               onClick={() =>
//                                 handleClassroomSelect(classroom.id)
//                               }
//                             >
//                               <span className="d-block fw-semibold">
//                                 {classroom.name}
//                               </span>

//                               <small>
//                                 Grade {classroom.gradeLevel}
//                                 {classroom.section
//                                   ? ` · Section ${classroom.section}`
//                                   : ''}
//                               </small>
//                             </button>
//                           )
//                         })
//                       ) : (
//                         <div className="text-secondary small text-center py-3">
//                           No matching classrooms found.
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {isAdminOrTeacher && classroomError && (
//             <div className="text-danger small mt-2" role="alert">
//               {classroomError}
//             </div>
//           )}

//           {isAdminOrTeacher &&
//             !classroomsLoading &&
//             !classroomError &&
//             classrooms.length === 0 && (
//               <div className="text-secondary small mt-2">
//                 No classrooms available. Create a classroom first.
//               </div>
//             )}
//         </div>

//         {/* Scrollable conversation */}
//         <div
//           className="card-body p-0 overflow-y-auto"
//           style={{
//             flex: '1 1 auto',
//             minHeight: 0,
//             overflowWrap: 'anywhere',
//             scrollBehavior: 'smooth',
//           }}
//         >
//           <div
//             className="mx-auto w-100 px-3 px-md-4 py-4"
//             style={{
//               maxWidth: '900px',
//               minHeight: '100%',
//               boxSizing: 'border-box',
//             }}
//           >
//             {messages.length === 0 ? (
//               <div
//                 className="d-flex flex-column align-items-center justify-content-center text-center py-5"
//                 style={{ minHeight: '100%' }}
//               >
//                 <div className="rounded-circle bg-primary-subtle text-primary p-3 mb-3">
//                   <MessageSquare size={30} />
//                 </div>

//                 <h2 className="h5 mb-2">
//                   {isStudent
//                     ? 'How can I help you learn today?'
//                     : 'How can I help you today?'}
//                 </h2>

//                 <p
//                   className="text-secondary mb-4"
//                   style={{ maxWidth: '460px' }}
//                 >
//                   {isStudent
//                     ? 'Ask about your academic progress, quiz results, homework, or ways to improve your learning.'
//                     : 'Ask about the selected classroom, student performance, or learning improvement.'}
//                 </p>

//                 <div
//                   className="d-flex flex-column gap-2 w-100"
//                   style={{ maxWidth: '600px' }}
//                 >
//                   {suggestedQuestions.map((suggestion) => (
//                     <button
//                       key={suggestion}
//                       type="button"
//                       className="btn btn-outline-secondary text-start"
//                       onClick={() => setQuestion(suggestion)}
//                       disabled={
//                         loading ||
//                         (isAdminOrTeacher &&
//                           (classroomsLoading || !classroomId))
//                       }
//                     >
//                       <Sparkles
//                         size={15}
//                         className="me-2 text-primary"
//                       />
//                       {suggestion}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="d-flex flex-column gap-4 mx-auto w-100">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`d-flex gap-3 ${
//                       message.role === 'user'
//                         ? 'flex-row-reverse'
//                         : 'flex-row'
//                     }`}
//                   >
//                     <div
//                       className={`rounded-circle p-2 flex-shrink-0 ${
//                         message.role === 'user'
//                           ? 'bg-secondary-subtle text-secondary'
//                           : 'bg-primary-subtle text-primary'
//                       }`}
//                       style={{
//                         height: '38px',
//                         width: '38px',
//                       }}
//                       aria-hidden="true"
//                     >
//                       {message.role === 'user' ? (
//                         <User size={21} />
//                       ) : (
//                         <Bot size={21} />
//                       )}
//                     </div>

//                     <div
//                       className={`rounded-3 px-3 py-3 ${
//                         message.role === 'user'
//                           ? 'bg-primary text-white'
//                           : 'bg-body-tertiary'
//                       }`}
//                       style={{
//                         maxWidth: '85%',
//                         minWidth: 0,
//                         overflowWrap: 'anywhere',
//                       }}
//                     >
//                       <div className="small fw-semibold mb-2">
//                         {message.role === 'user'
//                           ? 'You'
//                           : 'GradeLens AI'}
//                       </div>

//                       <div
//                         style={{
//                           whiteSpace: 'pre-wrap',
//                           lineHeight: 1.7,
//                         }}
//                       >
//                         {message.content}
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {loading && (
//                   <div className="d-flex align-items-center gap-3">
//                     <div className="rounded-circle bg-primary-subtle text-primary p-2 flex-shrink-0">
//                       <Bot size={21} />
//                     </div>

//                     <div className="bg-body-tertiary rounded-3 px-3 py-3">
//                       <LoaderCircle
//                         size={17}
//                         className="me-2"
//                         style={{
//                           verticalAlign: 'text-bottom',
//                           animation: 'spin 1s linear infinite',
//                         }}
//                       />

//                       <span className="text-secondary">
//                         Generating an answer...
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {error && (
//               <div className="alert alert-danger mt-4 mb-0" role="alert">
//                 <div className="fw-semibold mb-1">
//                   Unable to get an answer
//                 </div>
//                 <div>{error}</div>
//               </div>
//             )}

//             <div ref={conversationEndRef} />
//           </div>
//         </div>

//         {/* Bottom composer: stays visible while messages scroll */}
//         <div
//           className="card-footer bg-white border-top p-2 p-md-3 flex-shrink-0"
//         >
//           <div
//             className="mx-auto w-100"
//             style={{ maxWidth: '850px' }}
//           >
//             <form onSubmit={handleAsk}>
//               {isStudent && classroomError && (
//                 <div className="alert alert-warning py-2" role="alert">
//                   We couldn't load your classroom. You can still ask
//                   general questions.
//                 </div>
//               )}

//               <label
//                 htmlFor="ai-question"
//                 className="form-label fw-semibold visually-hidden"
//               >
//                 Your question
//               </label>

//               <div
//                 className="d-flex align-items-end gap-2 border rounded-4 p-2 p-md-3"
//                 style={{
//                   backgroundColor: 'var(--bs-body-bg)',
//                 }}
//               >
//                 <textarea
//                   id="ai-question"
//                   className="form-control border-0 shadow-none"
//                   rows={2}
//                   placeholder={
//                     isStudent
//                       ? 'Ask about learning, study strategies, or your academic progress...'
//                       : 'Ask about students, performance, or teaching strategies...'
//                   }
//                   value={question}
//                   onChange={(event) =>
//                     setQuestion(event.target.value)
//                   }
//                   onKeyDown={handleQuestionKeyDown}
//                   disabled={
//                     loading ||
//                     (isAdminOrTeacher && classroomsLoading)
//                   }
//                   maxLength={3000}
//                   required
//                   style={{
//                     resize: 'none',
//                     minHeight: '48px',
//                     maxHeight: '160px',
//                     overflowY: 'auto',
//                     backgroundColor: 'transparent',
//                   }}
//                 />

//                 <button
//                   type="submit"
//                   className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
//                   style={{
//                     width: '44px',
//                     height: '44px',
//                     padding: 0,
//                   }}
//                   disabled={
//                     loading ||
//                     classroomsLoading ||
//                     (isAdminOrTeacher &&
//                       (!classroomId || !selectedClassroom)) ||
//                     !question.trim()
//                   }
//                   aria-label="Send question"
//                   title="Send question"
//                 >
//                   {loading ? (
//                     <LoaderCircle
//                       size={19}
//                       style={{
//                         animation: 'spin 1s linear infinite',
//                       }}
//                     />
//                   ) : (
//                     <Send size={19} />
//                   )}
//                 </button>
//               </div>

//               <div className="d-flex justify-content-between flex-wrap gap-2 mt-2">
//                 <small className="text-secondary">
//                   AI-generated answers may need verification.
//                 </small>

//                 <small className="text-secondary">
//                   {question.length}/3000 characters
//                 </small>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// --------------------------------------------------------------------------------
 import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  LoaderCircle,
  MessageSquare,
  ChevronDown,
  Check,
  Search,
  X,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import {
  getClassrooms,
  type Classroom,
} from '../../services/classroom.service'
import { askAI } from '../../services/ai.service'
import { getApiError } from '../../services/getApiError'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const staffSuggestedQuestions = [
  'List the students in this classroom.',
  'How can I identify students who need extra support?',
  'Suggest strategies to improve student performance.',
]

const studentSuggestedQuestions = [
  'How can I improve my academic performance?',
  'Give me a study plan to prepare for my next quiz.',
  'How can I prepare better for my homework and exams?',
]

// Scoped styles: spinner keyframes, focus ring, hover states, hidden native search "x".
const componentStyles = `
@keyframes ai-spin { to { transform: rotate(360deg); } }
.ai-spin { animation: ai-spin 1s linear infinite; }

.ai-composer {
  transition: border-color .15s ease, box-shadow .15s ease;
}
.ai-composer:focus-within {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 0 .2rem rgba(var(--bs-primary-rgb), .15) !important;
}

.ai-suggestion {
  transition: border-color .15s ease, background-color .15s ease, transform .15s ease;
}
.ai-suggestion:not(:disabled):hover {
  border-color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle) !important;
  transform: translateY(-1px);
}

.ai-option {
  transition: background-color .12s ease;
  border: 0;
  background: transparent;
  color: inherit;
}
.ai-option:hover,
.ai-option:focus-visible {
  background-color: var(--bs-tertiary-bg);
  outline: none;
}
.ai-option[aria-selected="true"] {
  background-color: var(--bs-primary-bg-subtle);
}

.ai-search-input::-webkit-search-cancel-button,
.ai-search-input::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}

/* Page height: give the chat as much room as possible */
.ai-page { height: calc(100dvh - 110px); min-height: 420px; }
.ai-avatar { width: 40px; height: 40px; }
.ai-bubble { max-width: min(85%, 720px); }

@media (max-width: 575.98px) {
  .ai-page { height: calc(100dvh - 72px); min-height: 380px; }
  .ai-avatar { width: 32px; height: 32px; }
  .ai-bubble { max-width: calc(100% - 44px); }
}

.ai-controls-staff { width: 100%; }
@media (min-width: 992px) {
  .ai-controls-staff { width: auto; min-width: 340px; }
}

.ai-header-collapse {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows .25s ease, opacity .2s ease, margin .25s ease;
}
.ai-header-collapse > div { overflow: hidden; min-height: 0; }
.ai-header-collapse.is-compact {
  grid-template-rows: 0fr;
  opacity: 0;
}

.ai-scroll::-webkit-scrollbar { width: 8px; }
.ai-scroll::-webkit-scrollbar-thumb {
  background: var(--bs-border-color);
  border-radius: 8px;
}
`

export default function AIAssistant() {
  const { user } = useAuth()

  const conversationEndRef = useRef<HTMLDivElement>(null)
  const classroomDropdownRef = useRef<HTMLDivElement>(null)
  const classroomSearchInputRef = useRef<HTMLInputElement>(null)

  const isStudent = user?.role === 'STUDENT'

  const isAdminOrTeacher =
    user?.role === 'ADMIN' || user?.role === 'TEACHER'

  const canUseAssistant = isStudent || isAdminOrTeacher

  // Classroom state
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [classroomId, setClassroomId] = useState('')
  const [classroomsLoading, setClassroomsLoading] = useState(true)
  const [classroomError, setClassroomError] = useState('')

  // Searchable classroom dropdown
  const [classroomSearch, setClassroomSearch] = useState('')
  const [debouncedClassroomSearch, setDebouncedClassroomSearch] =
    useState('')
  const [classroomDropdownOpen, setClassroomDropdownOpen] =
    useState(false)

  // Chat state
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // UI only: collapse the header once the conversation starts or is scrolled.
  const [scrolled, setScrolled] = useState(false)
  const compactHeader = messages.length > 0 || scrolled

  const suggestedQuestions = isStudent
    ? studentSuggestedQuestions
    : staffSuggestedQuestions

  const selectedClassroom = useMemo(
    () => classrooms.find((classroom) => classroom.id === classroomId),
    [classrooms, classroomId],
  )

  // Debounce classroom search.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedClassroomSearch(
        classroomSearch.trim().toLowerCase(),
      )
    }, 300)

    return () => window.clearTimeout(timer)
  }, [classroomSearch])

  // Filter loaded classrooms by name, grade, or section.
  const filteredClassrooms = useMemo(() => {
    if (!debouncedClassroomSearch) {
      return classrooms
    }

    return classrooms.filter((classroom) => {
      const searchableText = [
        classroom.name,
        `grade ${classroom.gradeLevel}`,
        classroom.section ?? '',
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(debouncedClassroomSearch)
    })
  }, [classrooms, debouncedClassroomSearch])

  // Load classrooms.
  // useEffect(() => {
  //   if (!canUseAssistant) {
  //     setClassroomsLoading(false)
  //     return
  //   }

  //   let active = true

  //   async function loadClassrooms() {
  //     try {
  //       setClassroomError('')

  //       const result = await getClassrooms()

  //       if (!active) return

  //       setClassrooms(result)

  //       setClassroomId((current) => {
  //         if (current && result.some((item) => item.id === current)) {
  //           return current
  //         }

  //         return result[0]?.id ?? ''
  //       })
  //     } catch (err) {
  //       if (active) {
  //         setClassroomError(
  //           getApiError(err, 'Unable to load classrooms.'),
  //         )
  //       }
  //     } finally {
  //       if (active) {
  //         setClassroomsLoading(false)
  //       }
  //     }
  //   }

  //   void loadClassrooms()

  //   return () => {
  //     active = false
  //   }
  // }, [canUseAssistant])

  // Load classrooms.
useEffect(() => {
  if (!canUseAssistant) return

  let active = true

  async function loadClassrooms() {
    try {
      setClassroomError('')

      const result = await getClassrooms()

      if (!active) return

      setClassrooms(result)

      setClassroomId((current) => {
        if (current && result.some((item) => item.id === current)) {
          return current
        }

        return result[0]?.id ?? ''
      })
    } catch (err) {
      if (active) {
        setClassroomError(
          getApiError(err, 'Unable to load classrooms.'),
        )
      }
    } finally {
      if (active) {
        setClassroomsLoading(false)
      }
    }
  }

  void loadClassrooms()

  return () => {
    active = false
  }
}, [canUseAssistant])

  // Keep the latest conversation message visible.
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, loading])

  // Focus the search field when the classroom dropdown opens.
  useEffect(() => {
    if (classroomDropdownOpen) {
      classroomSearchInputRef.current?.focus()
    }
  }, [classroomDropdownOpen])

  // Close classroom dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        classroomDropdownRef.current &&
        !classroomDropdownRef.current.contains(event.target as Node)
      ) {
        setClassroomDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const openClassroomDropdown = () => {
    if (classroomsLoading || loading || classrooms.length === 0) {
      return
    }

    if (!classroomDropdownOpen) {
      setClassroomSearch('')
      setDebouncedClassroomSearch('')
    }

    setClassroomDropdownOpen((open) => !open)
  }

  const handleClassroomSelect = (id: string) => {
    setClassroomId(id)
    setClassroomDropdownOpen(false)
    setClassroomSearch('')
    setDebouncedClassroomSearch('')
    setError('')
  }

  const clearClassroomSearch = () => {
    setClassroomSearch('')
    setDebouncedClassroomSearch('')
    classroomSearchInputRef.current?.focus()
  }

  const handleDropdownKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'Escape' && classroomDropdownOpen) {
      setClassroomDropdownOpen(false)
    }
  }

  const handleQuestionKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()

      if (
        question.trim() &&
        !loading &&
        !classroomsLoading &&
        (!isAdminOrTeacher || Boolean(classroomId))
      ) {
        event.currentTarget.form?.requestSubmit()
      }
    }
  }

  const handleAsk = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || loading || classroomsLoading) {
      return
    }

    if (isAdminOrTeacher && !classroomId) {
      setError('Please select a classroom before asking a question.')
      return
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmedQuestion,
    }

    setMessages((previous) => [...previous, userMessage])
    setQuestion('')
    setError('')
    setLoading(true)

    try {
      const result = await askAI({
        ...(classroomId ? { classroomId } : {}),
        question: trimmedQuestion,
      })

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: result.answer,
      }

      setMessages((previous) => [...previous, assistantMessage])
    } catch (err) {
      setError(
        getApiError(
          err,
          'Unable to get an answer right now. Please try again.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = () => {
    if (loading) return

    setMessages([])
    setError('')
    setQuestion('')
    setScrolled(false)
  }

  if (!canUseAssistant) {
    return (
      <div className="container-fluid py-3 px-3 px-lg-4">
        <div className="alert alert-warning mb-0" role="alert">
          The AI Assistant is available to students, teachers, and
          administrators.
        </div>
      </div>
    )
  }

  const classroomLabel = classroomsLoading
    ? 'Loading classrooms...'
    : selectedClassroom
      ? `${selectedClassroom.name} — Grade ${selectedClassroom.gradeLevel}${
          selectedClassroom.section
            ? ` (${selectedClassroom.section})`
            : ''
        }`
      : 'Choose a classroom'

  return (
    <div
      className="ai-page container-fluid px-2 px-sm-3 px-lg-4 py-2 py-lg-3"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <style>{componentStyles}</style>

      {/* Chat workspace: fixed header/footer with one conversation scroller */}
      <div
        className="card border shadow-sm rounded-4 overflow-hidden flex-grow-1"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {/* Header */}
        <div
          className={`card-header bg-body px-3 px-md-4 border-bottom flex-shrink-0 ${
            compactHeader ? 'py-2' : 'py-3'
          }`}
          style={{ transition: 'padding .25s ease' }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 gap-md-3">
            {/* Title + assistant identity */}
            <div
              className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1"
              style={{ minWidth: 0 }}
            >
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: compactHeader ? 34 : 46,
                  height: compactHeader ? 34 : 46,
                  transition: 'width .25s ease, height .25s ease',
                }}
              >
                <Sparkles size={compactHeader ? 17 : 22} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <h1 className="h5 fw-bold mb-0">AI Assistant</h1>
                  <span className="badge rounded-pill text-primary-emphasis bg-primary-subtle fw-semibold">
                    GradeLens AI
                  </span>
                </div>

                {/* Description collapses to free space for the chat */}
                <div
                  className={`ai-header-collapse ${
                    compactHeader ? 'is-compact' : ''
                  }`}
                  aria-hidden={compactHeader}
                >
                  <div>
                    <p className="small text-secondary mb-0 pt-1">
                      {isStudent
                        ? 'Get personalized learning guidance and help with your academic progress.'
                        : 'Get AI-powered guidance for teaching and student performance.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            {(isAdminOrTeacher || messages.length > 0) && (
              <div
                className={`d-flex align-items-end gap-2 ${
                  isAdminOrTeacher ? 'ai-controls-staff' : 'flex-shrink-0'
                }`}
              >
                {/* Classroom selector */}
                {isAdminOrTeacher && (
                  <div
                    ref={classroomDropdownRef}
                    onKeyDown={handleDropdownKeyDown}
                    className="position-relative flex-grow-1"
                    style={{
                      maxWidth: '360px',
                      minWidth: 0,
                    }}
                  >
                    <label
                      htmlFor="ai-classroom-trigger"
                      className={`form-label small fw-semibold text-secondary mb-1 ${
                        compactHeader ? 'visually-hidden' : ''
                      }`}
                    >
                      Classroom
                    </label>

                    <button
                      id="ai-classroom-trigger"
                      type="button"
                      className="form-select d-flex align-items-center justify-content-between gap-2 text-start rounded-3 w-100"
                      style={{ backgroundImage: 'none' }}
                      aria-expanded={classroomDropdownOpen}
                      aria-haspopup="listbox"
                      disabled={
                        classroomsLoading ||
                        loading ||
                        classrooms.length === 0
                      }
                      onClick={openClassroomDropdown}
                    >
                      <span
                        className={`text-truncate ${
                          selectedClassroom ? '' : 'text-secondary'
                        }`}
                      >
                        {classroomLabel}
                      </span>

                      <ChevronDown
                        size={16}
                        className="flex-shrink-0 text-secondary"
                        style={{
                          transition: 'transform .15s ease',
                          transform: classroomDropdownOpen
                            ? 'rotate(180deg)'
                            : 'none',
                        }}
                      />
                    </button>

                    {classroomDropdownOpen && (
                      <div
                        className="position-absolute mt-2 bg-body border rounded-3 shadow-lg p-2"
                        style={{
                          width: 'min(360px, calc(100vw - 2rem))',
                          zIndex: 1050,
                          right: 0,
                          left: 'auto',
                        }}
                      >
                        {/* Search with clear button */}
                        <div className="position-relative mb-2">
                          <Search
                            size={15}
                            className="position-absolute text-secondary"
                            style={{
                              left: 12,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              pointerEvents: 'none',
                            }}
                            aria-hidden="true"
                          />

                          <input
                            ref={classroomSearchInputRef}
                            id="ai-classroom-search"
                            type="search"
                            className="form-control form-control-sm ai-search-input rounded-3"
                            style={{
                              paddingLeft: 34,
                              paddingRight: classroomSearch ? 34 : 12,
                              height: 36,
                            }}
                            placeholder="Search name, grade, or section..."
                            aria-label="Search classrooms"
                            autoComplete="off"
                            value={classroomSearch}
                            onChange={(event) =>
                              setClassroomSearch(event.target.value)
                            }
                          />

                          {classroomSearch && (
                            <button
                              type="button"
                              className="btn btn-sm border-0 text-secondary position-absolute d-flex align-items-center justify-content-center p-0 rounded-circle"
                              style={{
                                right: 6,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 24,
                                height: 24,
                              }}
                              onClick={clearClassroomSearch}
                              aria-label="Clear search"
                              title="Clear search"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        <div
                          role="listbox"
                          aria-label="Available classrooms"
                          className="ai-scroll d-flex flex-column gap-1"
                          style={{
                            maxHeight: '240px',
                            overflowY: 'auto',
                          }}
                        >
                          {filteredClassrooms.length > 0 ? (
                            filteredClassrooms.map((classroom) => {
                              const selected =
                                classroom.id === classroomId

                              return (
                                <button
                                  key={classroom.id}
                                  type="button"
                                  role="option"
                                  aria-selected={selected}
                                  className="ai-option w-100 text-start rounded-2 px-3 py-2 d-flex align-items-center justify-content-between gap-2"
                                  onClick={() =>
                                    handleClassroomSelect(classroom.id)
                                  }
                                >
                                  <span style={{ minWidth: 0 }}>
                                    <span
                                      className={`d-block text-truncate ${
                                        selected
                                          ? 'fw-semibold text-primary'
                                          : 'fw-medium'
                                      }`}
                                    >
                                      {classroom.name}
                                    </span>

                                    <small className="text-secondary">
                                      Grade {classroom.gradeLevel}
                                      {classroom.section
                                        ? ` · Section ${classroom.section}`
                                        : ''}
                                    </small>
                                  </span>

                                  {selected && (
                                    <Check
                                      size={16}
                                      className="text-primary flex-shrink-0"
                                    />
                                  )}
                                </button>
                              )
                            })
                          ) : (
                            <div className="text-secondary small text-center py-4">
                              No matching classrooms found.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {messages.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-3 p-0 flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: 38, height: 38 }}
                    onClick={clearConversation}
                    disabled={loading}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
            )}
          </div>

          {isAdminOrTeacher && classroomError && (
            <div className="text-danger small mt-3" role="alert">
              {classroomError}
            </div>
          )}

          {isAdminOrTeacher &&
            !classroomsLoading &&
            !classroomError &&
            classrooms.length === 0 && (
              <div className="text-secondary small mt-3">
                No classrooms available. Create a classroom first.
              </div>
            )}
        </div>

        {/* Scrollable conversation */}
        <div
          className="card-body p-0 bg-body-tertiary ai-scroll"
          onScroll={(event) => {
            if (event.currentTarget.scrollTop > 24) {
              setScrolled(true)
            }
          }}
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            overflowWrap: 'anywhere',
            scrollBehavior: 'smooth',
          }}
        >
          <div
            className="mx-auto w-100 px-2 px-sm-3 px-md-4 py-3 py-md-4"
            style={{
              maxWidth: '900px',
              minHeight: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {messages.length === 0 ? (
              <div
                className="d-flex flex-column align-items-center justify-content-center text-center py-4 px-2 flex-grow-1"
              >
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mb-4 shadow-sm"
                  style={{ width: 72, height: 72 }}
                >
                  <MessageSquare size={30} />
                </div>

                <h2 className="h4 fw-semibold mb-2">
                  {isStudent
                    ? 'How can I help you learn today?'
                    : 'How can I help you today?'}
                </h2>

                <p
                  className="text-secondary mb-4"
                  style={{ maxWidth: '480px' }}
                >
                  {isStudent
                    ? 'Ask about your academic progress, quiz results, homework, or ways to improve your learning.'
                    : 'Ask about the selected classroom, student performance, or learning improvement.'}
                </p>

                <div
                  className="d-flex flex-column gap-2 w-100"
                  style={{ maxWidth: '600px' }}
                >
                  {suggestedQuestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="ai-suggestion btn btn-outline-secondary text-start rounded-3 px-3 py-3 bg-body d-flex align-items-center gap-3"
                      onClick={() => setQuestion(suggestion)}
                      disabled={
                        loading ||
                        (isAdminOrTeacher &&
                          (classroomsLoading || !classroomId))
                      }
                    >
                      <Sparkles
                        size={16}
                        className="text-primary flex-shrink-0"
                      />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4 mx-auto w-100">
                {messages.map((message) => {
                  const isUser = message.role === 'user'

                  return (
                    <div
                      key={message.id}
                      className={`d-flex align-items-start gap-2 gap-md-3 ${
                        isUser ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`ai-avatar rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm ${
                          isUser
                            ? 'bg-secondary-subtle text-secondary'
                            : 'bg-primary-subtle text-primary'
                        }`}
                        aria-hidden="true"
                      >
                        {isUser ? <User size={20} /> : <Bot size={20} />}
                      </div>

                      <div
                        className={`ai-bubble px-3 py-2 py-md-3 shadow-sm ${
                          isUser
                            ? 'bg-primary text-white'
                            : 'bg-body border'
                        }`}
                        style={{
                          minWidth: 0,
                          overflowWrap: 'anywhere',
                          borderRadius: '1.1rem',
                          ...(isUser
                            ? { borderTopRightRadius: '0.35rem' }
                            : { borderTopLeftRadius: '0.35rem' }),
                        }}
                      >
                        <div
                          className="small fw-semibold mb-1"
                          style={{ opacity: isUser ? 0.9 : 1 }}
                        >
                          {isUser ? 'You' : 'GradeLens AI'}
                        </div>

                        <div
                          style={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.65,
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {loading && (
                  <div className="d-flex align-items-start gap-2 gap-md-3">
                    <div
                      className="ai-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                      aria-hidden="true"
                    >
                      <Bot size={20} />
                    </div>

                    <div
                      className="bg-body border px-3 py-3 shadow-sm d-flex align-items-center gap-2"
                      style={{
                        borderRadius: '1.1rem',
                        borderTopLeftRadius: '0.35rem',
                      }}
                      role="status"
                      aria-live="polite"
                    >
                      <LoaderCircle
                        size={17}
                        className="ai-spin text-primary flex-shrink-0"
                      />

                      <span className="text-secondary">
                        Generating an answer...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-4 mb-0" role="alert">
                <div className="fw-semibold mb-1">
                  Unable to get an answer
                </div>
                <div>{error}</div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>
        </div>

        {/* Bottom composer: stays visible while messages scroll */}
        <div className="card-footer bg-body border-top px-2 px-sm-3 px-md-4 py-2 py-md-3 flex-shrink-0">
          <div className="mx-auto w-100" style={{ maxWidth: '850px' }}>
            <form onSubmit={handleAsk}>
              {isStudent && classroomError && (
                <div className="alert alert-warning py-2 small" role="alert">
                  We couldn't load your classroom. You can still ask
                  general questions.
                </div>
              )}

              <label
                htmlFor="ai-question"
                className="form-label fw-semibold visually-hidden"
              >
                Your question
              </label>

              <div
                className="ai-composer d-flex align-items-end gap-2 border rounded-4 p-2 shadow-sm"
                style={{
                  backgroundColor: 'var(--bs-body-bg)',
                }}
              >
                <textarea
                  id="ai-question"
                  className="form-control border-0 shadow-none px-2 py-2"
                  rows={2}
                  placeholder={
                    isStudent
                      ? 'Ask about learning, study strategies, or your academic progress...'
                      : 'Ask about students, performance, or teaching strategies...'
                  }
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  disabled={
                    loading ||
                    (isAdminOrTeacher && classroomsLoading)
                  }
                  maxLength={3000}
                  required
                  style={{
                    resize: 'none',
                    minHeight: '48px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    backgroundColor: 'transparent',
                  }}
                />

                <button
                  type="submit"
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm mb-1 me-1"
                  style={{
                    width: '44px',
                    height: '44px',
                    padding: 0,
                  }}
                  disabled={
                    loading ||
                    classroomsLoading ||
                    (isAdminOrTeacher &&
                      (!classroomId || !selectedClassroom)) ||
                    !question.trim()
                  }
                  aria-label="Send question"
                  title="Send question"
                >
                  {loading ? (
                    <LoaderCircle size={19} className="ai-spin" />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-2 mt-1 mt-md-2 px-1">
                <small
                  className="text-secondary text-truncate"
                  style={{ fontSize: '0.75rem' }}
                >
                  AI-generated answers may need verification.
                </small>

                <small
                  className="text-secondary flex-shrink-0"
                  style={{ fontSize: '0.75rem' }}
                >
                  {question.length}/3000
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}