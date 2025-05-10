import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Fetching portfolio with ID:', params.id);
  
  try {
    // DB 연결
    const db = await open({
      filename: path.join(process.cwd(), 'portfolio.sqlite'),
      driver: sqlite3.Database
    })
    
    console.log('Database connected');
    
    const item = await db.get('SELECT * FROM portfolio WHERE id = ?', params.id)
    await db.close()

    if (!item) {
      console.log('Portfolio not found with ID:', params.id);
      return NextResponse.json({ error: '포트폴리오를 찾을 수 없습니다' }, { status: 404 })
    }

    console.log('Portfolio found, processing data');
    
    // 필드 파싱 처리
    try {
      // 갤러리 데이터 파싱
      if (item.gallery) {
        try {
          item.gallery = JSON.parse(item.gallery)
        } catch (e) {
          console.log('Failed to parse gallery JSON:', e);
          item.gallery = []
        }
      } else {
        item.gallery = [];
      }
      
      // details 데이터 파싱
      if (item.details) {
        try {
          item.details = JSON.parse(item.details)
        } catch (e) {
          console.log('Failed to parse details JSON, keeping as is:', e);
          // 파싱에 실패하면 원본 문자열 유지
        }
      }
    } catch (error) {
      console.error('Error parsing portfolio data:', error)
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: '포트폴리오 데이터를 불러오는 중 서버 오류가 발생했습니다' }, 
      { status: 500 }
    )
  }
} 