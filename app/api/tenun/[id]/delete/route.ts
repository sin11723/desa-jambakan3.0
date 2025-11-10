import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    // Cek apakah produk ada
    const [existingProduct]: any = await connection.execute("SELECT id FROM tenun_products WHERE id = ?", [id])
    if (existingProduct.length === 0) {
      await connection.end()
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Hapus produk
    const [result]: any = await connection.execute("DELETE FROM tenun_products WHERE id = ?", [id])
    
    await connection.end()
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("[v0] Error during delete:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
