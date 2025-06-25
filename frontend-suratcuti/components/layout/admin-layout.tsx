"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Users, Calendar, BarChart3, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Data Pengajuan", href: "/admin/pengajuan", icon: FileText },
  { name: "Data Pegawai", href: "/admin/pegawai", icon: Users },
  { name: "Jenis Cuti", href: "/admin/jenis-cuti", icon: Calendar },
  { name: "Laporan", href: "/admin/laporan", icon: BarChart3 },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white/95 backdrop-blur-lg shadow-2xl">
          <div className="flex h-20 items-center justify-center px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <Image src="/logo-kementan.png" alt="Logo" width={40} height={40} />
              <div>
                <h1 className="text-md font-bold text-gray-800">Sistem Cuti</h1>
                <p className="text-xs text-gray-500">Kementerian Pertanian</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500 group-hover:text-green-600")}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-20 items-center justify-center px-4 border-b">
            <div className="flex items-center space-x-3">
              <Image src="/logo-kementan.png" alt="Logo" width={40} height={40} />
              <div>
                <h1 className="text-md font-bold text-gray-800">Sistem Cuti</h1>
                <p className="text-xs text-gray-500">Kementerian Pertanian</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon
                    className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-500")}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
             <p className="text-xs text-center text-gray-400">© Kementan RI {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-700 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden sm:flex items-center space-x-3">
                <p className="text-sm font-semibold text-gray-700">{user?.nama}</p>
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
