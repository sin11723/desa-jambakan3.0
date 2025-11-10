"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right"
type Variant = "title" | "image" | "text" | "card" | "cta"

interface AnimateInViewProps {
  children: React.ReactNode
  className?: string
  /** Milidetik penundaan transisi */
  delay?: number
  /** Arah animasi masuk */
  direction?: Direction
  /** Jalankan sekali saat pertama kali terlihat */
  once?: boolean
  /** Jarak slide awal dalam pixel */
  distance?: number
  /** Durasi transisi dalam milidetik */
  durationMs?: number
  /** Fungsi easing CSS */
  easing?: string
  /** Skala awal untuk efek masuk yang sangat halus; default 1 (menonaktifkan) */
  scaleFrom?: number
  /** Varian siap pakai untuk konsistensi antar tipe konten */
  variant?: Variant
}

export default function AnimateInView({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  distance,
  durationMs,
  easing,
  scaleFrom,
  variant,
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  // Default berdasarkan varian (nilai halus dan rapi)
  const defaultsByVariant: Record<Variant, { distance: number; durationMs: number; easing: string; scaleFrom: number }> = {
    title: { distance: 16, durationMs: 550, easing: "ease-out", scaleFrom: 1 },
    image: { distance: 20, durationMs: 600, easing: "ease-out", scaleFrom: 1 },
    text: { distance: 18, durationMs: 600, easing: "ease-out", scaleFrom: 1 },
    card: { distance: 14, durationMs: 500, easing: "ease-out", scaleFrom: 1 },
    cta: { distance: 12, durationMs: 450, easing: "ease-out", scaleFrom: 0.98 },
  }

  const d = distance ?? (variant ? defaultsByVariant[variant].distance : 16)
  const dur = durationMs ?? (variant ? defaultsByVariant[variant].durationMs : 550)
  const ez = easing ?? (variant ? defaultsByVariant[variant].easing : "ease-out")
  const s = scaleFrom ?? (variant ? defaultsByVariant[variant].scaleFrom : 1)

  const initialTransform = (() => {
    const tx = direction === "left" ? d : direction === "right" ? -d : 0
    const ty = direction === "up" ? d : direction === "down" ? -d : 0
    const sc = s
    return `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`
  })()

  return (
    <div
      ref={ref}
      className={cn(
        "transform-gpu will-change-transform will-change-opacity",
        "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${dur}ms`,
        transitionTimingFunction: ez,
        transitionProperty: "transform, opacity",
        transform: inView ? "translate3d(0,0,0) scale(1)" : initialTransform,
        opacity: inView ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}