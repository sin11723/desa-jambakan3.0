import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "desa_jambakan",
})

async function ensureTable(conn: mysql.PoolConnection) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS desa_demographics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      year INT NOT NULL,
      kelahiran INT DEFAULT 0,
      kematian INT DEFAULT 0,
      kepala_keluarga INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_year (year)
    )
  `)
}

export async function GET() {
  try {
    const conn = await pool.getConnection()
    await ensureTable(conn)
    const [rows] = await conn.execute("SELECT * FROM desa_demographics ORDER BY year ASC")
    conn.release()
    return NextResponse.json(rows)
  } catch (err) {
    console.error("Demographics GET error:", err)
    return NextResponse.json({ error: "Gagal mengambil data demografis" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { year, kelahiran = 0, kematian = 0, kepala_keluarga = 0 } = body
    if (!year) return NextResponse.json({ error: "Tahun wajib diisi" }, { status: 400 })
    const conn = await pool.getConnection()
    await ensureTable(conn)
    const sql = "INSERT INTO desa_demographics (year, kelahiran, kematian, kepala_keluarga) VALUES (?,?,?,?)"
    const [result] = await conn.execute(sql, [year, kelahiran, kematian, kepala_keluarga])
    conn.release()
    return NextResponse.json({ ok: true, id: (result as any).insertId })
  } catch (err) {
    console.error("Demographics POST error:", err)
    return NextResponse.json({ error: "Gagal menambah data demografis" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, year, kelahiran = 0, kematian = 0, kepala_keluarga = 0 } = body
    if (!id && !year) return NextResponse.json({ error: "Butuh id atau year" }, { status: 400 })
    const conn = await pool.getConnection()
    await ensureTable(conn)
    const where = id ? "id = ?" : "year = ?"
    const param = id ? id : year
    const sql = `UPDATE desa_demographics SET year = ?, kelahiran = ?, kematian = ?, kepala_keluarga = ? WHERE ${where}`
    await conn.execute(sql, [year, kelahiran, kematian, kepala_keluarga, param])
    conn.release()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Demographics PUT error:", err)
    return NextResponse.json({ error: "Gagal memperbarui data demografis" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get("id"))
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 })
    const conn = await pool.getConnection()
    await ensureTable(conn)
    await conn.execute("DELETE FROM desa_demographics WHERE id = ?", [id])
    conn.release()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Demographics DELETE error:", err)
    return NextResponse.json({ error: "Gagal menghapus data demografis" }, { status: 500 })
  }
}