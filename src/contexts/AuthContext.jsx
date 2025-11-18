import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for session ID in URL
    const params = new URLSearchParams(window.location.search)
    const sessionParam = params.get('session')

    if (sessionParam) {
      // Store session ID
      localStorage.setItem('sessionId', sessionParam)
      setSessionId(sessionParam)
      
      // Clean URL
      window.history.replaceState({}, document.title, '/')
      
      // Fetch session info
      fetchSession(sessionParam)
    } else {
      // Check for existing session
      const storedSessionId = localStorage.getItem('sessionId')
      if (storedSessionId) {
        setSessionId(storedSessionId)
        fetchSession(storedSessionId)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const fetchSession = async (sid) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/session/${sid}`)
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Session invalid or expired
        localStorage.removeItem('sessionId')
        setSessionId(null)
      }
    } catch (error) {
      console.error('Error fetching session:', error)
      localStorage.removeItem('sessionId')
      setSessionId(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login')
      const data = await response.json()
      
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error('Error initiating login:', error)
    }
  }

  const logout = async () => {
    if (sessionId) {
      try {
        await fetch(`http://localhost:3000/auth/logout/${sessionId}`, {
          method: 'POST',
        })
      } catch (error) {
        console.error('Error logging out:', error)
      }
    }
    
    localStorage.removeItem('sessionId')
    setSessionId(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, sessionId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
