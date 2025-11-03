"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, School, Building2, Heart, Droplet, Utensils } from "lucide-react"

interface Lokasi {
  id: number
  nama: string
  tipe: string
  deskripsi: string
  koordinat: string
  icon: React.ReactNode
}

const lokasi: Lokasi[] = [
  {
    id: 1,
    nama: "Kantor Desa",
    tipe: "Pemerintahan",
    deskripsi: "Pusat administrasi dan pelayanan publik Desa Jambakan",
    koordinat: "-7.2345°, 110.4567°",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: 2,
    nama: "Sekolah Dasar Jambakan",
    tipe: "Pendidikan",
    deskripsi: "Sekolah dasar untuk anak-anak di Desa Jambakan dengan fasilitas lengkap",
    koordinat: "-7.2356°, 110.4578°",
    icon: <School className="w-6 h-6" />,
  },
  {
    id: 3,
    nama: "Puskesmas Desa",
    tipe: "Kesehatan",
    deskripsi: "Pusat kesehatan masyarakat untuk pelayanan kesehatan umum penduduk desa",
    koordinat: "-7.2334°, 110.4556°",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 4,
    nama: "Tempat Pengolahan Tenun",
    tipe: "Produksi",
    deskripsi: "Pusat pengolahan dan produksi tenun tradisional Desa Jambakan yang terkenal",
    koordinat: "-7.2367°, 110.4589°",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: 5,
    nama: "Balai Pertemuan Desa",
    tipe: "Komunitas",
    deskripsi: "Fasilitas untuk pertemuan, acara, dan kegiatan komunitas masyarakat desa",
    koordinat: "-7.2345°, 110.4590°",
    icon: <Utensils className="w-6 h-6" />,
  },
  {
    id: 6,
    nama: "Sumber Air Bersih",
    tipe: "Infrastruktur",
    deskripsi: "Sumber air bersih utama untuk kebutuhan sehari-hari penduduk Desa Jambakan",
    koordinat: "-7.2398°, 110.4534°",
    icon: <Droplet className="w-6 h-6" />,
  },
]

const tipeWarna: { [key: string]: string } = {
  Pemerintahan: "bg-primary/10 text-primary border-primary/20",
  Pendidikan: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Kesehatan: "bg-red-500/10 text-red-600 border-red-500/20",
  Produksi: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Komunitas: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Infrastruktur: "bg-green-500/10 text-green-600 border-green-500/20",
}

export default function PetaDesaPage() {
  const [selectedLokasi, setSelectedLokasi] = useState<Lokasi | null>(null)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance drop-shadow-sm">Peta Desa Jambakan</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Jelajahi berbagai fasilitas dan infrastruktur penting yang tersedia di Desa Jambakan
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Area */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="border-border/50 overflow-hidden h-full min-h-96">
                <CardHeader className="pb-3">
                  <CardTitle>Visualisasi Peta Desa</CardTitle>
                  <CardDescription>Lokasi fasilitas dan infrastruktur penting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-border/50 overflow-hidden">
                    {/* Map Background */}
                    <svg viewBox="0 0 600 400" className="w-full h-full" style={{ aspectRatio: "1.5" }}>
                      {/* Background */}
                      <rect width="600" height="400" fill="url(#mapGradient)" />
                      <defs>
                        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#dbeafe" />
                          <stop offset="100%" stopColor="#dcfce7" />
                        </linearGradient>
                      </defs>

                      {/* Roads - simplified grid */}
                      <line x1="100" y1="0" x2="100" y2="400" stroke="#e5e7eb" strokeWidth="3" />
                      <line x1="300" y1="0" x2="300" y2="400" stroke="#e5e7eb" strokeWidth="3" />
                      <line x1="500" y1="0" x2="500" y2="400" stroke="#e5e7eb" strokeWidth="3" />

                      <line x1="0" y1="100" x2="600" y2="100" stroke="#e5e7eb" strokeWidth="3" />
                      <line x1="0" y1="200" x2="600" y2="200" stroke="#e5e7eb" strokeWidth="3" />
                      <line x1="0" y1="300" x2="600" y2="300" stroke="#e5e7eb" strokeWidth="3" />

                      {/* Location Markers */}
                      {lokasi.map((loc, idx) => {
                        const positions = [
                          { x: 100, y: 100 },
                          { x: 300, y: 80 },
                          { x: 500, y: 100 },
                          { x: 100, y: 250 },
                          { x: 300, y: 280 },
                          { x: 500, y: 250 },
                        ]
                        const pos = positions[idx]
                        const isSelected = selectedLokasi?.id === loc.id

                        return (
                          <g key={loc.id} onClick={() => setSelectedLokasi(loc)} style={{ cursor: "pointer" }}>
                            {/* Circle background */}
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={isSelected ? 24 : 18}
                              fill={isSelected ? "#2563eb" : "#0f172a"}
                              opacity={isSelected ? 1 : 0.7}
                              className="transition-all"
                            />

                            {/* Icon circle */}
                            <circle cx={pos.x} cy={pos.y} r={isSelected ? 20 : 14} fill="white" opacity={0.2} />
                          </g>
                        )
                      })}
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 text-xs text-muted-foreground space-y-1 bg-white/80 backdrop-blur-sm p-2 rounded">
                      <p className="font-semibold text-foreground">Klik lokasi untuk detail</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lokasi List */}
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-4">
              <h2 className="text-2xl font-bold">Daftar Lokasi</h2>
              <div className="space-y-3 max-h-screen overflow-y-auto pr-2">
                {lokasi.map((loc) => (
                  <Card
                    key={loc.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedLokasi?.id === loc.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedLokasi(loc)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className={`rounded-lg p-2 flex-shrink-0 ${tipeWarna[loc.tipe]}`}>{loc.icon}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm text-balance">{loc.nama}</h3>
                          <p className="text-xs text-muted-foreground">{loc.tipe}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Detail Section */}
          {selectedLokasi && (
            <Card className="mt-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{selectedLokasi.nama}</CardTitle>
                    <CardDescription className="text-base mt-1">{selectedLokasi.tipe}</CardDescription>
                  </div>
                  <div className="text-primary opacity-50">{selectedLokasi.icon}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Deskripsi</h3>
                  <p className="text-muted-foreground">{selectedLokasi.deskripsi}</p>
                </div>
                <div className="pt-2 border-t border-primary/20">
                  <h3 className="font-semibold mb-2 text-foreground">Koordinat</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{selectedLokasi.koordinat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}
