
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
// import api from '../services/api'
import {
  loginUser,
  registerUser,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from '../services/auth.service'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser) as AuthUser)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    }

    setLoading(false)
  }, [])

  async function login(input: LoginInput) {
    const result = await loginUser(input)

    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('user', JSON.stringify(result.user))
    setUser(result.user)
  }

  async function register(input: RegisterInput) {
    const result = await registerUser(input)

    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('user', JSON.stringify(result.user))
    setUser(result.user)
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
