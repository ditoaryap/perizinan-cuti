"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Calendar, Eye, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface JenisCuti {
  id: number
  nama: string
  deskripsi?: string | null
  maxHari: number
}

export default function JenisCutiPage() {
  const [jenisCuti, setJenisCuti] = useState<JenisCuti[]>([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
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

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Jenis Cuti</h1>
          <p className="text-gray-500">
            Kelola daftar jenis cuti yang tersedia untuk pegawai.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Jenis Cuti</CardTitle>
            <CardDescription>
              Total {jenisCuti.length} jenis cuti ditemukan. Data ini bersifat readonly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nama Jenis Cuti</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-center">Kuota Maksimal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {jenisCuti.length > 0 ? (
                  jenisCuti.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell className="text-gray-600">{item.deskripsi || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{item.maxHari} hari</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                      <p className="font-medium text-gray-600">Belum ada data jenis cuti.</p>
                       <p className="text-sm text-gray-500">
                        Data jenis cuti dikelola oleh sistem.
              </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
