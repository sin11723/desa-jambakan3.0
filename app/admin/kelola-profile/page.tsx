"use client"

import { useEffect, useState } from "react"
import AdminPageWrapper from "@/components/AdminPageWrapper"

interface DesaProfile {
  id?: number
  desa_name: string
  desa_code: string
  sub_district: string
  district: string
  province: string
  description: string
  vision: string
  mission: string
  history: string
  total_population: number | null
  total_families: number | null
  village_chief_name: string
  village_chief_phone: string
  area_km2: number | null
  main_livelihoods: string
  contact_email: string
  contact_phone: string
  address: string
  image_url: string
}

const emptyProfile: DesaProfile = {
  desa_name: "",
  desa_code: "",
  sub_district: "",
  district: "",
  province: "",
  description: "",
  vision: "",
  mission: "",
  history: "",
  total_population: null,
  total_families: null,
  village_chief_name: "",
  village_chief_phone: "",
  area_km2: null,
  main_livelihoods: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  image_url: "",
}

export default function KelolaProfilePage() {
  const [profile, setProfile] = useState<DesaProfile>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [hasExisting, setHasExisting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [demographics, setDemographics] = useState<Array<{id?: number; year: number; kelahiran: number; kematian: number; kepala_keluarga: number}>>([])
  const [demoForm, setDemoForm] = useState<{id?: number; year: number | '' ; kelahiran: number | ''; kematian: number | ''; kepala_keluarga: number | ''}>({year: '', kelahiran: '', kematian: '', kepala_keluarga: ''})
  const [savingDemo, setSavingDemo] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile({
            id: data.id,
            desa_name: data.desa_name || "",
            desa_code: data.desa_code || "",
            sub_district: data.sub_district || "",
            district: data.district || "",
            province: data.province || "",
            description: data.description || "",
            vision: data.vision || "",
            mission: data.mission || "",
            history: data.history || "",
            total_population: data.total_population ?? null,
            total_families: data.total_families ?? null,
            village_chief_name: data.village_chief_name || "",
            village_chief_phone: data.village_chief_phone || "",
            area_km2: data.area_km2 ?? null,
            main_livelihoods: data.main_livelihoods || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
            address: data.address || "",
            image_url: data.image_url || "",
          })
          setHasExisting(true)
        } else {
          setHasExisting(false)
        }
      } catch (err) {
        console.error("[profile] Error fetch:", err)
      } finally {
        setLoading(false)
      }
    }
    const fetchDemographics = async () => {
      try {
        const res = await fetch('/api/demographics')
        if (res.ok) {
          const data = await res.json()
          setDemographics(data || [])
        }
      } catch (err) {
        console.error('[demographics] Error fetch:', err)
      }
    }
    fetchProfile()
    fetchDemographics()
  }, [])

  const handleChange = (key: keyof DesaProfile, value: any) => {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const method = hasExisting ? "PUT" : "POST"
      const res = await fetch("/api/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setMessage("Profile desa berhasil disimpan.")
        setHasExisting(true)
        const refreshed = await fetch("/api/profile")
        if (refreshed.ok) {
          const data = await refreshed.json()
          setProfile({ ...profile, id: data.id })
        }
      } else {
        const t = await res.json().catch(() => ({ error: "Gagal menyimpan" }))
        setMessage(t.error || "Gagal menyimpan profile.")
      }
    } catch (err) {
      setMessage("Terjadi kesalahan jaringan.")
    } finally {
      setSaving(false)
    }
  }

  const resetDemoForm = () => setDemoForm({ year: '', kelahiran: '', kematian: '', kepala_keluarga: '' })

  const handleDemoSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSavingDemo(true)
    try {
      const payload = {
        id: demoForm.id,
        year: demoForm.year === '' ? undefined : Number(demoForm.year),
        kelahiran: demoForm.kelahiran === '' ? 0 : Number(demoForm.kelahiran),
        kematian: demoForm.kematian === '' ? 0 : Number(demoForm.kematian),
        kepala_keluarga: demoForm.kepala_keluarga === '' ? 0 : Number(demoForm.kepala_keluarga),
      }
      const method = demoForm.id ? 'PUT' : 'POST'
      const res = await fetch('/api/demographics', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const list = await fetch('/api/demographics').then(r=>r.json())
        setDemographics(list || [])
        resetDemoForm()
        setMessage('Statistik demografis berhasil disimpan.')
      } else {
        const t = await res.json().catch(()=>({error:'Gagal menyimpan data demografis'}))
        setMessage(t.error)
      }
    } catch (err) {
      setMessage('Terjadi kesalahan jaringan saat menyimpan demografi.')
    } finally {
      setSavingDemo(false)
    }
  }

  const handleDemoEdit = (item: {id?: number; year: number; kelahiran: number; kematian: number; kepala_keluarga: number}) => {
    setDemoForm({ id: item.id, year: item.year, kelahiran: item.kelahiran, kematian: item.kematian, kepala_keluarga: item.kepala_keluarga })
  }

  const handleDemoDelete = async (id?: number) => {
    if (!id) return
    const ok = confirm('Hapus data demografis ini?')
    if (!ok) return
    try {
      const res = await fetch(`/api/demographics?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        const list = await fetch('/api/demographics').then(r=>r.json())
        setDemographics(list || [])
        setMessage('Data demografis dihapus.')
      }
    } catch (err) {
      console.error('Delete demografi error', err)
    }
  }

  return (
    <AdminPageWrapper
      title="Kelola Profile Desa"
      description="Edit informasi umum, kontak, dan deskripsi desa"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identitas Umum */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Identitas Desa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Desa</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.desa_name} onChange={(e)=>handleChange('desa_name', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kode Desa</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.desa_code} onChange={(e)=>handleChange('desa_code', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kecamatan</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.sub_district} onChange={(e)=>handleChange('sub_district', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kabupaten/Kota</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.district} onChange={(e)=>handleChange('district', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Provinsi</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.province} onChange={(e)=>handleChange('province', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Deskripsi & Sejarah */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Deskripsi & Sejarah</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Deskripsi</label>
                <textarea rows={5} className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.description} onChange={(e)=>handleChange('description', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Sejarah</label>
                <textarea rows={5} className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.history} onChange={(e)=>handleChange('history', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Visi & Misi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Visi</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.vision} onChange={(e)=>handleChange('vision', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Misi</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.mission} onChange={(e)=>handleChange('mission', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Statistik & Kepala Desa */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Statistik & Kepemimpinan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Jumlah Penduduk</label>
                <input type="number" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.total_population ?? ''} onChange={(e)=>handleChange('total_population', e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Jumlah Keluarga</label>
                <input type="number" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.total_families ?? ''} onChange={(e)=>handleChange('total_families', e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Luas Wilayah (km²)</label>
                <input type="number" step="0.01" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.area_km2 ?? ''} onChange={(e)=>handleChange('area_km2', e.target.value ? Number(e.target.value) : null)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Kepala Desa</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.village_chief_name} onChange={(e)=>handleChange('village_chief_name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kontak Kepala Desa</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.village_chief_phone} onChange={(e)=>handleChange('village_chief_phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Statistik Demografis dipindah ke luar form utama agar validasi tidak menghalangi penyimpanan profile */}

          {/* Kontak & Alamat */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Kontak & Alamat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.contact_email} onChange={(e)=>handleChange('contact_email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Telepon</label>
                <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.contact_phone} onChange={(e)=>handleChange('contact_phone', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Alamat</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.address} onChange={(e)=>handleChange('address', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">URL Gambar Header</label>
              <input className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={profile.image_url} onChange={(e)=>handleChange('image_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan Profile"}
            </button>
            {message && <p className="text-sm text-muted-foreground self-center">{message}</p>}
          </div>
          </form>
          {/* Statistik Demografis (per Tahun) - di luar form utama */}
          <div className="bg-background border border-border rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Statistik Demografis</h2>
            <p className="text-sm text-muted-foreground mb-4">Kelola data kelahiran, kematian, dan jumlah kepala keluarga per tahun. Data ini dipakai untuk grafik di halaman profil.</p>

            {/* Form tambah/edit (container biasa) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Tahun</label>
                <input type="number" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={demoForm.year} onChange={(e)=>setDemoForm(f=>({ ...f, year: e.target.value ? Number(e.target.value) : '' }))} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kelahiran</label>
                <input type="number" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={demoForm.kelahiran} onChange={(e)=>setDemoForm(f=>({ ...f, kelahiran: e.target.value ? Number(e.target.value) : '' }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kematian</label>
                <input type="number" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={demoForm.kematian} onChange={(e)=>setDemoForm(f=>({ ...f, kematian: e.target.value ? Number(e.target.value) : '' }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kepala Keluarga</label>
                <input type="number" className="w-full px-4 py-2 border border-border rounded-lg bg-background" value={demoForm.kepala_keluarga} onChange={(e)=>setDemoForm(f=>({ ...f, kepala_keluarga: e.target.value ? Number(e.target.value) : '' }))} />
              </div>
              <div className="flex items-end gap-2">
                <button type="button" onClick={handleDemoSubmit} disabled={savingDemo} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 w-full">
                  {demoForm.id ? (savingDemo ? 'Menyimpan...' : 'Perbarui') : (savingDemo ? 'Menyimpan...' : 'Tambah')}
                </button>
                {demoForm.id && (
                  <button type="button" onClick={resetDemoForm} className="px-4 py-2 border border-border rounded-lg w-full">Batal</button>
                )}
              </div>
            </div>

            {/* Tabel daftar */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 px-3">Tahun</th>
                    <th className="py-2 px-3">Kelahiran</th>
                    <th className="py-2 px-3">Kematian</th>
                    <th className="py-2 px-3">Kepala Keluarga</th>
                    <th className="py-2 px-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {demographics.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-3 text-muted-foreground">Belum ada data demografis</td>
                    </tr>
                  ) : (
                    demographics.map((d)=> (
                      <tr key={`${d.id}-${d.year}`} className="border-b border-border">
                        <td className="py-2 px-3">{d.year}</td>
                        <td className="py-2 px-3">{d.kelahiran}</td>
                        <td className="py-2 px-3">{d.kematian}</td>
                        <td className="py-2 px-3">{d.kepala_keluarga}</td>
                        <td className="py-2 px-3">
                          <div className="flex gap-2">
                            <button type="button" className="px-3 py-1 border border-border rounded" onClick={()=>handleDemoEdit(d)}>Edit</button>
                            <button type="button" className="px-3 py-1 border border-red-500 text-red-500 rounded" onClick={()=>handleDemoDelete(d.id)}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminPageWrapper>
  )
}