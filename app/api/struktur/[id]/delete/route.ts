import { NextResponse } from 'next/server';
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

// DELETE: Menghapus anggota struktur organisasi
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await createConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM struktur_members WHERE id = ?',
      [params.id]
    );
    
    await connection.end();
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
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