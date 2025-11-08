"use client"

import { PanelLeftOpen, X } from "lucide-react"
import { useSidebar } from "@/contexts/SidebarContext"

export default function SidebarToggle() {
  const { toggleSidebar, isSidebarOpen } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className="md:hidden fixed top-4 left-4 z-50 bg-primary/90 text-primary-foreground p-2 rounded-lg hover:bg-primary transition-colors"
      aria-label={isSidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
    >
      {isSidebarOpen ? <X size={20} /> : <PanelLeftOpen size={20} />}
    </button>
  )
}