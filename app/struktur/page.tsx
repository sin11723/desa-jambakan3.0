"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, MapPin, Shield } from "lucide-react"
import Image from "next/image"

interface Perangkat {
  id: number
  jabatan: string
  nama: string
  kontak: string
  deskripsi: string
  icon: React.ReactNode
  foto: string
}

const perangkatDesa: Perangkat[] = [
  {
    id: 1,
    jabatan: "Kepala Desa",
    nama: "Bapak Sutrisno",
    kontak: "+62 812-3456-7890",
    deskripsi: "Memimpin dan mengkoordinasi seluruh kegiatan pemerintahan desa serta pembangunan di Desa Jambakan",
    icon: <Shield className="w-8 h-8" />,
    foto: "/kepala-desa-pria-profesional.jpg",
  },
  {
    id: 2,
    jabatan: "Sekretaris Desa",
    nama: "Ibu Siti Nurhaliza",
    kontak: "+62 812-3456-7891",
    deskripsi: "Menangani administrasi, dokumentasi, dan manajemen surat-menyurat pemerintah desa",
    icon: <FileText className="w-8 h-8" />,
    foto: "/sekretaris-wanita-profesional.jpg",
  },
  {
    id: 3,
    jabatan: "Bendahara Desa",
    nama: "Bapak Ahmad Supardi",
    kontak: "+62 812-3456-7892",
    deskripsi: "Mengelola keuangan, anggaran, dan laporan keuangan Pemerintah Desa Jambakan",
    icon: <FileText className="w-8 h-8" />,
    foto: "/bendahara-pria-profesional.jpg",
  },
  {
    id: 4,
    jabatan: "Kepala Dusun I",
    nama: "Bapak Bambang Suryanto",
    kontak: "+62 812-3456-7893",
    deskripsi: "Bertanggung jawab atas pembinaan dan pengembangan Dusun I",
    icon: <MapPin className="w-8 h-8" />,
    foto: "/kepala-dusun-pria-profesional.jpg",
  },
  {
    id: 5,
    jabatan: "Kepala Dusun II",
    nama: "Bapak Hendra Wijaya",
    kontak: "+62 812-3456-7894",
    deskripsi: "Bertanggung jawab atas pembinaan dan pengembangan Dusun II",
    icon: <MapPin className="w-8 h-8" />,
    foto: "/kepala-dusun-pria-profesional.jpg",
  },
  {
    id: 6,
    jabatan: "Kepala Dusun III",
    nama: "Bapak Yanto Santoso",
    kontak: "+62 812-3456-7895",
    deskripsi: "Bertanggung jawab atas pembinaan dan pengembangan Dusun III",
    icon: <MapPin className="w-8 h-8" />,
    foto: "/kepala-dusun-pria-profesional.jpg",
  },
  {
    id: 7,
    jabatan: "Ketua BPD",
    nama: "Ibu Widya Kusuma",
    kontak: "+62 812-3456-7896",
    deskripsi: "Memimpin Badan Permusyawaratan Desa dan mewakili masyarakat dalam pembuat keputusan",
    icon: <Users className="w-8 h-8" />,
    foto: "/ketua-bpd-wanita-profesional.jpg",
  },
  {
    id: 8,
    jabatan: "Bidang Pembangunan",
    nama: "Bapak Sugiyono",
    kontak: "+62 812-3456-7897",
    deskripsi: "Mengkoordinasikan program pembangunan infrastruktur dan sarana publik",
    icon: <Shield className="w-8 h-8" />,
    foto: "/bidang-pembangunan-pria-profesional.jpg",
  },
]

const PearlCard = ({ perangkat }: { perangkat: Perangkat }) => (
  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 h-full flex flex-col">
    {/* Photo Container */}
    <div className="relative w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <Image
        src={perangkat.foto || "/placeholder.svg"}
        alt={perangkat.nama}
        fill
        className="object-cover w-full h-full"
      />
    </div>

    {/* Info Container */}
    <CardContent className="flex flex-col flex-1 p-6 space-y-4">
      {/* Name and Position */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">{perangkat.nama}</h3>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">{perangkat.jabatan}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{perangkat.deskripsi}</p>

      {/* Contact */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">Kontak:</span> {perangkat.kontak}
        </p>
      </div>
    </CardContent>
  </Card>
)

export default function PerangkatDesaPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance drop-shadow-sm">Struktur Perangkat Desa</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Mengenal para pemimpin dan petugas yang berkomitmen melayani masyarakat Desa Jambakan dengan sepenuh hati
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Leadership Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-2">Pimpinan Desa</h2>
            <p className="text-muted-foreground mb-8">
              Pemimpin utama yang mengarahkan pelaksanaan program pembangunan desa
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perangkatDesa.slice(0, 3).map((perangkat) => (
                <PearlCard key={perangkat.id} perangkat={perangkat} />
              ))}
            </div>
          </div>

          {/* Dusun Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-2">Kepala Dusun</h2>
            <p className="text-muted-foreground mb-8">
              Pemimpin di tingkat dusun yang membina masyarakat secara langsung
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perangkatDesa.slice(3, 6).map((perangkat) => (
                <PearlCard key={perangkat.id} perangkat={perangkat} />
              ))}
            </div>
          </div>

          {/* BPD and Staff Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Lembaga dan Bidang</h2>
            <p className="text-muted-foreground mb-8">
              Lembaga dan bidang khusus yang mendukung pelaksanaan pemerintahan desa
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perangkatDesa.slice(6).map((perangkat) => (
                <PearlCard key={perangkat.id} perangkat={perangkat} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
