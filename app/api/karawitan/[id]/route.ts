import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    const [rows] = await connection.execute("SELECT * FROM karawitan WHERE id = ?", [id])
    await connection.end()

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0])
    }
    return NextResponse.json({ error: "Karawitan not found" }, { status: 404 })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to fetch karawitan item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, content, image_url } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    await connection.execute(
      "UPDATE karawitan SET title = ?, description = ?, content = ?, image_url = ? WHERE id = ?",
      [title, description, content, image_url, id]
    )

    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to update karawitan content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    await connection.execute("DELETE FROM karawitan WHERE id = ?", [id])

    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to delete karawitan content" }, { status: 500 })
  }
}