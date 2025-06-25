"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import { Edit, Trash2, Users, Search, UserPlus, Shield, User } from "lucide-react"

interface Pegawai {
  id: number
  nama: string
  email: string
  nip: string
  jabatan: string
  role: "admin" | "pegawai"
}

export default function DataPegawai() {
  const [pegawai, setPegawai] = useState<Pegawai[]>([])
  const [filteredPegawai, setFilteredPegawai] = useState<Pegawai[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nip: "",
    jabatan: "",
    role: "pegawai" as "admin" | "pegawai",
  })

  useEffect(() => {
    fetchPegawai()
  }, [])

  useEffect(() => {
    filterPegawai()
  }, [pegawai, searchTerm])

  const fetchPegawai = async () => {
    try {
      const response = await api.get("/users")
      if (response && Array.isArray(response.data)) {
        setPegawai(response.data)
      } else {
        console.error("Data fetched is not an array:", response)
        setPegawai([])
      }
    } catch (error) {
      console.error("Error fetching pegawai:", error)
      setPegawai([])
    } finally {
      setLoading(false)
    }
  }

  const filterPegawai = () => {
    if (!searchTerm) {
      setFilteredPegawai(pegawai)
      return
    }

    const filtered = pegawai.filter(
      (p) =>
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPegawai(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPegawai) {
        await api.put(`/users/${editingPegawai.id}`, formData)
        setMessage("Data pegawai berhasil diupdate")
      } else {
        await api.post("/users", formData)
        setMessage("Pegawai berhasil ditambahkan")
      }

      setDialogOpen(false)
      setEditingPegawai(null)
      setFormData({
        nama: "",
        email: "",
        password: "",
        nip: "",
        jabatan: "",
        role: "pegawai",
      })
      fetchPegawai()
    } catch (error) {
      setMessage("Gagal menyimpan data pegawai")
    }
  }

  const handleEdit = (pegawai: Pegawai) => {
    setEditingPegawai(pegawai)
    setFormData({
      nama: pegawai.nama,
      email: pegawai.email,
      password: "",
      nip: pegawai.nip,
      jabatan: pegawai.jabatan,
      role: (pegawai.role || "pegawai").toLowerCase() as "admin" | "pegawai",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
      try {
        await api.delete(`/users/${id}`)
        setMessage("Pegawai berhasil dihapus")
        fetchPegawai()
      } catch (error) {
        setMessage("Gagal menghapus pegawai")
      }
    }
  }

  const getRoleCount = (role: string) => {
    return pegawai.filter((p) => p.role && p.role.toLowerCase() === role.toLowerCase()).length
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
            <Users className="h-6 w-6 text-green-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Data Pegawai
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Kelola data pegawai dan akun pengguna</p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pegawai</p>
                  <p className="text-3xl font-bold text-gray-900">{pegawai.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin</p>
                  <p className="text-3xl font-bold text-purple-600">{getRoleCount("admin")}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pegawai</p>
                  <p className="text-3xl font-bold text-green-600">{getRoleCount("pegawai")}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, email, NIP, atau jabatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPegawai(null)
                  setFormData({
                    nama: "",
                    email: "",
                    password: "",
                    nip: "",
                    jabatan: "",
                    role: "pegawai",
                  })
                }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                    <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pegawai
              </Button>
            </DialogTrigger>
                <DialogContent className="sm:max-w-md">
              <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                      {editingPegawai ? "Edit Pegawai" : "Tambah Pegawai"}
                    </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                <div>
                        <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                          className="focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nip">NIP</Label>
                        <Input
                          id="nip"
                          value={formData.nip}
                          onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                          required
                          className="focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                        className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                      <Label htmlFor="password">
                        Password {editingPegawai && "(kosongkan jika tidak ingin mengubah)"}
                      </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingPegawai}
                        className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                    <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input
                    id="jabatan"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    required
                          className="focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "pegawai") => setFormData({ ...formData, role: value })}
                  >
                          <SelectTrigger className="focus:border-green-500 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pegawai">Pegawai</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                      </div>
                </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                  {editingPegawai ? "Update" : "Tambah"} Pegawai
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
          </CardContent>
        </Card>

        {message && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Daftar Pegawai ({filteredPegawai.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Pegawai
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      NIP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Jabatan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPegawai.map((p, index) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                              p.role && p.role.toLowerCase() === "admin"
                                ? "bg-gradient-to-br from-purple-400 to-purple-500"
                                : "bg-gradient-to-br from-green-400 to-emerald-500"
                            }`}
                          >
                            {p.nama.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{p.nama}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{p.nip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {p.jabatan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            p.role && p.role.toLowerCase() === "admin"
                              ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800"
                              : "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800"
                          }`}
                        >
                          {p.role ? p.role.charAt(0).toUpperCase() + p.role.slice(1).toLowerCase() : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(p)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPegawai.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? "Tidak ada pegawai yang sesuai dengan pencarian" : "Tidak ada data pegawai"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ? "Coba ubah kata kunci pencarian" : "Tambah pegawai pertama untuk memulai"}
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
