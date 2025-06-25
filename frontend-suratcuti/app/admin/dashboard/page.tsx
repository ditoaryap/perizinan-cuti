"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, Calendar, BarChart3 } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LaporanData {
  jumlah_pengajuan: number
  disetujui: number
  ditolak: number
  diajukan: number
  cuti_terbanyak: string
  total_pegawai: number
  total_jenis_cuti: number
}

export default function AdminDashboard() {
  const [laporan, setLaporan] = useState<LaporanData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLaporan()
  }, [])

  const fetchLaporan = async () => {
    try {
      const currentDate = new Date()
      const bulan = currentDate.getMonth() + 1
      const tahun = currentDate.getFullYear()

      const response = await api.get(`/laporan?bulan=${bulan}&tahun=${tahun}`)
      if (response && response.data) {
        setLaporan(response.data)
      }
    } catch (error) {
      console.error("Error fetching laporan:", error)
    } finally {
      setLoading(false)
    }
  }

  const pieData = laporan
    ? [
        { name: "Disetujui", value: laporan.disetujui, color: "#10b981" },
        { name: "Ditolak", value: laporan.ditolak, color: "#ef4444" },
        { name: "Menunggu", value: laporan.diajukan, color: "#f59e0b" },
      ]
    : []

  const barData = laporan
    ? [
        { name: "Total", value: laporan.jumlah_pengajuan },
        { name: "Disetujui", value: laporan.disetujui },
        { name: "Ditolak", value: laporan.ditolak },
        { name: "Menunggu", value: laporan.diajukan },
      ]
    : []

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Dashboard Admin
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Ringkasan pengajuan cuti bulan ini</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Pengajuan</CardTitle>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{laporan?.jumlah_pengajuan || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Pengajuan bulan ini</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Disetujui</CardTitle>
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{laporan?.disetujui || 0}</div>
                <p className="text-xs text-green-500 mt-1">Sudah disetujui</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Ditolak</CardTitle>
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                  <XCircle className="h-5 w-5 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-red-600">{laporan?.ditolak || 0}</div>
                <p className="text-xs text-red-500 mt-1">Tidak disetujui</p>
            </CardContent>
          </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Menunggu</CardTitle>
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{laporan?.diajukan || 0}</div>
                <p className="text-xs text-yellow-500 mt-1">Perlu persetujuan</p>
            </CardContent>
          </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Pegawai</CardTitle>
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-gray-900">{laporan?.total_pegawai || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Total pegawai aktif</p>
            </CardContent>
          </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Jenis Cuti</CardTitle>
                <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-gray-900">{laporan?.total_jenis_cuti || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Total jenis cuti</p>
            </CardContent>
          </Card>
        </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span>Status Pengajuan</span>
                </CardTitle>
                <CardDescription className="text-gray-600">Distribusi status pengajuan cuti</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <span>Statistik Pengajuan</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Perbandingan jumlah pengajuan berdasarkan status
                </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span>Informasi Tambahan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Periode Laporan</p>
                      <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Jenis Cuti Terbanyak</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {laporan?.cuti_terbanyak && typeof laporan.cuti_terbanyak === "object"
                          ? `${laporan.cuti_terbanyak.nama} (${laporan.cuti_terbanyak.total} kali)`
                          : laporan?.cuti_terbanyak || "Tidak ada data"}
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
