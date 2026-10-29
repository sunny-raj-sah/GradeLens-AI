
// import { useState, type FormEvent } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { getApiError } from '../../services/getApiError'

// export default function Login() {
//   const { login } = useAuth()
//   const navigate = useNavigate()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [submitting, setSubmitting] = useState(false)

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setError('')
//     setSubmitting(true)

//     try {
//       await login({ email, password })
//       navigate('/dashboard', { replace: true })
//     } catch (err: unknown) {
//     //   const message =
//     //     err instanceof Error ? err.message : 'Login failed. Please try again.'
//     //   setError(message)
//     setError(getApiError(err, 'Please try again.'))
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="container py-5">
//       <div className="row justify-content-center">
//         <div className="col-12 col-md-7 col-lg-5">
//           <div className="card border-0 shadow-sm">
//             <div className="card-body p-4 p-md-5">
//               <h1 className="h3 fw-bold mb-2">Welcome to GradeLens AI</h1>
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
//                   <label htmlFor="email" className="form-label">
//                     Email address
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     className="form-control"
//                     autoComplete="email"
//                     value={email}
//                     onChange={(event) => setEmail(event.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="password" className="form-label">
//                     Password
//                   </label>
//                   <input
//                     id="password"
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
//                 Don't have an account? <Link to="/register">Create one</Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// ------------------------------------------------------------------------------
// new one

// import { useEffect, useState, type FormEvent } from 'react'
import {  useState, type FormEvent } from 'react'
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

  // useEffect(() => {
  //   setEmail(initialEmail)
  //   setPassword(initialPassword)
  //   setError('')
  // }, [initialEmail, initialPassword])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
                    Email address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>

                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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
