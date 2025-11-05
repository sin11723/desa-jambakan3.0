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

// Fungsi untuk memastikan tabel struktur_members ada
async function ensureTableExists(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS struktur_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      position VARCHAR(200) NOT NULL,
      contact VARCHAR(100),
      description TEXT,
      photo_url VARCHAR(500),
      section VARCHAR(100) DEFAULT 'pengurus',
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

// GET: Mengambil semua anggota struktur organisasi
export async function GET() {
  try {
    const connection = await createConnection();
    await ensureTableExists(connection);
    
    const [rows] = await connection.execute(
      'SELECT * FROM struktur_members ORDER BY section, order_index, name'
    );
    
    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching struktur members:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data struktur organisasi' },
      { status: 500 }
    );
  }
}

// POST: Menambahkan anggota struktur organisasi baru
export async function POST(request: NextRequest) {
  try {
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
    await ensureTableExists(connection);
    
    const [result] = await connection.execute(
      `INSERT INTO struktur_members (name, position, contact, description, photo_url, section, order_index) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, position, contact || null, description || null, photo_url || null, section || 'pengurus', order_index || 0]
    );
    
    await connection.end();
    
    return NextResponse.json({
      message: 'Anggota struktur organisasi berhasil ditambahkan',
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Error creating struktur member:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan anggota struktur organisasi' },
      { status: 500 }
    );
  }
}