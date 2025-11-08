'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Pagination from '@/components/Pagination';

interface StrukturMember {
  id: number;
  name: string;
  position: string;
  contact: string;
  description: string;
  photo_url: string;
  section: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export default function KelolaStruktur() {
  const { user, isAuthenticated } = useAdminAuth();
  const [members, setMembers] = useState<StrukturMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<StrukturMember[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StrukturMember | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    contact: '',
    description: '',
    photo_url: '',
    section: 'pengurus',
    order_index: 0
  });
  
  // State untuk modal konfirmasi delete
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    memberId: number | null;
    memberName: string;
  }>({
    isOpen: false,
    memberId: null,
    memberName: ''
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/struktur');
      const data = await response.json();
      
      if (response.ok) {
        setMembers(data);
      } else {
        setError(data.error || 'Gagal mengambil data struktur organisasi');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'x-upload-type': 'struktur'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormData(prev => ({ ...prev, photo_url: data.imageUrl }));
        setSuccess('Foto berhasil diupload');
      } else {
        setError(data.error || 'Gagal upload foto');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Terjadi kesalahan saat upload foto');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const url = editingMember ? `/api/struktur/${editingMember.id}` : '/api/struktur';
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        fetchMembers();
        resetForm();
      } else {
        setError(data.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Terjadi kesalahan saat menyimpan data');
    }
  };

  // Handle delete - membuka modal konfirmasi
  const handleDelete = (id: number, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      memberId: id,
      memberName: name
    });
  };
  
  // Konfirmasi delete dari modal
  const confirmDelete = async () => {
    if (!deleteConfirm.memberId) return;
    
    try {
      const response = await fetch(`/api/struktur/${deleteConfirm.memberId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        fetchMembers();
      } else {
        setError(data.error || 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Terjadi kesalahan saat menghapus data');
    } finally {
      // Tutup modal
      setDeleteConfirm({
        isOpen: false,
        memberId: null,
        memberName: ''
      });
    }
  };
  
  // Batal delete
  const cancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      memberId: null,
      memberName: ''
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      contact: '',
      description: '',
      photo_url: '',
      section: 'pengurus',
      order_index: 0
    });
    setEditingMember(null);
    setIsFormOpen(false);
  };

  // Edit member
  const handleEdit = (member: StrukturMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      contact: member.contact,
      description: member.description,
      photo_url: member.photo_url,
      section: member.section,
      order_index: member.order_index
    });
    setIsFormOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Silakan login untuk mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Kelola Struktur Organisasi</h1>
              <p className="text-sm text-muted-foreground">Total: {members.length} anggota</p>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Tambah Anggota
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Form Tambah/Edit */}
      {isFormOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingMember ? 'Edit Anggota' : 'Tambah Anggota Baru'}</CardTitle>
            <CardDescription>
              {editingMember ? 'Perbarui informasi anggota struktur organisasi' : 'Tambahkan anggota baru ke struktur organisasi'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="position">Jabatan *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Kontak</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="Nomor HP atau Email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="section">Bagian</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pengurus">Pengurus</SelectItem>
                      <SelectItem value="pengawas">Pengawas</SelectItem>
                      <SelectItem value="pengurus_harian">Pengurus Harian</SelectItem>
                      <SelectItem value="seksi">Seksi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Deskripsi singkat tentang anggota"
                />
              </div>

              <div>
                <Label htmlFor="photo">Foto</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  disabled={uploading}
                />
                {formData.photo_url && (
                  <div className="mt-2">
                    <img
                      src={formData.photo_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="order_index">Urutan Tampil</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Mengupload...' : (editingMember ? 'Update Anggota' : 'Simpan Anggota')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Daftar Anggota */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota Struktur Organisasi</CardTitle>
          <CardDescription>Kelola anggota struktur organisasi desa</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Memuat data...</div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Belum ada anggota struktur organisasi yang ditambahkan.
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {member.photo_url && (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{member.section}</Badge>
                        {member.contact && (
                          <Badge variant="secondary">{member.contact}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(member)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id, member.name)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal Konfirmasi Delete */}
      <Dialog open={deleteConfirm.isOpen} onOpenChange={(open) => !open && cancelDelete()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus anggota <strong>{deleteConfirm.memberName}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredMembers.length}
          showInfo={true}
        />
      )}
      </div>
    </main>
  );
}