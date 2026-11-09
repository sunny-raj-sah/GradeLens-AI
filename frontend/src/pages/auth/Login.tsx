 

// // import { useEffect, useState, type FormEvent } from 'react'
// import {  useState, type FormEvent } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { getApiError } from '../../services/getApiError'

// interface LoginProps {
//   initialEmail?: string
//   initialPassword?: string
//   onClose?: () => void
//   onSwitchToRegister?: () => void
// }

// export default function Login({
//   initialEmail = '',
//   initialPassword = '',
//   onClose,
//   onSwitchToRegister,
// }: LoginProps) {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const embedded = Boolean(onClose)

//   const [email, setEmail] = useState(initialEmail)
//   const [password, setPassword] = useState(initialPassword)
//   const [error, setError] = useState('')
//   const [submitting, setSubmitting] = useState(false)

//   // useEffect(() => {
//   //   setEmail(initialEmail)
//   //   setPassword(initialPassword)
//   //   setError('')
//   // }, [initialEmail, initialPassword])

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setError('')
//     setSubmitting(true)

//     try {
//       await login({
//         email: email.trim(),
//         password,
//       })

//       navigate('/dashboard', { replace: true })
//     } catch (err: unknown) {
//       setError(getApiError(err, 'Login failed. Please try again.'))
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className={embedded ? '' : 'container py-5'}>
//       <div className={embedded ? '' : 'row justify-content-center'}>
//         <div className={embedded ? '' : 'col-12 col-md-7 col-lg-5'}>
//           <div className={`card border-0 ${embedded ? '' : 'shadow-sm'}`}>
//             <div className="card-body p-4 p-md-5">
//               <h1 className="h3 fw-bold mb-2">
//                 Welcome to GradeLens AI
//               </h1>

//               <p className="text-secondary mb-4">
//                 Sign in to continue to your dashboard.
//               </p>

//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="login-email" className="form-label">
//                     Email address
//                   </label>

//                   <input
//                     id="login-email"
//                     type="email"
//                     className="form-control"
//                     autoComplete="username"
//                     value={email}
//                     onChange={(event) => setEmail(event.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="login-password" className="form-label">
//                     Password
//                   </label>

//                   <input
//                     id="login-password"
//                     type="password"
//                     className="form-control"
//                     autoComplete="current-password"
//                     value={password}
//                     onChange={(event) => setPassword(event.target.value)}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                   disabled={submitting}
//                 >
//                   {submitting ? 'Signing in...' : 'Sign in'}
//                 </button>
//               </form>

//               <p className="text-center text-secondary mt-4 mb-0">
//                 Don't have an account?{' '}
//                 {onSwitchToRegister ? (
//                   <button
//                     type="button"
//                     className="btn btn-link p-0 align-baseline"
//                     onClick={onSwitchToRegister}
//                   >
//                     Create one
//                   </button>
//                 ) : (
//                   <Link to="/register">Create one</Link>
//                 )}
//               </p>

//               {embedded && (
//                 <button
//                   type="button"
//                   className="btn btn-link w-100 mt-2"
//                   onClick={onClose}
//                 >
//                   Back to landing page
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// -----------------------------------------------------------
// new 

// import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { getApiError } from '../../services/getApiError'

// interface LoginProps {
//   initialEmail?: string
//   initialPassword?: string
//   onClose?: () => void
//   onSwitchToRegister?: () => void
// }

// export default function Login({
//   initialEmail = '',
//   initialPassword = '',
//   onClose,
//   onSwitchToRegister,
// }: LoginProps) {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const embedded = Boolean(onClose)

//   const [email, setEmail] = useState(initialEmail)
//   const [password, setPassword] = useState(initialPassword)
//   const [error, setError] = useState('')
//   const [submitting, setSubmitting] = useState(false)

//   const emailRef = useRef<HTMLInputElement>(null)
//   const passwordRef = useRef<HTMLInputElement>(null)

//   // Validate email format and require .com
//   const validateEmail = (value: string) => {
//     const emailRegex =
//       /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+com$/i

