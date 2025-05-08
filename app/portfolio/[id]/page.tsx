"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiEdit2 } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

// 이미지 리사이징 및 최적화 함수
function resizeAndOptimizeImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      // 원본 비율 유지
      let width = img.width;
      let height = img.height;
      
      // 최대 크기 제한
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      // Canvas에 이미지 그리기
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // 최적화된 이미지를 base64로 변환 (JPEG 포맷, 품질 조정)
        const optimizedImage = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedImage);
      } else {
        // Canvas context를 가져올 수 없는 경우 원본 이미지 URL을 반환
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    // 파일을 Data URL로 변환
    img.src = URL.createObjectURL(file);
  });
}

interface Project {
  id: string;
  title: string;
  period: string;
  role: string;
  overview: string;
  details: string[];
  client: string;
  image: string;
  category: string;
  gallery?: string[];
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // 편집 상태 관리
  const [editedTitle, setEditedTitle] = useState('')
  const [editedPeriod, setEditedPeriod] = useState('')
  const [editedRole, setEditedRole] = useState('')
  const [editedClient, setEditedClient] = useState('')
  const [editedCategory, setEditedCategory] = useState('')
  const [editedOverview, setEditedOverview] = useState('')
  const [editedImage, setEditedImage] = useState('')
  const [editedDetails, setEditedDetails] = useState<string[]>([])

  // 로그인 상태 확인
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then((data: Project[]) => {
        const found = data.find((p) => p.id === params.id)
        if (found) {
          setProject(found)
          setEditedTitle(found.title || '')
          setEditedPeriod(found.period || '')
          setEditedRole(found.role || '')
          setEditedClient(found.client || '')
          setEditedCategory(found.category || '')
          setEditedOverview(found.overview || '')
          setEditedImage(found.image || '')
          setEditedDetails(found.details || [])
        }
      })
  }, [params.id])

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">프로젝트를 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 프로젝트 ID: {params.id}</p>
          <div className="mt-4">
            <Link href="/portfolio" className="text-blue-600 hover:text-blue-800 underline">
              프로젝트 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 이미지 업로드 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // 최적화된 이미지로 변환
      const optimizedImage = await resizeAndOptimizeImage(file);
      setEditedImage(optimizedImage);
    }
  }

  // 저장 함수
  const handleSave = async () => {
    if (!project) return
    
    setIsSaving(true)
    try {
      const updatedProject = {
        ...project,
        title: editedTitle,
        period: editedPeriod,
        role: editedRole,
        client: editedClient,
        category: editedCategory,
        overview: editedOverview,
        image: editedImage,
        details: editedDetails
      }

      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      })

      if (response.ok) {
        setProject(updatedProject)
        setIsEditing(false)
      } else {
        alert('저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error)
      alert('오류가 발생했습니다.')
    }
    setIsSaving(false)
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* 상단 카드: 이미지 + 정보 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* 이미지 (6) */}
            <div className="md:w-3/5 w-full h-80 md:h-auto relative">
              {isEditing ? (
                <div className="relative w-full h-full flex flex-col" style={{ minHeight: 320 }}>
                  <Image
                    src={editedImage || '/images/projects/science-museum.jpg'}
                    alt={editedTitle}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 600px"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <label className="bg-white rounded-lg p-4 cursor-pointer text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                      <span className="text-gray-800 font-medium">이미지 변경</span>
                    </label>
                  </div>
                </div>
              ) : (
                <Image
                  src={project.image || '/images/projects/science-museum.jpg'}
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 600px"
                  className="object-cover w-full h-full"
                  style={{ minHeight: 320 }}
                />
              )}
            </div>
            {/* 정보 (4) */}
            <div className="md:w-2/5 w-full flex flex-col justify-center p-8 gap-4">
              {/* 제목 */}
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                  className="text-3xl font-bold border-b-2 border-[#948979] focus:outline-none bg-transparent mb-4"
                  placeholder="프로젝트 제목"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {project.title}
                  <span className="block w-12 h-1 bg-[#948979] mt-2 rounded"></span>
                </h1>
              )}

              {/* 기간 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">기간</h2>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPeriod}
                    onChange={e => setEditedPeriod(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-3 text-gray-600"
                    placeholder="프로젝트 기간"
                  />
                ) : (
                  <p className="text-gray-600 mb-3">{project.period}</p>
                )}

                {/* 카테고리 */}
                <h2 className="text-lg font-semibold text-gray-700 mb-1">카테고리</h2>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCategory}
                    onChange={e => setEditedCategory(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-3 text-gray-600"
                    placeholder="카테고리"
                  />
                ) : (
                  <p className="text-gray-600 mb-3">{project.category}</p>
                )}

                {/* 역할 */}
                {isEditing && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">역할</h2>
                    <input
                      type="text"
                      value={editedRole}
                      onChange={e => setEditedRole(e.target.value)}
                      className="w-full border rounded-lg p-2 mb-3 text-gray-600"
                      placeholder="담당 역할"
                    />
                  </>
                )}

                {/* 클라이언트 */}
                {isEditing && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">클라이언트</h2>
                    <input
                      type="text"
                      value={editedClient}
                      onChange={e => setEditedClient(e.target.value)}
                      className="w-full border rounded-lg p-2 mb-3 text-gray-600"
                      placeholder="클라이언트"
                    />
                  </>
                )}

                {/* 개요 */}
                <h2 className="text-lg font-semibold text-gray-700 mb-1">개요</h2>
                {isEditing ? (
                  <textarea
                    value={editedOverview}
                    onChange={e => setEditedOverview(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-600 min-h-[80px]"
                    placeholder="프로젝트 개요"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{project.overview}</p>
                )}
              </div>
            </div>
          </div>

          {/* 하단 카드: 상세 설명 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">상세 설명</h2>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedDetails.join('\n')}
                  onChange={(e) => setEditedDetails(e.target.value.split('\n'))}
                  className="w-full border rounded-lg p-4 text-gray-600 min-h-[200px]"
                  placeholder="상세 설명 (줄바꿈으로 구분)"
                />
              </div>
            ) : (
              <div className="prose max-w-none">
                {project.details.map((detail, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed mb-4">{detail}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우측 하단 수정 아이콘 (관리자만) */}
      {isLoggedIn && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="수정하기"
        >
          <FiEdit2 size={24} />
        </button>
      )}

      {/* 저장/취소 버튼 (수정 모드일 때만) */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 flex gap-2 z-50">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 rounded-full bg-gray-200 text-gray-800 font-bold shadow hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      )}
    </main>
  )
} 