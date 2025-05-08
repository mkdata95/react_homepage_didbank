import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// DB 파일 경로
const dbPath = path.join(process.cwd(), 'products.sqlite')

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// DB 테이블 생성 (최초 1회)
async function ensureTable() {
  const db = await openDb()
  await db.exec(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    detail TEXT,
    image TEXT,
    category TEXT
  )`)
  await db.close()
}

export async function GET() {
  await ensureTable()
  const db = await openDb()
  const items = await db.all('SELECT * FROM products')
  await db.close()
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  const id = uuidv4()
  await db.run(
    'INSERT INTO products (id, title, description, detail, image, category) VALUES (?, ?, ?, ?, ?, ?)',
    id,
    body.title,
    body.description,
    body.detail,
    body.image,
    body.category
  )
  await db.close()
  return NextResponse.json({ id })
}

export async function PUT(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  await db.run(
    'UPDATE products SET title=?, description=?, detail=?, image=?, category=? WHERE id=?',
    body.title,
    body.description,
    body.detail,
    body.image,
    body.category,
    body.id
  )
  await db.close()
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const { id } = await req.json()
  await db.run('DELETE FROM products WHERE id=?', id)
  await db.close()
  return NextResponse.json({ ok: true })
} 