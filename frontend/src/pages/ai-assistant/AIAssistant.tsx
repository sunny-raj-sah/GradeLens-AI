 
// import { useEffect, useState, type FormEvent } from 'react'
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

// const suggestedQuestions = [
//   'List the students in this classroom.',
//   'How can I identify students who need extra support?',
//   'Suggest strategies to improve student performance.',
// ]

// export default function AIAssistant() {
//   const { user } = useAuth()

//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [classroomId, setClassroomId] = useState('')
//   const [classroomsLoading, setClassroomsLoading] = useState(true)
//   const [classroomError, setClassroomError] = useState('')

//   const [question, setQuestion] = useState('')
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   // const isAdminOrTeacher =
//   //   user?.role === 'ADMIN' || user?.role === 'TEACHER'
// const isStudent = user?.role === 'STUDENT'

// const isAdminOrTeacherChange =
//   user?.role === 'ADMIN' || user?.role === 'TEACHER'

// const isAdminOrTeacher = isStudent ||  isAdminOrTeacherChange
  
// useEffect(() => {
//   if (!isAdminOrTeacher) return

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
// }, [isAdminOrTeacher])


//   const handleAsk = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     const trimmedQuestion = question.trim()

//     if (
//       !trimmedQuestion ||
//       !classroomId ||
//       loading ||
//       classroomsLoading
//     ) {
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
//         classroomId,
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

//   if (!isAdminOrTeacher) {
//     return (
//       <div className="container-fluid py-4">
//         <div className="alert alert-warning" role="alert">
//           The AI Assistant is available to administrators and teachers only.
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container-fluid py-4">
//       {/* Page heading */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <div className="d-flex align-items-center gap-2 mb-2">
//             <div className="rounded-3 p-2 bg-primary-subtle text-primary">
//               <Bot size={25} />
//             </div>

//             <h1 className="h3 mb-0">AI Assistant</h1>
//           </div>

//           <p className="text-secondary mb-0">
//             Get AI-powered guidance for teaching and student performance.
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
//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-white py-3">
//           <div className="d-flex align-items-center gap-2">
//             <div className="rounded-circle bg-primary-subtle text-primary p-2">
//               <Sparkles size={19} />
//             </div>

//             <div>
//               <h2 className="h6 mb-1">GradeLens AI</h2>
//               <small className="text-secondary">
//                 Classroom-aware AI assistance
//               </small>
//             </div>
//           </div>
//         </div>

//         {/* Conversation */}
//         <div
//           className="card-body p-3 p-md-4"
//           style={{ minHeight: '360px' }}
//         >
//           {messages.length === 0 ? (
//             <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
//               <div className="rounded-circle bg-primary-subtle text-primary p-3 mb-3">
//                 <MessageSquare size={30} />
//               </div>

//               <h2 className="h5 mb-2">How can I help you today?</h2>

//               <p
//                 className="text-secondary mb-4"
//                 style={{ maxWidth: '460px' }}
//               >
//                 Select a classroom and ask a question about its students,
//                 performance, or learning improvement.
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
//         </div>

//         {/* Question form */}
//         <div className="card-footer bg-white p-3 p-md-4">
//           <form onSubmit={handleAsk}>
//             <div className="mb-3">
//               <label
//                 htmlFor="ai-classroom"
//                 className="form-label fw-semibold"
//               >
//                 Select classroom
//               </label>

//               <select
//                 id="ai-classroom"
//                 className="form-select"
//                 value={classroomId}
//                 onChange={(event) => setClassroomId(event.target.value)}
//                 disabled={
//                   classroomsLoading ||
//                   loading ||
//                   classrooms.length === 0
//                 }
//                 required
//               >
//                 <option value="">
//                   {classroomsLoading
//                     ? 'Loading classrooms...'
//                     : 'Choose a classroom'}
//                 </option>

//                 {classrooms.map((classroom) => (
//                   <option key={classroom.id} value={classroom.id}>
//                     {classroom.name} — Grade {classroom.gradeLevel}
//                     {classroom.section ? ` (${classroom.section})` : ''}
//                   </option>
//                 ))}
//               </select>

//               {classroomError && (
//                 <div className="text-danger small mt-2" role="alert">
//                   {classroomError}
//                 </div>
//               )}

