"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import {
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft,
  User,
  CalendarDays,
  Activity,
} from "lucide-react"
import Link from "next/link"

interface DetailPengajuan {
  id: number
  user: {
    nama: string
    nip: string
    jabatan: string
  }
  jenisCuti: {
    nama: string
  }
  tanggalMulai: string
  tanggalSelesai: string
  status: "DIAJUKAN" | "DISETUJUI" | "DITOLAK"
  alasan: string
  createdAt: string
}

export default function DetailPengajuan() {
  const params = useParams()
  const router = useRouter()
  const [pengajuan, setPengajuan] = useState<DetailPengajuan | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchDetail()
    }
  }, [params.id])

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/cuti/${params.id}`)
      if (response && response.data) {
        setPengajuan(response.data)
      }
    } catch (error) {
      console.error("Error fetching detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await api.put(`/cuti/${params.id}/approve`)
      setMessage("Pengajuan berhasil disetujui")
      fetchDetail()
    } catch (error) {
      setMessage("Gagal menyetujui pengajuan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      await api.put(`/cuti/${params.id}/reject`)
      setMessage("Pengajuan berhasil ditolak")
      fetchDetail()
    } catch (error) {
      setMessage("Gagal menolak pengajuan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.downloadPdf(`/cuti/${params.id}/pdf`)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `surat-cuti-${pengajuan?.user.nama}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setMessage("Gagal mengunduh PDF")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISETUJUI":
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
      case "DITOLAK":
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
      case "DIAJUKAN":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!pengajuan) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Data pengajuan tidak ditemukan</p>
          <Link href="/admin/pengajuan">
            <Button className="mt-4">Kembali ke Daftar</Button>
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
          <div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/pengajuan">
                <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Pengajuan
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Detail Pengajuan Cuti
          </h1>
          <p className="text-gray-500">
            Tinjau detail pengajuan dan ambil tindakan (setujui/tolak).
          </p>
        </div>

        {message && (
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Card Data Pemohon */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-3 h-5 w-5 text-green-600" />
                  Data Pemohon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="font-medium">Nama Pegawai</div>
                  <div>{pengajuan.user.nama}</div>
                  <div className="font-medium">NIP</div>
                  <div>{pengajuan.user.nip || "-"}</div>
                  <div className="font-medium">Jabatan</div>
                  <div>{pengajuan.user.jabatan || "-"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Card Detail Pengajuan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CalendarDays className="mr-3 h-5 w-5 text-green-600" />
                  Detail Pengajuan Cuti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="font-medium">Jenis Cuti</div>
                  <div>{pengajuan.jenisCuti.nama}</div>
                  <div className="font-medium">Tanggal Mulai</div>
                  <div>
                    {new Date(pengajuan.tanggalMulai).toLocaleDateString(
                      "id-ID",
                      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </div>
                  <div className="font-medium">Tanggal Selesai</div>
                  <div>
                    {new Date(pengajuan.tanggalSelesai).toLocaleDateString(
                      "id-ID",
                      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </div>
                  <div className="font-medium">Durasi</div>
                  <div>
                    {calculateDays(
                      pengajuan.tanggalMulai,
                      pengajuan.tanggalSelesai,
                    )}{" "}
                    hari
                  </div>
                  <div className="font-medium">Tanggal Pengajuan</div>
                  <div>
                    {new Date(pengajuan.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="pt-2">
                  <p className="font-medium">Alasan Pengajuan</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md mt-1 border">
                    {pengajuan.alasan}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Status & Aksi */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="mr-3 h-5 w-5 text-green-600" />
                  Status & Aksi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Status Saat Ini</p>
                  {getStatusBadge(pengajuan.status)}
                </div>

                {pengajuan.status === "DIAJUKAN" && (
                  <div className="space-y-2 pt-2">
                    <p className="font-medium">Ambil Tindakan</p>
                    <Button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Setujui
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={actionLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Tolak
                    </Button>
                  </div>
                )}

                {pengajuan.status === "DISETUJUI" && (
                   <div className="space-y-2 pt-2">
                     <p className="font-medium">Surat Cuti</p>
                     <Button
                      onClick={handleDownloadPdf}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Unduh PDF
                  </Button>
                   </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
