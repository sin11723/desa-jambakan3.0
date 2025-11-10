import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "desa_jambakan",
})

export async function GET() {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute("SELECT * FROM desa_profile ORDER BY id DESC LIMIT 1")
    connection.release()

    if (rows.length === 0) {
      return NextResponse.json({ error: "Profile desa tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Gagal mengambil data profile desa" }, { status: 500 })
  }
}

// Tambah data profile desa baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const connection = await pool.getConnection()
    const sql = `INSERT INTO desa_profile (
      desa_name, desa_code, sub_district, district, province, description,
      vision, mission, history, total_population, total_families,
      village_chief_name, village_chief_phone, area_km2, main_livelihoods,
      contact_email, contact_phone, address, image_url
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    const values = [
      body.desa_name || null,
      body.desa_code || null,
      body.sub_district || null,
      body.district || null,
      body.province || null,
      body.description || null,
      body.vision || null,
      body.mission || null,
      body.history || null,
      body.total_population ?? null,
      body.total_families ?? null,
      body.village_chief_name || null,
      body.village_chief_phone || null,
      body.area_km2 ?? null,
      body.main_livelihoods || null,
      body.contact_email || null,
      body.contact_phone || null,
      body.address || null,
      body.image_url || null,
    ]
    const [result] = await connection.execute(sql, values)
    connection.release()
    return NextResponse.json({ ok: true, id: (result as any).insertId })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Gagal menambah data profile desa" }, { status: 500 })
  }
}

// Update data profile desa
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const connection = await pool.getConnection()

    // Tentukan target id: dari body.id atau ambil terakhir
    let targetId = body.id as number | undefined
    if (!targetId) {
      const [rows] = await connection.execute("SELECT id FROM desa_profile ORDER BY id DESC LIMIT 1")
      const latest = Array.isArray(rows) && rows.length > 0 ? (rows as any)[0].id : null
      targetId = latest ?? undefined
    }

    if (!targetId) {
      connection.release()
      return NextResponse.json({ error: "Tidak ada data profile untuk diperbarui" }, { status: 400 })
    }

    const sql = `UPDATE desa_profile SET
      desa_name = ?, desa_code = ?, sub_district = ?, district = ?, province = ?, description = ?,
      vision = ?, mission = ?, history = ?, total_population = ?, total_families = ?,
      village_chief_name = ?, village_chief_phone = ?, area_km2 = ?, main_livelihoods = ?,
      contact_email = ?, contact_phone = ?, address = ?, image_url = ?
      WHERE id = ?`
    const values = [
      body.desa_name || null,
      body.desa_code || null,
      body.sub_district || null,
      body.district || null,
      body.province || null,
      body.description || null,
      body.vision || null,
      body.mission || null,
      body.history || null,
      body.total_population ?? null,
      body.total_families ?? null,
      body.village_chief_name || null,
      body.village_chief_phone || null,
      body.area_km2 ?? null,
      body.main_livelihoods || null,
      body.contact_email || null,
      body.contact_phone || null,
      body.address || null,
      body.image_url || null,
      targetId,
    ]

    await connection.execute(sql, values)
    connection.release()
    return NextResponse.json({ ok: true, id: targetId })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Gagal memperbarui data profile desa" }, { status: 500 })
  }
}
