"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/footer"

export default function FooterWrapper() {
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  
  useEffect(() => {
    setIsAdminRoute(window.location.pathname.startsWith('/admin'))
  }, [])
  
  return isAdminRoute ? null : <Footer />
}