//               {!classroomsLoading &&
//                 !classroomError &&
//                 classrooms.length === 0 && (
//                   <div className="text-secondary small mt-2">
//                     No classrooms available. Create a classroom first.
//                   </div>
//                 )}
//             </div>

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
//                 placeholder="Ask about students, performance, or teaching strategies..."
//                 value={question}
//                 onChange={(event) => setQuestion(event.target.value)}
//                 disabled={loading}
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
//                   !classroomId ||
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
// ----------------------------------------------------------------------------------------

import {   useEffect,
  useState,
    useRef,
  type FormEvent,
  type KeyboardEvent, } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  LoaderCircle,
  MessageSquare,
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

export default function AIAssistant() {
  const { user } = useAuth()
const conversationEndRef = useRef<HTMLDivElement>(null)

  const isStudent = user?.role === 'STUDENT'

  const isAdminOrTeacher =
    user?.role === 'ADMIN' || user?.role === 'TEACHER'

  const canUseAssistant = isStudent || isAdminOrTeacher

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [classroomId, setClassroomId] = useState('')
  const [classroomsLoading, setClassroomsLoading] = useState(true)
  const [classroomError, setClassroomError] = useState('')

  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const suggestedQuestions = isStudent
    ? studentSuggestedQuestions
    : staffSuggestedQuestions

    useEffect(() => {
  conversationEndRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  })
}, [messages, loading])

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
const handleQuestionKeyDown = (
  event: KeyboardEvent<HTMLTextAreaElement>,
) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
    event.preventDefault()

    if (
      question.trim() &&
      !loading &&
      !(isAdminOrTeacher && classroomsLoading) &&
      !(isAdminOrTeacher && !classroomId)
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

    // ADMIN and TEACHER must select a classroom.
    // STUDENT can ask general questions without a linked classroom.
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
  }

  if (!canUseAssistant) {
    return (
      <div className="container-fluid py-3">
        <div className="alert alert-warning" role="alert">
          The AI Assistant is available to students, teachers, and administrators.
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-3">
      {/* Page heading */}
      {/* <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"> */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-3 p-2 bg-primary-subtle text-primary">
              <Bot size={25} />
            </div>

            <h1 className="h3 mb-0">AI Assistant</h1>
          </div>

          <p className="text-secondary mb-0">
            {isStudent
              ? 'Get personalized learning guidance and help with your academic progress.'
              : 'Get AI-powered guidance for teaching and student performance.'}
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearConversation}
            disabled={loading}
          >
            <Trash2 size={16} className="me-2" />
            Clear conversation
          </button>
        )}
      </div>

      {/* Assistant card */}
      {/* <div className="card border-0 shadow-sm"> */}
      <div
  className="card border-0 shadow-sm"
  style={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  }}
>
        <div className="card-header bg-white py-3">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-primary-subtle text-primary p-2">
              <Sparkles size={19} />
            </div>

            <div>
              <h2 className="h6 mb-1">GradeLens AI</h2>
              <small className="text-secondary">
                {isStudent
                  ? 'Your personal learning assistant'
                  : 'Classroom-aware AI assistance'}
              </small>
            </div>
          </div>
        </div>

        {/* Conversation */}
        {/* <div
          className="card-body p-3 p-md-4"
          style={{ minHeight: '360px' }}
        > */}
       <div
  className="card-body p-3 p-md-4 overflow-y-auto"
  style={{
    height: 'min(70vh, 760px)',
    minHeight: '400px',
    overflowWrap: 'anywhere',
    scrollBehavior: 'smooth',
  }}
