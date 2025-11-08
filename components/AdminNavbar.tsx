"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, FileText, ImageIcon, Music, ShoppingBag, Users, LayoutDashboard, Menu, X, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { useSidebar } from "@/contexts/SidebarContext"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Kelola Tenun",
    icon: ShoppingBag,
    href: "/admin/kelola-tenun",
  },
  {
    title: "Kelola Berita",
    icon: FileText,
    href: "/admin/kelola-berita",
  },
  {
    title: "Kelola Galeri",
    icon: ImageIcon,
    href: "/admin/kelola-galeri",
  },
  {
    title: "Kelola Karawitan",
    icon: Music,
    href: "/admin/kelola-karawitan",
  },
  {
    title: "Kelola Struktur",
    icon: Users,
    href: "/admin/kelola-struktur",
  },
]

export default function AdminNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAdminAuth()
  const { isSidebarOpen, toggleSidebar } = useSidebar()

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground p-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors md:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Toggle Button - hanya saat sidebar tertutup */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="hidden md:flex fixed top-4 left-4 z-[60] bg-primary text-primary-foreground p-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Buka sidebar"
          title="Buka sidebar"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-background border-r border-border min-h-screen flex-shrink-0 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'
      } fixed left-0 top-0 z-40 md:relative`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="flex items-center gap-2 transition-all duration-300 flex-1">
                {/* Logo - selalu tampil */}
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">DJ</span>
                </div>
                {/* Teks - hanya tampil saat sidebar terbuka */}
                <div className={`whitespace-nowrap transition-all duration-300 ${
                  isSidebarOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 w-0 md:opacity-0 md:w-0'
                }`}>
                  <h1 className="font-bold text-xl text-primary">DESA JAMBAKAN</h1>
                  <p className="text-sm font-normal text-muted-foreground">Admin Panel</p>
                </div>
              </Link>

              {/* Toggle Button - hanya tombol tutup saat sidebar terbuka */}
              {isSidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="flex items-center justify-center bg-muted text-foreground w-8 h-8 rounded-lg border border-border hover:bg-muted/80 transition-colors flex-shrink-0"
                  aria-label="Tutup sidebar"
                  title="Tutup sidebar"
                >
                  <PanelLeftClose size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      } ${
                        isSidebarOpen ? 'justify-start' : 'justify-center md:justify-center'
                      }`}
                      title={!isSidebarOpen ? item.title : ''}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className={`transition-all duration-300 ${
                        isSidebarOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-4 w-0 md:opacity-0 md:translate-x-0 md:w-0'
                      }`}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout Menu - Bottom */}
          <div className="p-4 border-t border-border mt-auto">
            <button
              onClick={logout}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground ${
                isSidebarOpen ? 'justify-start' : 'justify-center md:justify-center'
              }`}
              title={!isSidebarOpen ? "Logout" : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className={`transition-all duration-300 ${
                isSidebarOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-4 w-0 md:opacity-0 md:translate-x-0 md:w-0'
              }`}>
                Logout
              </span>
            </button>
          </div>

        </div>
      </aside>
    </>
  )
}