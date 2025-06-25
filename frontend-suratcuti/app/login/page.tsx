"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(identifier, password)
    } catch (err: any) {
      setError(err.message || "Email/NIP atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-30"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                <Image
                  src="/logo-kementan.png"
                  alt="Logo Kementerian Pertanian"
                  width={80}
                  height={80}
                  priority
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Informasi Cuti</h1>
          <p className="text-lg text-green-700 font-medium">Kementerian Pertanian Republik Indonesia</p>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto"></div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-2xl text-gray-800">Masuk ke Sistem</CardTitle>
            <CardDescription className="text-gray-600">
              Silakan masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email / NIP
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="Masukkan email atau NIP Anda"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="pl-4 pr-4 py-3 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-4 pr-4 py-3 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">© 2024 Kementerian Pertanian Republik Indonesia</p>
          <p className="text-xs text-gray-500 mt-1">Sistem Informasi Pengajuan Cuti Pegawai</p>
        </div>
      </div>
    </div>
  )
}
