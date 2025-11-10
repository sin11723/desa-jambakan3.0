"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, BookOpen, Phone, MapPin, Users, Landmark, TrendingUp } from "lucide-react"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface DesaProfile {
  id: number
  desa_name: string
  desa_code: string
  sub_district: string
  district: string
  province: string
  description: string
  vision: string
  mission: string
  history: string
  total_population: number
  total_families: number
  village_chief_name: string
  village_chief_phone: string
  area_km2: number
  main_livelihoods: string
  contact_email: string
  contact_phone: string
  address: string
  image_url: string
}

interface DemographicItem {
  id: number
  year: number
  kelahiran: number
  kematian: number
  kepala_keluarga: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<DesaProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demographics, setDemographics] = useState<DemographicItem[]>([])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(data as DesaProfile)
        } else {
          const t = await res.json().catch(()=>({error:"Profile tidak ditemukan"}))
          setError(t.error || "Profile tidak ditemukan")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }

    const fetchDemographics = async () => {
      try {
        const res = await fetch("/api/demographics")
        if (res.ok) {
          const data = await res.json()
          setDemographics(data as DemographicItem[])
        }
      } catch (err) {
        console.error("Gagal mengambil data demografis", err)
      }
    }

    fetchProfile()
    fetchDemographics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground/60">Memuat data profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-destructive">
          <p className="text-lg font-semibold">{error || "Profile tidak ditemukan"}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance drop-shadow-sm">{profile.desa_name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              {profile.district}, {profile.province}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Image */}
          <Card className="border-border/50 overflow-hidden group">
            <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-primary/10 to-secondary/10">
              <img
                src={profile.image_url || "/placeholder.svg"}
                alt={profile.desa_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Cultural-themed hover overlay to align with Budaya pages */}
              <div className="absolute inset-0 flex items-end justify-start p-4">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" aria-hidden="true"></div>
                <div className="relative z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-lg font-semibold drop-shadow-sm">{profile.desa_name}</h3>
                  <p className="text-sm drop-shadow-sm">{profile.district}, {profile.province}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <Users className="w-8 h-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Jumlah Penduduk</p>
                <p className="text-2xl font-bold text-foreground">{profile.total_population.toLocaleString("id-ID")}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <Landmark className="w-8 h-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Jumlah Keluarga</p>
                <p className="text-2xl font-bold text-foreground">{profile.total_families.toLocaleString("id-ID")}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <MapPin className="w-8 h-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Luas Wilayah</p>
                <p className="text-2xl font-bold text-foreground">{profile.area_km2} km²</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <Landmark className="w-8 h-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Kode Desa</p>
                <p className="text-2xl font-bold text-foreground">{profile.desa_code}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Tentang Desa
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">{profile.description}</CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">{profile.vision}</CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-primary" />
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile.mission}</div>
              </CardContent>
            </Card>

            {/* History */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📖 Sejarah Desa</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">{profile.history}</CardContent>
            </Card>

            {/* Demographic Statistics */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Statistik Demografis
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Data kelahiran, kematian, dan jumlah kepala keluarga tiap tahun
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Birth and Death Distribution Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-base font-semibold text-foreground mb-4 text-center">
                      Distribusi Kelahiran & Kematian ({demographics.at(-1)?.year ?? "-"})
                    </h3>
                    <div className="w-full h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={(() => {
                              const latest = demographics.at(-1)
                              return latest
                                ? [
                                    { name: "Kelahiran", value: latest.kelahiran },
                                    { name: "Kematian", value: latest.kematian },
                                  ]
                                : [
                                    { name: "Kelahiran", value: 0 },
                                    { name: "Kematian", value: 0 },
                                  ]
                            })()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={65}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "var(--color-foreground)" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Year Distribution Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-base font-semibold text-foreground mb-4 text-center">
                      Perbandingan Kelahiran 5 Tahun
                    </h3>
                    <div className="w-full h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={demographics.map((d) => ({
                              name: `${d.year}`,
                              value: d.kelahiran,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={65}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#06b6d4" />
                            <Cell fill="#8b5cf6" />
                            <Cell fill="#ec4899" />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "var(--color-foreground)" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Kepala Keluarga Distribution Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-base font-semibold text-foreground mb-4 text-center">
                      Perbandingan Kepala Keluarga 5 Tahun
                    </h3>
                    <div className="w-full h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={demographics.map((d) => ({
                              name: `${d.year}`,
                              value: d.kepala_keluarga,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={65}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#14b8a6" />
                            <Cell fill="#06b6d4" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#8b5cf6" />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "var(--color-foreground)" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6 text-center space-y-2">
                      <div className="text-emerald-500 text-4xl font-bold">{demographics.at(-1)?.kelahiran ?? 0}</div>
                      <p className="text-sm text-muted-foreground">Kelahiran Tahun {demographics.at(-1)?.year ?? "-"}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6 text-center space-y-2">
                      <div className="text-red-500 text-4xl font-bold">{demographics.at(-1)?.kematian ?? 0}</div>
                      <p className="text-sm text-muted-foreground">Kematian Tahun {demographics.at(-1)?.year ?? "-"}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6 text-center space-y-2">
                      <div className="text-blue-500 text-4xl font-bold">{demographics.at(-1)?.kepala_keluarga ?? 0}</div>
                      <p className="text-sm text-muted-foreground">Kepala Keluarga Tahun {demographics.at(-1)?.year ?? "-"}</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact and Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Alamat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">{profile.address}</CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Kontak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Telepon</p>
                  <a
                    href={`tel:${profile.contact_phone}`}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {profile.contact_phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${profile.contact_email}`}
                    className="text-primary hover:text-primary/80 transition-colors font-medium break-all"
                  >
                    {profile.contact_email}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
