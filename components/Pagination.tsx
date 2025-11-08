"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
  showInfo?: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
  showInfo = true
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Selalu tampilkan halaman pertama
      pages.push(1)
      
      // Hitung range halaman yang akan ditampilkan
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Tambahkan ellipsis di awal jika perlu
      if (startPage > 2) {
        pages.push('...')
      }
      
      // Tambahkan halaman di tengah
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Tambahkan ellipsis di akhir jika perlu
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      
      // Selalu tampilkan halaman terakhir
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const startItem = totalItems ? ((currentPage - 1) * itemsPerPage) + 1 : 0
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Informasi jumlah item */}
      {showInfo && totalItems && (
        <div className="text-sm text-muted-foreground">
          Menampilkan {startItem}-{endItem} dari {totalItems} data
        </div>
      )}
      
      {/* Kontrol pagination */}
      <div className="flex items-center gap-2">
        {/* Tombol Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Sebelumnya
        </button>
        
        {/* Nomor halaman */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground'
                  : page === '...'
                  ? 'cursor-default'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        {/* Tombol Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Selanjutnya
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}