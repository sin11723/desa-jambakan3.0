"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import AdminPageWrapper from "@/components/AdminPageWrapper"
import Pagination from "@/components/Pagination"

interface Karawitan {
  id: number
  title: string
  description: string
  content: string
  image_url: string
}

export default function KelolaKarawaitanPage() {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const [karawitan, setKarawitan] = useState<Karawitan[]>([])
  const [filteredKarawitan, setFilteredKarawitan] = useState<Karawitan[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
  })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredKarawitan.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredKarawitan.length / itemsPerPage)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    fetchKarawitan()
  }, [isAuthenticated, router])

  useEffect(() => {
    setFilteredKarawitan(karawitan)
  }, [karawitan])

  const fetchKarawitan = async () => {
    try {
      const res = await fetch("/api/karawitan")
      if (res.ok) setKarawitan(await res.json())
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
      setCurrentPage(1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddKarawitan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/karawitan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          content: "",
          image_url: "",
        })
        setIsFormOpen(false)
        setEditingId(null)
        fetchKarawitan()
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleUpdateKarawitan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const res = await fetch(`/api/karawitan/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({ title: "", description: "", content: "", image_url: "" })
        setIsFormOpen(false)
        setEditingId(null)
        fetchKarawitan()
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const startEdit = (item: Karawitan) => {
    setIsFormOpen(true)
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      image_url: item.image_url || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus konten ini?")) return

    try {
      const res = await fetch(`/api/karawitan/${id}`, { method: "DELETE" })
      if (res.ok) fetchKarawitan()
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  return (
    <AdminPageWrapper 
      title="Kelola Karawitan" 
      description={`Total: ${karawitan.length} konten`}
    >
      {/* Tombol Tambah Konten */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Tambah Konten
        </button>
      </div>
        {/* Form */}
        {isFormOpen && (
          <div className="bg-background border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Konten Karawitan" : "Tambah Konten Karawitan"}</h2>
            <form onSubmit={editingId ? handleUpdateKarawitan : handleAddKarawitan} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Judul</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul konten"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Deskripsi Singkat</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat"
                  rows={2}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Konten Lengkap</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Konten lengkap tentang karawitan"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">URL Gambar</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Konten"}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingId(null) }}
                  className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Karawitan List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.length === 0 ? (
              <div className="text-center py-12 bg-background rounded-lg border border-border">
                <p className="text-muted-foreground">Belum ada konten karawitan. Tambahkan konten baru!</p>
              </div>
            ) : (
              currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-background border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                      <Edit2 size={20} className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={20} className="text-destructive" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredKarawitan.length}
            showInfo={true}
          />
        )}
    </AdminPageWrapper>
  )
}
