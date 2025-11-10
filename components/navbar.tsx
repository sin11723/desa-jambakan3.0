"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const isAdminPath = pathname.startsWith('/admin')

  if (isAdminPath) {
    return null
  }
  const [isOpen, setIsOpen] = useState(false)
  const [isBudayaOpen, setIsBudayaOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileCloseTimeoutRef = useRef<number | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBudayaOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const navItems = [{ label: "Beranda", href: "/" }]

  const navItemsAfterBudaya = [
    { label: "Berita", href: "/berita" },
    { label: "Galeri", href: "/galeri" },
  ]

  const budayaItems = [
    { label: "Tenun", href: "/tenun" },
    { label: "Karawitan", href: "/karawitan" },
  ]

  const profileItems = [
    { label: "Sejarah Desa", href: "/profile" },
    { label: "Peta Desa", href: "/peta" },
    { label: "Struktur Desa", href: "/struktur" },
  ]

  // Hover-intent helpers for Profile dropdown to prevent quick hide
  const openProfile = () => {
    if (profileCloseTimeoutRef.current) {
      clearTimeout(profileCloseTimeoutRef.current)
      profileCloseTimeoutRef.current = null
    }
    setIsProfileOpen(true)
  }

  const scheduleProfileClose = () => {
    if (profileCloseTimeoutRef.current) {
      clearTimeout(profileCloseTimeoutRef.current)
    }
    profileCloseTimeoutRef.current = window.setTimeout(() => {
      setIsProfileOpen(false)
      profileCloseTimeoutRef.current = null
    }, 200)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className={`flex justify-between items-center ${scrolled ? 'h-16' : 'h-20'} transition-all`}>
          <Link href="/" className="flex items-center gap-3 group -ml-2 lg:-ml-4">
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Klaten_Regency.svg"
              alt="Lambang Kabupaten Klaten"
              className="w-12 h-12"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wider group-hover:scale-[1.02] transition-transform">
                DESA JAMBAKAN
              </span>
              <span className="text-sm sm:text-base text-muted-foreground/80 font-medium">
                Kabupaten Klaten
              </span>
            </div>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/90 font-semibold hover:text-primary transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            <div
              className="relative"
              ref={profileRef}
              onMouseEnter={openProfile}
              onMouseLeave={scheduleProfileClose}
            >
              <button
                onClick={() => {
                  if (isProfileOpen) {
                    setIsProfileOpen(false)
                  } else {
                    openProfile()
                  }
                }}
                className="text-foreground/90 font-semibold hover:text-primary transition-colors duration-300 relative group flex items-center gap-1"
              >
                Profile
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </button>

              {isProfileOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-background/90 backdrop-blur rounded-lg shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseEnter={openProfile}
                  onMouseLeave={scheduleProfileClose}
                >
                  {profileItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Budaya Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsBudayaOpen(true)}
              onMouseLeave={() => setIsBudayaOpen(false)}
            >
              <button
                onClick={() => setIsBudayaOpen(!isBudayaOpen)}
                className="text-foreground/90 font-semibold hover:text-primary transition-colors duration-300 relative group flex items-center gap-1"
              >
                Budaya
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isBudayaOpen ? "rotate-180" : ""}`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </button>

              {isBudayaOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-background/90 backdrop-blur rounded-lg shadow-lg border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {budayaItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsBudayaOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItemsAfterBudaya.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/90 font-semibold hover:text-primary transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 flex flex-col gap-3 bg-background/95 backdrop-blur animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground font-semibold hover:text-primary py-2 px-4 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="px-4">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-foreground font-semibold hover:text-primary py-2 rounded transition-colors flex items-center gap-1 w-full text-left"
              >
                Profile
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {profileItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-muted-foreground font-medium hover:text-foreground py-1 transition-colors"
                      onClick={() => {
                        setIsOpen(false)
                        setIsProfileOpen(false)
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Budaya Section */}
            <div className="px-4">
              <button
                onClick={() => setIsBudayaOpen(!isBudayaOpen)}
                className="text-foreground font-semibold hover:text-primary py-2 rounded transition-colors flex items-center gap-1 w-full text-left"
              >
                Budaya
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isBudayaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isBudayaOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {budayaItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-muted-foreground font-medium hover:text-foreground py-1 transition-colors"
                      onClick={() => {
                        setIsOpen(false)
                        setIsBudayaOpen(false)
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItemsAfterBudaya.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground font-semibold hover:text-primary py-2 px-4 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
