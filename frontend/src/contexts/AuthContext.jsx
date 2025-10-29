import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('tax_bot_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const loginWithGoogle = async () => {
    // Simulate Google OAuth login
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'google_' + Date.now(),
          name: 'Demo User',
          email: 'demo@example.com',
          provider: 'google',
          picture: 'https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=fff'
        }
        setUser(mockUser)
        localStorage.setItem('tax_bot_user', JSON.stringify(mockUser))
        resolve(mockUser)
      }, 1000)
    })
  }

  const loginWithMicrosoft = async () => {
    // Simulate Microsoft OAuth login
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'microsoft_' + Date.now(),
          name: 'Demo User',
          email: 'demo@microsoft.com',
          provider: 'microsoft',
          picture: 'https://ui-avatars.com/api/?name=Demo+User&background=764ba2&color=fff'
        }
        setUser(mockUser)
        localStorage.setItem('tax_bot_user', JSON.stringify(mockUser))
        resolve(mockUser)
      }, 1000)
    })
  }

  const loginWithEmail = async (email, password) => {
    // Simulate email/password login
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'email_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          provider: 'email',
          picture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=48bb78&color=fff`
        }
        setUser(mockUser)
        localStorage.setItem('tax_bot_user', JSON.stringify(mockUser))
        resolve(mockUser)
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tax_bot_user')
  }

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithEmail,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
