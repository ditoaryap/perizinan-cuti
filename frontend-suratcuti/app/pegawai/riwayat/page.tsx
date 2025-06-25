"use client"

import { useEffect, useState } from "react"
import { PegawaiLayout } from "@/components/layout/pegawai-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Download, History, PlusCircle } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RiwayatCuti {
  id: number
  jenisCuti: {
    nama: string
  }
  tanggalMulai: string
  tanggalSelesai: string
  status: "DIAJUKAN" | "DISETUJUI" | "DITOLAK"
  alasan: string
  createdAt: string
}

export default function RiwayatCuti() {
  const [riwayat, setRiwayat] = useState<RiwayatCuti[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRiwayat()
  }, [])

  const fetchRiwayat = async () => {
    try {
      const response = await api.get("/cuti")
      if (response && Array.isArray(response.data)) {
        setRiwayat(response.data)
      } else {
        setRiwayat([])
      }
    } catch (error) {
      console.error("Error fetching riwayat:", error)
      setRiwayat([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async (id: number, nama: string) => {
    try {
      const blob = await api.downloadPdf(`/cuti/${id}/pdf`)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `surat-cuti-${nama}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading PDF:", error)
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

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  if (loading) {
    return (
      <PegawaiLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </PegawaiLayout>
    )
  }

  return (
    <PegawaiLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Pengajuan Cuti</h1>
          <p className="text-gray-500">
            Lihat semua riwayat pengajuan cuti Anda dan unduh surat cuti yang telah disetujui.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Riwayat</CardTitle>
            <CardDescription>
              Total {riwayat.length} pengajuan telah ditemukan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis Cuti</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-center">Durasi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riwayat.length > 0 ? (
                  riwayat.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.jenisCuti.nama}</div>
                        <div className="text-xs text-gray-500">Diajukan: {new Date(item.createdAt).toLocaleDateString("id-ID")}</div>
                      </TableCell>
                      <TableCell>{`${new Date(item.tanggalMulai).toLocaleDateString(
                        "id-ID",
                      )} - ${new Date(item.tanggalSelesai).toLocaleDateString("id-ID")}`}</TableCell>
                       <TableCell className="text-center">
                        {calculateDays(item.tanggalMulai, item.tanggalSelesai)} hari
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        {item.status === "DISETUJUI" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPdf(item.id, item.jenisCuti.nama)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Unduh PDF
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <History className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                      <p className="font-medium text-gray-600">Belum ada riwayat pengajuan.</p>
                      <p className="text-sm text-gray-500">
                        Anda bisa membuat pengajuan baru.
                      </p>
                      <Button asChild variant="link" className="mt-2">
                        <Link href="/pegawai/ajukan">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Ajukan Cuti Baru
                        </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
              )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PegawaiLayout>
  )
}
