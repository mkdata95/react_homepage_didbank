import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

interface PortfolioItem {
  id: string;
  title: string;
  period: string;
  role: string;
  overview: string;
  details: string;
  client: string;
  image: string;
  category: string;
}

// DB 파일 경로
const dbPath = path.join(process.cwd(), 'portfolio.sqlite')

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// DB 테이블 생성 (최초 1회)
async function ensureTable() {
  const db = await openDb()
  await db.exec(`CREATE TABLE IF NOT EXISTS portfolio (
    id TEXT PRIMARY KEY,
    title TEXT,
    period TEXT,
    role TEXT,
    overview TEXT,
    details TEXT,
    client TEXT,
    image TEXT,
    category TEXT
  )`)
  await db.close()
}

export async function GET() {
  await ensureTable()
  const db = await openDb()
  const items = await db.all('SELECT * FROM portfolio')
  await db.close()
  // details는 JSON 문자열이므로 파싱
  const parsed = items.map((item: PortfolioItem) => ({ 
    ...item, 
    details: JSON.parse(item.details || '[]') 
  }))
  return NextResponse.json(parsed)
}

export async function POST(req: NextRequest) {
  await ensureTable()
  const db = await openDb()
  const body = await req.json()
  const id = uuidv4()
  await db.run(
    'INSERT INTO portfolio (id, title, period, role, overview, details, client, image, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id,
    body.title,
    body.period,
    body.role,
    body.overview,
    JSON.stringify(body.details || []),
    body.client,
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
    'UPDATE portfolio SET title=?, period=?, role=?, overview=?, details=?, client=?, image=?, category=? WHERE id=?',
    body.title,
    body.period,
    body.role,
    body.overview,
    JSON.stringify(body.details || []),
    body.client,
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
  await db.run('DELETE FROM portfolio WHERE id=?', id)
  await db.close()
  return NextResponse.json({ ok: true })
} 