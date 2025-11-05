"use client"

import type React from "react"
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, MapPin, Shield } from "lucide-react"
import Image from "next/image"

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

interface Perangkat {
  id: number;
  jabatan: string;
  nama: string;
  kontak: string;
  deskripsi: string;
  icon: React.ReactNode;
  foto: string;
}

const defaultIcon = <Users className="w-8 h-8" />;

const sectionIcons: Record<string, React.ReactNode> = {
  'pengurus': <Shield className="w-8 h-8" />,
  'pengawas': <FileText className="w-8 h-8" />,
  'pengurus_harian': <FileText className="w-8 h-8" />,
  'seksi': <MapPin className="w-8 h-8" />,
};

const PearlCard = ({ perangkat }: { perangkat: Perangkat }) => (
  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 h-full flex flex-col">
    {/* Photo Container */}
    <div className="relative w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      {perangkat.foto ? (
        <Image
          src={perangkat.foto}
          alt={perangkat.nama}
          fill
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-6xl">👤</div>
        </div>
      )}
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
      {perangkat.kontak && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Kontak:</span> {perangkat.kontak}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
)

export default function PerangkatDesaPage() {
  const [members, setMembers] = useState<StrukturMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch struktur members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/struktur');
        const data = await response.json();
        
        if (response.ok) {
          // Tambahkan data test jika tidak ada data
          if (data.length === 0) {
            const testData = [
              {
                id: 1,
                name: 'Bapak Test Kepala Desa',
                position: 'Kepala Desa',
                contact: '08123456789',
                description: 'Kepala Desa yang berkomitmen melayani masyarakat',
                photo_url: '/uploads/tenun_1762338648636.jpg',
                section: 'pengurus',
                order_index: 1,
                created_at: '2025-11-05 00:00:00',
                updated_at: '2025-11-05 00:00:00'
              },
              {
                id: 2,
                name: 'Ibu Test Sekretaris',
                position: 'Sekretaris Desa',
                contact: '08123456780',
                description: 'Sekretaris yang profesional',
                photo_url: '/uploads/tenun_1762338482380.jpg',
                section: 'pengurus',
                order_index: 2,
                created_at: '2025-11-05 00:00:00',
                updated_at: '2025-11-05 00:00:00'
              }
            ];
            setMembers(testData);
          } else {
            setMembers(data);
          }
        } else {
          setError(data.error || 'Gagal mengambil data struktur organisasi');
        }
      } catch (error) {
        console.error('Error fetching struktur members:', error);
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Group members by section
  const groupedMembers = members.reduce((acc, member) => {
    if (!acc[member.section]) {
      acc[member.section] = [];
    }
    acc[member.section].push(member);
    return acc;
  }, {} as Record<string, StrukturMember[]>);

  // Sort members within each section by order_index
  Object.keys(groupedMembers).forEach(section => {
    groupedMembers[section].sort((a, b) => a.order_index - b.order_index);
  });

  // Convert to Perangkat format for compatibility with existing UI
  const convertToPerangkat = (member: StrukturMember): Perangkat => ({
    id: member.id,
    jabatan: member.position,
    nama: member.name,
    kontak: member.contact,
    deskripsi: member.description || 'Anggota struktur organisasi Desa Jambakan',
    icon: sectionIcons[member.section] || defaultIcon,
    foto: member.photo_url || '',
  });

  // Section titles for display
  const sectionTitles: Record<string, string> = {
    'pengurus': 'Pengurus Desa',
    'pengawas': 'Pengawas Desa',
    'pengurus_harian': 'Pengurus Harian',
    'seksi': 'Seksi',
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-balance drop-shadow-sm">Struktur Perangkat Desa</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Memuat data struktur organisasi...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-balance drop-shadow-sm">Struktur Perangkat Desa</h1>
              <p className="text-lg text-red-500 max-w-2xl mx-auto text-pretty">
                {error}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

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
          {members.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Struktur Organisasi Belum Tersedia</h2>
              <p className="text-gray-500">Data struktur organisasi Desa Jambakan akan segera diperbarui.</p>
            </div>
          ) : (
            <>
              {Object.entries(groupedMembers).map(([section, sectionMembers]) => (
                <div key={section} className="mb-16">
                  <h2 className="text-3xl font-bold mb-2">{sectionTitles[section] || section}</h2>
                  <p className="text-muted-foreground mb-8">
                    Anggota {sectionTitles[section] || section} Desa Jambakan
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionMembers.map((member) => (
                      <PearlCard key={member.id} perangkat={convertToPerangkat(member)} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
