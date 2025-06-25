import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistem Pengajuan Cuti - Kementan RI",
  description: "Sistem Informasi Pengajuan Cuti Pegawai Kementerian Pertanian Republik Indonesia",
  generator: "v0.dev",
  icons: {
    icon: "/logo-kementan.png",
    apple: "/logo-kementan.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
