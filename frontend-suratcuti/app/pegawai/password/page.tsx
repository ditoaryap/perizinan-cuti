"use client"

import type React from "react"

import { useState } from "react"
import { PegawaiLayout } from "@/components/layout/pegawai-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import { KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react"

export default function UbahPassword() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateForm = () => {
    if (formData.newPassword.length < 6) {
      return "Password baru minimal 6 karakter"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return "Konfirmasi password tidak cocok"
    }

    if (formData.currentPassword === formData.newPassword) {
      return "Password baru harus berbeda dengan password lama"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setMessage(validationError)
      setMessageType("error")
      return
    }

    setLoading(true)
    try {
      await api.put("/user/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      setMessage("Password berhasil diubah")
      setMessageType("success")
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setMessage("Gagal mengubah password. Periksa password lama Anda.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PegawaiLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Keamanan Akun</h1>
          <p className="text-gray-500">
            Ubah password Anda secara berkala untuk menjaga keamanan akun.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
          <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <KeyRound className="mr-3 h-5 w-5 text-green-600" />
                  Formulir Ubah Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert
                    className={`mb-6 ${
                      messageType === 'error' ? 'border-red-500/50 bg-red-50' : 'border-green-500/50 bg-green-50'
                    }`}
              >
                     <AlertDescription
                      className={messageType === 'error' ? 'text-red-700' : 'text-green-700'}
                    >
                  {message}
                </AlertDescription>
              </Alert>
            )}

                <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                    <Label className="font-medium" htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    required
                        placeholder="Masukkan password Anda saat ini"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-gray-100"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                    <Label className="font-medium" htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                        placeholder="Masukkan password baru"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-gray-100"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                    <p className="text-xs text-gray-500 mt-2">Minimal 6 karakter, kombinasikan huruf dan angka.</p>
              </div>

              <div>
                    <Label className="font-medium" htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                        placeholder="Ketik ulang password baru Anda"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-gray-100"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="min-w-[150px] bg-green-600 hover:bg-green-700">
                      {loading ? "Memproses..." : "Simpan Password"}
              </Button>
                  </div>
            </form>
          </CardContent>
        </Card>
          </div>
           <div className="lg:col-span-1">
            <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
                <CardTitle className="flex items-center text-lg text-emerald-800">
                  <ShieldCheck className="mr-3 h-5 w-5" />
                  Tips Keamanan Password
                </CardTitle>
          </CardHeader>
          <CardContent>
                 <ul className="space-y-3 text-sm text-emerald-700 list-disc list-inside">
                  <li>Gunakan password yang kuat dan unik.</li>
                  <li>Kombinasikan huruf besar, huruf kecil, angka, dan simbol.</li>
                  <li>Jangan gunakan informasi pribadi yang mudah ditebak.</li>
                  <li>Ubah password secara berkala untuk meningkatkan keamanan.</li>
                  <li>Jangan pernah membagikan password Anda kepada siapa pun.</li>
                </ul>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </PegawaiLayout>
  )
}
