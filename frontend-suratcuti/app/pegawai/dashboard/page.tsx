"use client"

import { useEffect, useState } from "react"
import { PegawaiLayout } from "@/components/layout/pegawai-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Calendar, Clock, CheckCircle, User, TrendingUp, FileText } from "lucide-react"

interface KuotaCuti {
  total: number
  terpakai: number
  sisa: number
}

interface CutiTerbaru {
  id: number
  jenisCuti: {
    nama: string
  }
  tanggalMulai: string
  tanggalSelesai: string
  status: "DIAJUKAN" | "DISETUJUI" | "DITOLAK"
}

export default function PegawaiDashboard() {
  const [kuota, setKuota] = useState<KuotaCuti | null>(null)
  const [cutiTerbaru, setCutiTerbaru] = useState<CutiTerbaru[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [kuotaResponse, cutiResponse] = await Promise.all([api.get("/kuota"), api.get("/cuti?limit=5")])

      if (kuotaResponse && kuotaResponse.data) {
        setKuota(kuotaResponse.data)
      }
      if (cutiResponse && Array.isArray(cutiResponse.data)) {
        setCutiTerbaru(cutiResponse.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISETUJUI":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
            Disetujui
          </Badge>
        )
      case "DITOLAK":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-md">Ditolak</Badge>
        )
      case "DIAJUKAN":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md">
            Menunggu
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <PegawaiLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        </div>
      </PegawaiLayout>
    )
  }

  return (
    <PegawaiLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100">
              <User className="h-6 w-6 text-green-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Dashboard Pegawai
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Selamat datang di portal pengajuan cuti</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {/* Kuota Cuti Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Kuota</CardTitle>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{kuota?.total || 0}</div>
                <p className="text-xs text-gray-500 mt-1">hari per tahun</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Terpakai</CardTitle>
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{kuota?.terpakai || 0}</div>
                <p className="text-xs text-orange-500 mt-1">hari</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Sisa Kuota</CardTitle>
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{kuota?.sisa || 0}</div>
                <p className="text-xs text-green-500 mt-1">hari</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {kuota && (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span>Penggunaan Kuota Cuti</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-700">Terpakai: {kuota.terpakai} hari</span>
                    <span className="text-gray-700">Sisa: {kuota.sisa} hari</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${(kuota.terpakai / kuota.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2 inline-block">
                      <span className="font-semibold text-green-600">
                        {((kuota.terpakai / kuota.total) * 100).toFixed(1)}%
                      </span>{" "}
                      dari total kuota telah digunakan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cuti Terbaru */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span>Pengajuan Cuti Terbaru</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cutiTerbaru.map((cuti) => (
                  <div
                    key={cuti.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{cuti.jenisCuti.nama}</h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(cuti.tanggalMulai).toLocaleDateString("id-ID")} -{" "}
                          {new Date(cuti.tanggalSelesai).toLocaleDateString("id-ID")}
                        </span>
                      </p>
                    </div>
                    <div>{getStatusBadge(cuti.status)}</div>
                  </div>
                ))}

                {cutiTerbaru.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Belum ada pengajuan cuti</p>
                    <p className="text-gray-400 text-sm mt-1">Mulai ajukan cuti pertama Anda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PegawaiLayout>
  )
}