//     return emailRegex.test(value.trim())
//   }

//   // Clear previous email validation error
//   const handleEmailChange = (value: string) => {
//     emailRef.current?.setCustomValidity('')
//     setEmail(value)
//   }

//   // Handle Enter key for Email field
//   const handleEmailKeyDown = (
//     event: KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (event.key === 'Enter') {
//       event.preventDefault()

//       const emailInput = event.currentTarget

//       if (!emailInput.value.trim()) {
//         emailInput.reportValidity()
//         return
//       }

//       if (!emailInput.checkValidity()) {
//         emailInput.reportValidity()
//         return
//       }

//       if (!validateEmail(emailInput.value)) {
//         emailInput.setCustomValidity(
//           'Please enter a valid email address ending with .com'
//         )

//         emailInput.reportValidity()
//         return
//       }

//       emailInput.setCustomValidity('')
//       passwordRef.current?.focus()
//     }
//   }

//   // Handle Enter key for Password field
//   const handlePasswordKeyDown = (
//     event: KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (event.key === 'Enter') {
//       event.preventDefault()

//       if (!event.currentTarget.checkValidity()) {
//         event.currentTarget.reportValidity()
//         return
//       }

//       event.currentTarget.form?.requestSubmit()
//     }
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()

//     const emailInput = emailRef.current

//     if (!emailInput) return

//     if (!validateEmail(email)) {
//       emailInput.setCustomValidity(
//         'Please enter a valid email address ending with .com'
//       )

//       emailInput.reportValidity()
//       return
//     }

//     emailInput.setCustomValidity('')

//     setError('')
//     setSubmitting(true)

//     try {
//       await login({
//         email: email.trim(),
//         password,
//       })

//       navigate('/dashboard', { replace: true })
//     } catch (err: unknown) {
//       setError(getApiError(err, 'Login failed. Please try again.'))
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className={embedded ? '' : 'container py-5'}>
//       <div className={embedded ? '' : 'row justify-content-center'}>
//         <div className={embedded ? '' : 'col-12 col-md-7 col-lg-5'}>
//           <div className={`card border-0 ${embedded ? '' : 'shadow-sm'}`}>
//             <div className="card-body p-4 p-md-5">
//               <h1 className="h3 fw-bold mb-2">
//                 Welcome to GradeLens AI
//               </h1>

//               <p className="text-secondary mb-4">
//                 Sign in to continue to your dashboard.
//               </p>

//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="login-email" className="form-label">
//                     Email address <span className="text-danger">*</span>
//                   </label>

//                   <input
//                     ref={emailRef}
//                     id="login-email"
//                     type="email"
//                     className="form-control"
//                     autoComplete="username"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(event) =>
//                       handleEmailChange(event.target.value)
//                     }
//                     onKeyDown={handleEmailKeyDown}
//                     pattern=".+@.+\.com"
//                     title="Please enter a valid email address ending with .com"
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="login-password" className="form-label">
//                     Password <span className="text-danger">*</span>
//                   </label>

//                   <input
//                     ref={passwordRef}
//                     id="login-password"
//                     type="password"
//                     className="form-control"
//                     autoComplete="current-password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(event) => setPassword(event.target.value)}
//                     onKeyDown={handlePasswordKeyDown}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                   disabled={submitting}
//                 >
//                   {submitting ? 'Signing in...' : 'Sign in'}
//                 </button>
//               </form>

//               <p className="text-center text-secondary mt-4 mb-0">
//                 Don't have an account?{' '}
//                 {onSwitchToRegister ? (
//                   <button
//                     type="button"
//                     className="btn btn-link p-0 align-baseline"
//                     onClick={onSwitchToRegister}
//                   >
//                     Create one
//                   </button>
//                 ) : (
//                   <Link to="/register">Create one</Link>
//                 )}
//               </p>

//               {embedded && (
//                 <button
//                   type="button"
//                   className="btn btn-link w-100 mt-2"
//                   onClick={onClose}
//                 >
//                   Back to landing page
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// -------------------------------------------------
// new 

