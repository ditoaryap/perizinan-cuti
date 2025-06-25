"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { FileText, Download } from "lucide-react"

interface LaporanData {
  jumlah_pengajuan: number
  disetujui: number
  ditolak: number
  diajukan: number
  cuti_terbanyak: {
    nama: string
    total: number
  } | null
  periode: string
}

export default function Laporan() {
  const [laporan, setLaporan] = useState<LaporanData | null>(null)
  const [loading, setLoading] = useState(false)
  const [bulan, setBulan] = useState("")
  const [tahun, setTahun] = useState("")

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ]

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i
    return { value: year.toString(), label: year.toString() }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulan || !tahun) return

    setLoading(true)
    try {
      const response = await api.get(`/laporan?bulan=${bulan}&tahun=${tahun}`)
      if (response && response.data) {
      setLaporan({
          ...response.data,
        periode: `${months.find((m) => m.value === bulan)?.label} ${tahun}`,
      })
      }
    } catch (error) {
      console.error("Error fetching laporan:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadLaporanPdf = async (bulan: string, tahun: string) => {
    if (!bulan || !tahun) return;
    try {
      const blob = await api.downloadPdf(`/laporan/pdf?bulan=${bulan}&tahun=${tahun}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-cuti-${bulan}-${tahun}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Cuti</h1>
          <p className="text-gray-600">Generate laporan pengajuan cuti berdasarkan periode</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulan">Bulan</Label>
                  <Select value={bulan} onValueChange={setBulan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tahun">Tahun</Label>
                  <Select value={tahun} onValueChange={setTahun}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={loading || !bulan || !tahun}>
                {loading ? "Memuat..." : "Generate Laporan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {laporan && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Laporan Periode {laporan.periode}</span>
                  <Button variant="outline" size="sm" onClick={() => downloadLaporanPdf(bulan, tahun)} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    Cetak PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Pengajuan</p>
                        <p className="text-2xl font-bold text-blue-900">{laporan.jumlah_pengajuan}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Disetujui</p>
                        <p className="text-2xl font-bold text-green-900">{laporan.disetujui}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✕</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Ditolak</p>
                        <p className="text-2xl font-bold text-red-900">{laporan.ditolak}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⏳</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Menunggu</p>
                        <p className="text-2xl font-bold text-yellow-900">{laporan.diajukan}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Informasi Tambahan</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Jenis cuti terbanyak:</span>{' '}
                    {laporan.cuti_terbanyak
                      ? `${laporan.cuti_terbanyak.nama} (${laporan.cuti_terbanyak.total} kali)`
                      : 'Tidak ada data'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
