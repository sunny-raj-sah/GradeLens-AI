
// import { useState, type FormEvent } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { getApiError } from '../../services/getApiError'

// export default function Register() {
//   const { register } = useAuth()
//   const navigate = useNavigate()

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [submitting, setSubmitting] = useState(false)

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setError('')

//     if (password.length < 8 || password.length > 72) {
//       setError('Password must contain between 8 and 72 characters.')
//       return
//     }

//     setSubmitting(true)

//     try {
//       await register({ name, email, password })
//       navigate('/dashboard', { replace: true })
//     } catch (err: unknown) {
//     //   const message =
//     //     err instanceof Error
//     //       ? err.message
//     //       : 'Registration failed. Please try again.'
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
//               <h1 className="h3 fw-bold mb-2">Create your account</h1>
//               <p className="text-secondary mb-4">
//                 Get started with GradeLens AI.
//               </p>

//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Full name</label>
//                   <input
//                     id="name"
//                     type="text"
//                     className="form-control"
//                     autoComplete="name"
//                     value={name}
//                     onChange={(event) => setName(event.target.value)}
//                     minLength={2}
//                     maxLength={80}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="register-email" className="form-label">
//                     Email address
//                   </label>
//                   <input
//                     id="register-email"
//                     type="email"
//                     className="form-control"
//                     autoComplete="email"
//                     value={email}
//                     onChange={(event) => setEmail(event.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="register-password" className="form-label">
//                     Password
//                   </label>
//                   <input
//                     id="register-password"
//                     type="password"
//                     className="form-control"
//                     autoComplete="new-password"
//                     value={password}
//                     onChange={(event) => setPassword(event.target.value)}
//                     minLength={8}
//                     maxLength={72}
//                     required
//                   />
//                   <div className="form-text">
//                     Use between 8 and 72 characters.
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                   disabled={submitting}
//                 >
//                   {submitting ? 'Creating account...' : 'Create account'}
//                 </button>
//               </form>

//               <p className="text-center text-secondary mt-4 mb-0">
//                 Already registered? <Link to="/login">Sign in</Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// -----------------------------------------------------------------

// new one


import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getApiError } from '../../services/getApiError'

interface RegisterProps {
  onClose?: () => void
  onSwitchToLogin?: () => void
}

export default function Register({
  onClose,
  onSwitchToLogin,
}: RegisterProps) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const embedded = Boolean(onClose)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 8 || password.length > 72) {
      setError('Password must contain between 8 and 72 characters.')
      return
    }

    setSubmitting(true)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(getApiError(err, 'Registration failed. Please try again.'))
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
                Create your account
              </h1>

              <p className="text-secondary mb-4">
                Get started with GradeLens AI.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="register-name" className="form-label">
                    Full name
                  </label>

                  <input
                    id="register-name"
                    type="text"
                    className="form-control"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="register-email" className="form-label">
                    Email address
                  </label>

                  <input
                    id="register-email"
                    type="email"
                    className="form-control"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="register-password" className="form-label">
                    Password
                  </label>

                  <input
                    id="register-password"
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    maxLength={72}
                    required
                  />

                  <div className="form-text">
                    Use between 8 and 72 characters.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Already registered?{' '}
                {onSwitchToLogin ? (
                  <button
                    type="button"
                    className="btn btn-link p-0 align-baseline"
                    onClick={onSwitchToLogin}
                  >
                    Sign in
                  </button>
                ) : (
                  <Link to="/login">Sign in</Link>
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
