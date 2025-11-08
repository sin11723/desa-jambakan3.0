"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, FileText, ImageIcon, Music, ShoppingBag, Users, PanelLeftOpen } from "lucide-react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import AdminPageWrapper from "@/components/AdminPageWrapper"

interface User {
  id: number
  username: string
  email: string
}

interface DashboardStats {
  totalTenun: number
  totalActivities: number
  totalGallery: number
  totalKarawitan: number
  totalStruktur: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalTenun: 0,
    totalActivities: 0,
    totalGallery: 0,
    totalKarawitan: 0,
    totalStruktur: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    const fetchStats = async () => {
      try {
        const [tenun, activities, gallery, karawitan, struktur] = await Promise.all([
          fetch("/api/tenun").then((r) => r.json()),
          fetch("/api/activities").then((r) => r.json()),
          fetch("/api/gallery").then((r) => r.json()),
          fetch("/api/karawitan").then((r) => r.json()),
          fetch("/api/struktur").then((r) => r.json()),
        ])

        setStats({
          totalTenun: tenun.length || 0,
          totalActivities: activities.length || 0,
          totalGallery: gallery.length || 0,
          totalKarawitan: karawitan.length || 0,
          totalStruktur: struktur.length || 0,
        })
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <AdminPageWrapper title="Loading..." description="">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminPageWrapper>
    )
  }

  const menuItems = [
    {
      title: "Kelola Tenun",
      icon: ShoppingBag,
      href: "/admin/kelola-tenun",
      count: stats.totalTenun,
      description: "Tambah, edit, atau hapus karya tenun",
    },
    {
      title: "Kelola Berita",
      icon: FileText,
      href: "/admin/kelola-berita",
      count: stats.totalActivities,
      description: "Kelola berita dan kegiatan desa",
    },
    {
      title: "Kelola Galeri",
      icon: ImageIcon,
      href: "/admin/kelola-galeri",
      count: stats.totalGallery,
      description: "Kelola foto dan dokumentasi desa",
    },
    {
      title: "Kelola Karawitan",
      icon: Music,
      href: "/admin/kelola-karawitan",
      count: stats.totalKarawitan,
      description: "Kelola konten karawitan",
    },
    {
      title: "Kelola Struktur",
      icon: Users,
      href: "/admin/kelola-struktur",
      count: stats.totalStruktur,
      description: "Kelola struktur organisasi desa",
    },
  ]

  return (
    <AdminPageWrapper 
      title="Dashboard Admin" 
      description="Kelola konten website Desa Jambakan"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Tenun</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalTenun}</p>
                </div>
                <ShoppingBag size={32} className="text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Berita</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalActivities}</p>
                </div>
                <FileText size={32} className="text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Galeri</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalGallery}</p>
                </div>
                <ImageIcon size={32} className="text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Karawitan</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalKarawitan}</p>
                </div>
                <Music size={32} className="text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Struktur</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalStruktur}</p>
                </div>
                <Users size={32} className="text-primary opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-background border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon size={32} className="text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground">{item.count}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </AdminPageWrapper>
  )
}
