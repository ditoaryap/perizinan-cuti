"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PegawaiLayout } from "@/components/layout/pegawai-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import { Calendar, Send, Info } from "lucide-react"

interface JenisCuti {
  id: number
  nama: string
}

export default function AjukanCuti() {
  const [jenisCuti, setJenisCuti] = useState<JenisCuti[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [formData, setFormData] = useState({
    jenisCutiId: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
  })

  useEffect(() => {
    fetchJenisCuti()
  }, [])

  const fetchJenisCuti = async () => {
    try {
      const response = await api.get("/jenis-cuti")
      if (response && Array.isArray(response.data)) {
        setJenisCuti(response.data)
      } else {
        setJenisCuti([])
      }
    } catch (error) {
      console.error("Error fetching jenis cuti:", error)
      setJenisCuti([])
    }
  }

  const validateDates = () => {
    const startDate = new Date(formData.tanggalMulai)
    const endDate = new Date(formData.tanggalSelesai)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return "Tanggal mulai tidak boleh kurang dari hari ini"
    }

    if (endDate < startDate) {
      return "Tanggal selesai tidak boleh kurang dari tanggal mulai"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dateError = validateDates()
    if (dateError) {
      setMessage(dateError)
      setMessageType("error")
      return
    }

    if (!formData.alasan.trim()) {
      setMessage("Alasan cuti harus diisi")
      setMessageType("error")
      return
    }

    setLoading(true)
    try {
      const payload = {
        jenisCutiId: formData.jenisCutiId,
        tanggalMulai: formData.tanggalMulai,
        tanggalSelesai: formData.tanggalSelesai,
        alasan: formData.alasan,
      };
      await api.post("/cuti", payload)
      setMessage("Pengajuan cuti berhasil disubmit")
      setMessageType("success")
      setFormData({
        jenisCutiId: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        alasan: "",
      })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengajukan cuti. Silakan coba lagi."
      setMessage(errorMessage)
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PegawaiLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Formulir Pengajuan Cuti</h1>
          <p className="text-gray-500">Isi formulir di bawah ini untuk membuat pengajuan cuti baru.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
        <Card>
          <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="mr-3 h-5 w-5 text-green-600" />
                  Detail Pengajuan Cuti
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
                    <Label htmlFor="jenis_cuti" className="font-medium">Jenis Cuti</Label>
                <Select
                      value={formData.jenisCutiId}
                      onValueChange={(value) => setFormData({ ...formData, jenisCutiId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis cuti" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisCuti.map((jenis) => (
                      <SelectItem key={jenis.id} value={jenis.id.toString()}>
                        {jenis.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                      <Label htmlFor="tanggal_mulai" className="font-medium">Tanggal Mulai</Label>
                  <Input
                    id="tanggal_mulai"
                    type="date"
                        value={formData.tanggalMulai}
                        onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                    required
                  />
                </div>

                <div>
                      <Label htmlFor="tanggal_selesai" className="font-medium">Tanggal Selesai</Label>
                  <Input
                    id="tanggal_selesai"
                    type="date"
                        value={formData.tanggalSelesai}
                        onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                    <Label htmlFor="alasan" className="font-medium">Alasan Cuti</Label>
                <Textarea
                  id="alasan"
                      placeholder="Jelaskan alasan lengkap dan tujuan pengajuan cuti Anda..."
                  value={formData.alasan}
                  onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                  rows={4}
                  required
                />
              </div>

                  <div className="flex justify-end">
              <Button
                type="submit"
                      disabled={loading || !formData.jenisCutiId || !formData.tanggalMulai || !formData.tanggalSelesai}
                      className="min-w-[150px] bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  "Memproses..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                          Kirim Pengajuan
                  </>
                )}
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
                  <Info className="mr-3 h-5 w-5" />
                  Informasi Penting
                </CardTitle>
          </CardHeader>
          <CardContent>
                <ul className="space-y-3 text-sm text-emerald-700 list-disc list-inside">
                  <li>Pengajuan cuti harus disubmit minimal 3 hari sebelum tanggal pelaksanaan.</li>
                  <li>Pastikan tanggal yang dipilih tidak bertabrakan dengan hari libur nasional atau cuti yang sudah disetujui.</li>
                  <li>Alasan cuti harus diisi dengan jelas dan dapat dipertanggungjawabkan.</li>
                  <li>Status pengajuan dapat dipantau melalui halaman Riwayat Cuti.</li>
                </ul>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </PegawaiLayout>
  )
}
