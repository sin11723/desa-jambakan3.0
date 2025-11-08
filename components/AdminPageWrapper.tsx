"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import SidebarToggle from "@/components/SidebarToggle"
import AdminLogoutWarning from "@/components/AdminLogoutWarning"

interface AdminPageWrapperProps {
  children: React.ReactNode
  title: string
  description?: string
}

export default function AdminPageWrapper({ children, title, description }: AdminPageWrapperProps) {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/admin")
      return
    }
    setLoading(false)
  }, [isAuthenticated, router, isClient])

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Tombol Toggle Sidebar */}
      <SidebarToggle />
      
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {description && <p className="text-muted-foreground text-base md:text-lg">{description}</p>}
      </div>

      <div className="max-w-full md:max-w-6xl">
        {children}
      </div>
      <AdminLogoutWarning />
    </div>
  )
}