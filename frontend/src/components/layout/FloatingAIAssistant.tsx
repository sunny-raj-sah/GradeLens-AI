
import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  Bot,
  X,
  Send,
  LoaderCircle,
  MessageCircle,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getClassrooms } from '../../services/classroom.service'
import { askAI } from '../../services/ai.service'
import { getApiError } from '../../services/getApiError'

 interface Classroom {
  id: string
  name: string
  gradeLevel: string
  section?: string | null
  academicYear: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'gradelens-floating-ai-chat'

function readSavedMessages(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as ChatMessage[] : []
  } catch {
    return []
  }
}

export default function FloatingAIAssistant() {
  const { user } = useAuth()
  // const isAuthorized = user?.role === 'ADMIN' || user?.role === 'TEACHER'
  const isStudent = user?.role === 'STUDENT'
const isStaff = user?.role === 'ADMIN' || user?.role === 'TEACHER'

const isAuthorized = isStudent || isStaff

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(readSavedMessages)
  const [question, setQuestion] = useState('')
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [classroomId, setClassroomId] = useState('')
  const [loadingClassrooms, setLoadingClassrooms] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // Keep the conversation usable if browser storage is unavailable.
    }
  }, [messages])

  // useEffect(() => {
  //   if (!isAuthorized) return

  //   let active = true

  //   async function loadClassrooms() {
  //     try {
  //       const result = await getClassrooms()

  //       if (!active) return

  //       setClassrooms(result)
  //       setClassroomId((current) =>
  //         current && result.some((item) => item.id === current)
  //           ? current
  //           : result[0]?.id ?? '',
  //       )
  //     } catch (err) {
  //       if (active) {
  //         setError(getApiError(err, 'Unable to load classrooms.'))
  //       }
  //     } finally {
  //       if (active) setLoadingClassrooms(false)
  //     }
  //   }

  //   void loadClassrooms()

  //   return () => {
  //     active = false
  //   }
  // }, [isAuthorized])


 useEffect(() => {
  if (!isAuthorized) return;

  let active = true;

  async function loadClassrooms() {
    try {
      const result = await getClassrooms();

      if (!active) return;

      setClassrooms(result);
      setClassroomId((current) =>
        current && result.some((item) => item.id === current)
          ? current
          : result[0]?.id ?? "",
      );
    } catch (err) {
      if (active) {
        setError(getApiError(err, "Unable to load classrooms."));
      }
    } finally {
      if (active) {
        setLoadingClassrooms(false);
      }
    }
  }

  void loadClassrooms();

  return () => {
    active = false;
  };
}, [isAuthorized]);

  useEffect(() => {
    if (!isOpen) return

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending, isOpen])

  useEffect(() => {
    if (isOpen) {
      const timer = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(timer)
    }
  }, [isOpen])

  if (!isAuthorized) return null

  // async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault()

  //   const trimmedQuestion = question.trim()

  //   if (!trimmedQuestion || sending) return

  //   if (!classroomId) {
  //     setError('Please select a classroom before asking a question.')
  //     return
  //   }

  //   const userMessage: ChatMessage = {
  //     id: crypto.randomUUID(),
  //     role: 'user',
  //     content: trimmedQuestion,
  //   }

  //   setMessages((current) => [...current, userMessage])
  //   setQuestion('')
  //   setError('')
  //   setSending(true)

  //   try {
  //     const result = await askAI({
  //       classroomId,
  //       question: trimmedQuestion,
  //     })

  //     const assistantMessage: ChatMessage = {
  //       id: crypto.randomUUID(),
  //       role: 'assistant',
  //       content: result.answer,
  //     }

  //     setMessages((current) => [...current, assistantMessage])
  //   } catch (err) {
  //     setError(getApiError(err, 'Unable to get an AI response. Please try again.'))
  //   } finally {
  //     setSending(false)
  //     requestAnimationFrame(() => inputRef.current?.focus())
  //   }
  // }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const trimmedQuestion = question.trim()

  if (!trimmedQuestion || sending) return

  // Admins and teachers must select a classroom.
  // Students can ask general questions without one.
  if (isStaff && (loadingClassrooms || !classroomId)) {
    setError('Please select a classroom before asking a question.')
    return
  }

  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: trimmedQuestion,
  }

  setMessages((current) => [...current, userMessage])
  setQuestion('')
  setError('')
  setSending(true)

  try {
    const result = await askAI({
      ...(classroomId ? { classroomId } : {}),
      question: trimmedQuestion,
    })

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result.answer,
    }

    setMessages((current) => [...current, assistantMessage])
  } catch (err) {
    setError(
      getApiError(
        err,
        'Unable to get an AI response. Please try again.',
      ),
    )
  } finally {
    setSending(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }
}

  function clearConversation() {
    setMessages([])
    setError('')
  }

  return (
    <div className="gl-floating-ai">
      {isOpen && (
        <section
          className="gl-ai-panel"
          role="dialog"
          aria-label="GradeLens AI Assistant"
          aria-modal="false"
        >
          <header className="gl-ai-header">
            <div className="d-flex align-items-center gap-2">
              <div className="gl-ai-avatar">
                <Bot size={21} />
              </div>

              <div>
                <div className="fw-semibold">GradeLens AI</div>
                <div className="small gl-ai-subtitle">
                  Learning insights assistant
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="gl-ai-icon-button"
                onClick={clearConversation}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <Trash2 size={17} />
              </button>

              <button
                type="button"
                className="gl-ai-icon-button"
                onClick={() => setIsOpen(false)}
                title="Minimize assistant"
                aria-label="Minimize assistant"
              >
                <X size={19} />
              </button>
            </div>
          </header>
                {isStaff && (
          <div className="gl-ai-classroom">
            <label htmlFor="gl-ai-classroom" className="form-label">
              Ask about classroom
            </label>

            <select
              id="gl-ai-classroom"
              className="form-select form-select-sm"
              value={classroomId}
              onChange={(event) => setClassroomId(event.target.value)}
              disabled={loadingClassrooms || classrooms.length === 0 || sending}
            >
              <option value="">
                {loadingClassrooms
                  ? 'Loading classrooms...'
                  : classrooms.length === 0
                    ? 'No classrooms available'
                    : 'Select classroom'}
              </option>

              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                  {classroom.section ? ` - Section ${classroom.section}` : ''}
                </option>
              ))}
            </select>
          </div>
)}
          <div className="gl-ai-messages" aria-live="polite">
            {messages.length === 0 && (
              <div className="gl-ai-welcome">
                <div className="gl-ai-welcome-icon">
                  <MessageCircle size={24} />
                </div>

                {/* <h6>How can I help?</h6>

                <p>
                  Ask a question about classroom performance, quiz scores,
                  homework, or students who may need support.
                </p> */}
                <h6>
  {isStudent ? 'Your learning assistant' : 'How can I help?'}
</h6>

<p>
  {isStudent
    ? classroomId
      ? 'Ask about your quiz results, homework, academic progress, or ways to improve your learning.'
      : 'Ask general questions about GradeLens AI, learning, study strategies, and academic improvement.'
    : 'Ask a question about classroom performance, quiz scores, homework, or students who may need support.'}
</p>

                <button
                  type="button"
                  className="gl-ai-suggestion"
                  onClick={() =>
                    setQuestion('Summarize the classroom performance.')
                  }
                >
                  Summarize classroom performance
                </button>

                <button
                  type="button"
                  className="gl-ai-suggestion"
                  onClick={() =>
                    setQuestion('Which students may need additional support?')
                  }
                >
                  Identify students needing support
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`gl-ai-message ${
                  message.role === 'user'
                    ? 'gl-ai-message-user'
                    : 'gl-ai-message-assistant'
                }`}
              >
                {message.content}
              </div>
            ))}

            {sending && (
              <div className="gl-ai-message gl-ai-message-assistant gl-ai-typing">
                <LoaderCircle size={15} className="gl-ai-spinner" />
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="gl-ai-error" role="alert">
              {error}
            </div>
          )}

          <form className="gl-ai-composer" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Ask anything..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              // disabled={sending || loadingClassrooms || !classroomId}

              disabled={
  sending ||
  (isStaff && (loadingClassrooms || !classroomId))
}

              aria-label="Ask the AI assistant a question"
            />

            <button
              type="submit"
              className="gl-ai-send"
              // disabled={!question.trim() || sending || !classroomId}
              disabled={
  !question.trim() ||
  sending ||
  (isStaff && (loadingClassrooms || !classroomId))
}
              aria-label="Send question"
            >
              {sending ? (
                <LoaderCircle size={18} className="gl-ai-spinner" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>

          <div className="gl-ai-footer">
            AI responses may need verification.
          </div>
        </section>
      )}

      <button
        type="button"
        className="gl-ai-fab"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        title="Ask GradeLens AI"
      >
        {isOpen ? <X size={25} /> : <Bot size={27} />}
      </button>
    </div>
  )
}
