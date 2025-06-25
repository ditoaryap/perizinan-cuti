"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Eye, Search, Filter, FileText, Users } from "lucide-react"
import Link from "next/link"

interface Pengajuan {
  id: number
  user: {
    nama: string
  }
  jenisCuti: {
    nama: string
  }
  tanggalMulai: string
  tanggalSelesai: string
  status: "DIAJUKAN" | "DISETUJUI" | "DITOLAK"
}

export default function DataPengajuan() {
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([])
  const [filteredPengajuan, setFilteredPengajuan] = useState<Pengajuan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    fetchPengajuan()
  }, [])

  useEffect(() => {
    filterPengajuan()
  }, [pengajuan, searchTerm, statusFilter])

  const fetchPengajuan = async () => {
    try {
      const response = await api.get("/cuti")
      if (response && Array.isArray(response.data)) {
        setPengajuan(response.data)
      } else {
        setPengajuan([])
      }
    } catch (error) {
      console.error("Error fetching pengajuan:", error)
      setPengajuan([])
    } finally {
      setLoading(false)
    }
  }

  const filterPengajuan = () => {
    let filtered = pengajuan

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jenisCuti.nama.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredPengajuan(filtered)
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

  const getStatusCount = (status: string) => {
    return pengajuan.filter((item) => item.status === status).length
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent absolute top-0"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-100">
            <FileText className="h-6 w-6 text-green-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Data Pengajuan Cuti
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Kelola semua pengajuan cuti pegawai</p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pengajuan</p>
                  <p className="text-3xl font-bold text-gray-900">{pengajuan.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-3xl font-bold text-green-600">{getStatusCount("DISETUJUI")}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ditolak</p>
                  <p className="text-3xl font-bold text-red-600">{getStatusCount("DITOLAK")}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-3xl font-bold text-yellow-600">{getStatusCount("DIAJUKAN")}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-green-600" />
              <span>Filter & Pencarian</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama pegawai atau jenis cuti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white"
              >
                <option value="ALL">Semua Status</option>
                <option value="DIAJUKAN">Menunggu</option>
                <option value="DISETUJUI">Disetujui</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Daftar Pengajuan ({filteredPengajuan.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Nama Pegawai
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Jenis Cuti
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPengajuan.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {item.user.nama.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{item.user.nama}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.jenisCuti.nama}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="space-y-1">
                          <div>{new Date(item.tanggalMulai).toLocaleDateString("id-ID")}</div>
                          <div className="text-xs text-gray-400">
                            s/d {new Date(item.tanggalSelesai).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/pengajuan/${item.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPengajuan.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    {searchTerm || statusFilter !== "ALL"
                      ? "Tidak ada data yang sesuai dengan filter"
                      : "Tidak ada data pengajuan cuti"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm || statusFilter !== "ALL"
                      ? "Coba ubah kriteria pencarian"
                      : "Data akan muncul setelah ada pengajuan"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
