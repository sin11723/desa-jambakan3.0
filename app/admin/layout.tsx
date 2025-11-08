"use client"

import { usePathname } from "next/navigation"
import { AdminAuthProvider } from "@/contexts/AdminAuthContext"
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext"
import AdminNavbar from "@/components/AdminNavbar"

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useSidebar()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin'
  
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-primary/10 to-secondary/10">
        {children}
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AdminNavbar />
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <SidebarProvider>
        <AdminContent>
          {children}
        </AdminContent>
      </SidebarProvider>
    </AdminAuthProvider>
  )
}