import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getApiError } from '../../services/getApiError'

interface LoginProps {
  initialEmail?: string
  initialPassword?: string
  onClose?: () => void
  onSwitchToRegister?: () => void
}

export default function Login({
  initialEmail = '',
  initialPassword = '',
  onClose,
  onSwitchToRegister,
}: LoginProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const embedded = Boolean(onClose)

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState(initialPassword)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Validate email format (supports .com, .test, and other valid domains)
  // const validateEmail = (value: string) => {
  //   const emailRegex =
  //     /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,}$/i

  //   return emailRegex.test(value.trim())
  // }
// Validate specific GradeLens emails + general .com email format
const validateEmail = (value: string) => {
  const allowedEmails = [
    'admin@gradelens.test',
    'teacher@gradelens.test',
    'student1@example.com',
  ]

  const email = value.trim().toLowerCase()

  const emailRegex =
    /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+com$/i

  return allowedEmails.includes(email) || emailRegex.test(email)
}
  // Clear previous email validation error
  const handleEmailChange = (value: string) => {
    emailRef.current?.setCustomValidity('')
    setEmail(value)
  }

  // Handle Enter key for Email field
  const handleEmailKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      const emailInput = event.currentTarget

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        emailInput.setCustomValidity(
          'Please enter a valid email address.'
        )
        emailInput.reportValidity()
        return
      }

      emailInput.setCustomValidity('')
      passwordRef.current?.focus()
    }
  }

  // Handle Enter key for Password field
  const handlePasswordKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (!event.currentTarget.checkValidity()) {
        event.currentTarget.reportValidity()
        return
      }

      event.currentTarget.form?.requestSubmit()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const emailInput = emailRef.current
    const passwordInput = passwordRef.current

    if (!emailInput || !passwordInput) return

    if (!validateEmail(email)) {
      emailInput.setCustomValidity(
        'Please enter a valid email address.'
      )
      emailInput.reportValidity()
      return
    }

    emailInput.setCustomValidity('')

    if (password.length < 6) {
      passwordInput.setCustomValidity(
        'Password must be at least 6 characters long.'
      )
      passwordInput.reportValidity()
      return
    }

    passwordInput.setCustomValidity('')

    setError('')
    setSubmitting(true)

    try {
      await login({
        email: email.trim(),
        password,
      })

      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(getApiError(err, 'Login failed. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={embedded ? '' : 'container py-5'}>
      <div className={embedded ? '' : 'row justify-content-center'}>
        <div className={embedded ? '' : 'col-12 col-md-7 col-lg-5'}>
          <div className={`card border-0 ${embedded ? '' : 'shadow-sm'}`}>
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 fw-bold mb-2">
                Welcome to GradeLens AI
              </h1>

              <p className="text-secondary mb-4">
                Sign in to continue to your dashboard.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label">
                    Email address <span className="text-danger">*</span>
                  </label>

                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    className="form-control"
                    autoComplete="username"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      handleEmailChange(event.target.value)
                    }
                    onKeyDown={handleEmailKeyDown}
                    title="Please enter a valid email address."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="login-password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>

                  <input
                    ref={passwordRef}
                    id="login-password"
                    type="password"
                    className="form-control"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      passwordRef.current?.setCustomValidity('')
                      setPassword(event.target.value)
                    }}
                    onKeyDown={handlePasswordKeyDown}
                    minLength={6}
                    title="Password must be at least 6 characters long."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Don't have an account?{' '}
                {onSwitchToRegister ? (
                  <button
                    type="button"
                    className="btn btn-link p-0 align-baseline"
                    onClick={onSwitchToRegister}
                  >
                    Create one
                  </button>
                ) : (
                  <Link to="/register">Create one</Link>
                )}
              </p>

              {embedded && (
                <button
                  type="button"
                  className="btn btn-link w-100 mt-2"
                  onClick={onClose}
                >
                  Back to landing page
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
