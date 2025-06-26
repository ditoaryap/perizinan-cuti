"use client"

import type React from "react"
import Cookies from "js-cookie"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  nama: string
  role: "admin" | "pegawai"
  email?: string
  nip?: string
  jabatan?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const savedToken = Cookies.get("token")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      Cookies.remove("token")
      localStorage.removeItem("user")
    } finally {
    setLoading(false)
    }
  }, [])

  const login = async (identifier: string, password: string) => {
      const response = await fetch("http://localhost:5004/api/auth/login", {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier, password }),
      })

      const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login gagal")
      }

    if (!data.token || !data.user) {
      throw new Error("Respons dari server tidak valid.")
    }

    Cookies.set("token", data.token, { expires: 1 })
      localStorage.setItem("user", JSON.stringify(data.user))

      setToken(data.token)
      setUser(data.user)

      if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/pegawai/dashboard")
    }
  }

  const logout = () => {
    Cookies.remove("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
