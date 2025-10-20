import { createContext, useContext, useState, useEffect } from 'react'
import comicApis from '@/apis/comicApis'
import { User } from '@/types/data'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for token on initial load
    const token = localStorage.getItem('auth_token')
    return !!token
  })
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Fetch user data on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const response = await comicApis.getCustomerInfo(token)
          localStorage.setItem('customerInfo', JSON.stringify(response))
          setUser(response)
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('customerInfo')
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const logout = async () => {
    setIsLoading(true)
    try {
      // Since there's no logout endpoint in comicApis, we'll just clear local state
      localStorage.removeItem('auth_token')
      localStorage.removeItem('customerInfo')
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    try {
      // TODO: Implement social login when API is available
      console.warn(`Social login with ${provider} not implemented yet`)
      throw new Error(`${provider} login not implemented`)
    } catch (error) {
      console.error('Social login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout,
        socialLogin
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
