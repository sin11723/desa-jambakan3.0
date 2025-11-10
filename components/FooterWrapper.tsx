"use client"

import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

export default function FooterWrapper() {
  const pathname = usePathname()
  const showOnHome = pathname === "/"
  return showOnHome ? <Footer /> : null
}