import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Fungsi untuk membuat koneksi database
async function createConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'desa_jambakan'
  });
}

// GET: Mengambil anggota struktur organisasi berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params promise
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID anggota tidak valid' },
        { status: 400 }
      );
    }
    
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM struktur_members WHERE id = ?',
      [id]
    );
    
    await connection.end();
    
    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching struktur member:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data anggota' },
      { status: 500 }
    );
  }
}

// PUT: Memperbarui anggota struktur organisasi
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params promise
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID anggota tidak valid' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, position, contact, description, photo_url, section, order_index } = body;
    
    // Validasi data
    if (!name || !position) {
      return NextResponse.json(
        { error: 'Nama dan jabatan wajib diisi' },
        { status: 400 }
      );
    }
    
    const connection = await createConnection();
    
    const [result] = await connection.execute(
      `UPDATE struktur_members 
       SET name = ?, position = ?, contact = ?, description = ?, photo_url = ?, section = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, position, contact || null, description || null, photo_url || null, section || 'pengurus', order_index || 0, id]
    );
    
    await connection.end();
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Anggota struktur organisasi berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating struktur member:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui anggota struktur organisasi' },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus anggota struktur organisasi
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params promise
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID anggota tidak valid' },
        { status: 400 }
      );
    }
    
    const connection = await createConnection();
    
    // Cek apakah anggota ada
    const [existing] = await connection.execute(
      'SELECT id FROM struktur_members WHERE id = ?',
      [id]
    );
    
    if (Array.isArray(existing) && existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Hapus anggota
    const [result] = await connection.execute(
      'DELETE FROM struktur_members WHERE id = ?',
      [id]
    );
    
    await connection.end();
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Gagal menghapus anggota' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Anggota struktur organisasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting struktur member:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus anggota struktur organisasi' },
      { status: 500 }
    );
  }
}