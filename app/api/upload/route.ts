import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 이미지 압축
    const compressedBuffer = await sharp(buffer)
      .resize(1200, 1200, { // 최대 크기 제한
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // JPEG 포맷으로 변환 및 품질 설정
      .toBuffer()

    // 파일 확장자 추출
    const ext = 'jpg' // 항상 JPEG로 저장
    const fileName = `${uuidv4()}.${ext}`

    // public/uploads 디렉토리에 파일 저장
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, compressedBuffer)

    // 파일 URL 반환
    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
} 