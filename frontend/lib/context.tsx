"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { loginAction, logoutAction } from "@/app/actions/auth"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // read non-httpOnly user cookie
    const cookieList = document.cookie
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith("user="))

    if (cookieList) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookieList.split("=")[1]))
        setUser(userData)
      } catch {}
    }

    setLoading(false)
  }, [])

  const login = async (token: string, userData: User) => {
    await loginAction(token, userData)
    setUser(userData)
  }

  const logout = async () => {
    await logoutAction()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
