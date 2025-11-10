"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  id: string
  image_url: string
  title?: string
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Ambil gambar dari Berita (activities) dan Budaya (karawitan)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const [activitiesRes, karawitanRes] = await Promise.all([
          fetch("/api/activities"),
          fetch("/api/karawitan"),
        ])

        const activities = activitiesRes.ok ? await activitiesRes.json() : []
        const karawitan = karawitanRes.ok ? await karawitanRes.json() : []

        // Gabungkan dan pilih beberapa item terbaru, prioritaskan yang punya image_url
        const activitySlides: HeroSlide[] = activities
          .filter((a: any) => !!a.image_url)
          .slice(0, 5)
          .map((a: any) => ({ id: `a-${a.id}`, image_url: a.image_url, title: a.title }))

        const karawitanSlides: HeroSlide[] = karawitan
          .filter((k: any) => !!k.image_url)
          .slice(0, 5)
          .map((k: any) => ({ id: `k-${k.id}`, image_url: k.image_url, title: k.title }))

        const combined = [...activitySlides, ...karawitanSlides]

        // Jika tidak ada data, gunakan fallback gambar publik
        if (combined.length === 0) {
          setSlides([
            { id: "f-1", image_url: "/desa-jambakan-pemandangan-1.jpg", title: "Desa Jambakan" },
            { id: "f-2", image_url: "/desa-jambakan-pemandangan-2.jpg", title: "Budaya Desa" },
            { id: "f-3", image_url: "/desa-jambakan-pemandangan-3.jpg", title: "Kehidupan Warga" },
          ])
        } else {
          setSlides(combined)
        }
      } catch (error) {
        console.error("[v0] Error fetching carousel slides:", error)
        setSlides([
          { id: "f-1", image_url: "/desa-jambakan-pemandangan-1.jpg", title: "Desa Jambakan" },
          { id: "f-2", image_url: "/desa-jambakan-pemandangan-2.jpg", title: "Budaya Desa" },
          { id: "f-3", image_url: "/desa-jambakan-pemandangan-3.jpg", title: "Kehidupan Warga" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  // Autoplay mengikuti gaya contoh: berhenti saat interaksi, lanjut 10 detik kemudian
  useEffect(() => {
    if (!slides.length || !isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length, isAutoPlay])

  const resumeAutoPlay = () => {
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
    resumeAutoPlay()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
    resumeAutoPlay()
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
    resumeAutoPlay()
  }

  if (loading || slides.length === 0) {
    return (
      <section className="min-h-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </section>
    )
  }

  return (
    <section className="relative min-h-[600px] overflow-hidden group">
      {/* Carousel Container */}
      <div className="relative w-full h-full min-h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image_url || "/placeholder.svg"}
              alt={slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance drop-shadow-lg">
            Selamat Datang di Desa Jambakan
          </h1>
          <p className="text-xl text-white/90 mb-8 text-balance max-w-2xl mx-auto drop-shadow-md">
            Jelajahi keindahan karya tenun tradisional, warisan karawitan, dan budaya yang kaya dari Desa Jambakan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tenun"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Lihat Karya Tenun
            </Link>
            <Link
              href="/berita"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors shadow-lg"
            >
              Baca Berita
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
