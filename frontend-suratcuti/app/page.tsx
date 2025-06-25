"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/pegawai/dashboard")
        }
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return null
}