>
          {messages.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
              <div className="rounded-circle bg-primary-subtle text-primary p-3 mb-3">
                <MessageSquare size={30} />
              </div>

              <h2 className="h5 mb-2">
                {isStudent
                  ? 'How can I help you learn today?'
                  : 'How can I help you today?'}
              </h2>

              <p
                className="text-secondary mb-4"
                style={{ maxWidth: '460px' }}
              >
                {isStudent
                  ? classroomId
                    ? 'Ask about your academic progress, quiz results, homework, or ways to improve your learning.'
                    : 'Ask general questions about GradeLens AI, study strategies, learning, and academic improvement.'
                  : 'Select a classroom and ask a question about its students, performance, or learning improvement.'}
              </p>

              <div
                className="d-flex flex-column gap-2 w-100"
                style={{ maxWidth: '560px' }}
              >
                {suggestedQuestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="btn btn-outline-secondary text-start"
                    onClick={() => setQuestion(suggestion)}
                    disabled={loading}
                  >
                    <Sparkles
                      size={15}
                      className="me-2 text-primary"
                    />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex gap-3 ${
                    message.role === 'user'
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  <div
                    className={`rounded-circle p-2 flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-secondary-subtle text-secondary'
                        : 'bg-primary-subtle text-primary'
                    }`}
                    style={{ height: '38px' }}
                    aria-hidden="true"
                  >
                    {message.role === 'user' ? (
                      <User size={21} />
                    ) : (
                      <Bot size={21} />
                    )}
                  </div>

                  <div
                    className={`rounded-3 px-3 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-body-tertiary'
                    }`}
                    style={{
                      maxWidth: '85%',
                      minWidth: 0,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <div className="small fw-semibold mb-2">
                      {message.role === 'user' ? 'You' : 'GradeLens AI'}
                    </div>

                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary-subtle text-primary p-2">
                    <Bot size={21} />
                  </div>

                  <div className="bg-body-tertiary rounded-3 px-3 py-3">
                    <LoaderCircle
                      size={17}
                      className="me-2"
                      style={{
                        verticalAlign: 'text-bottom',
                        animation: 'spin 1s linear infinite',
                      }}
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

        {/* Question form */}
       
        <div
  className="card-footer bg-white p-2 p-md-3"
  style={{
    position: 'sticky',
    bottom: 0,
    zIndex: 2,
    flexShrink: 0,
  }}
>
          <form onSubmit={handleAsk}>
            {/* Only ADMIN and TEACHER choose a classroom. */}
            {isAdminOrTeacher && (
              <div className="mb-3">
                <label
                  htmlFor="ai-classroom"
                  className="form-label fw-semibold"
                >
                  Select classroom
                </label>

                <select
                  id="ai-classroom"
                  className="form-select"
                  value={classroomId}
                  onChange={(event) => setClassroomId(event.target.value)}
                  disabled={
                    classroomsLoading ||
                    loading ||
                    classrooms.length === 0
                  }
                  required
                >
                  <option value="">
                    {classroomsLoading
                      ? 'Loading classrooms...'
                      : 'Choose a classroom'}
                  </option>

                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} — Grade {classroom.gradeLevel}
                      {classroom.section ? ` (${classroom.section})` : ''}
                    </option>
                  ))}
                </select>

                {classroomError && (
                  <div className="text-danger small mt-2" role="alert">
                    {classroomError}
                  </div>
                )}

                {!classroomsLoading &&
                  !classroomError &&
                  classrooms.length === 0 && (
                    <div className="text-secondary small mt-2">
                      No classrooms available. Create a classroom first.
                    </div>
                  )}
              </div>
            )}

            {isStudent && classroomError && (
              <div className="alert alert-warning py-2" role="alert">
                We couldn't load your classroom. You can still ask general
                questions.
              </div>
            )}

            <label
              htmlFor="ai-question"
              className="form-label fw-semibold"
            >
              Your question
            </label>

            <div className="d-flex align-items-end gap-2">
              <textarea
                id="ai-question"
                className="form-control"
                rows={2}
                placeholder={
                  isStudent
                    ? 'Ask about learning, study strategies, or your academic progress...'
                    : 'Ask about students, performance, or teaching strategies...'
                }
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                 onKeyDown={handleQuestionKeyDown}
                // disabled={loading || classroomsLoading}
                disabled={
  loading ||
  (isAdminOrTeacher && classroomsLoading)
}
                maxLength={3000}
                required
              />

              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ minHeight: '46px', minWidth: '48px' }}
                disabled={
                  loading ||
                  classroomsLoading ||
                  (isAdminOrTeacher && !classroomId) ||
                  !question.trim()
                }
                aria-label="Send question"
                title="Send question"
              >
                {loading ? (
                  <LoaderCircle
                    size={19}
                    style={{
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : (
                  <Send size={19} />
                )}
              </button>
            </div>

            <div className="d-flex justify-content-between flex-wrap gap-2 mt-2">
              <small className="text-secondary">
                AI-generated answers may need verification.
              </small>

              <small className="text-secondary">
                {question.length}/3000 characters
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
