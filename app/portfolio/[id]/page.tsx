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
  details: string[] | string; // 배열 또는 HTML 문자열 지원
  client: string;
  image: string;
  category: string;
  gallery?: GalleryItem[];
}

interface GalleryItem {
  image: string;
  caption: string;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // 편집 상태 관리
  const [editedTitle, setEditedTitle] = useState('')
  const [editedPeriod, setEditedPeriod] = useState('')
  const [editedRole, setEditedRole] = useState('')
  const [editedClient, setEditedClient] = useState('')
  const [editedCategory, setEditedCategory] = useState('')
  const [editedOverview, setEditedOverview] = useState('')
  const [editedImage, setEditedImage] = useState('')
  const [editedDetails, setEditedDetails] = useState('')
  const [editedGallery, setEditedGallery] = useState<GalleryItem[]>([])

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
          
          // details가 배열인 경우 HTML로 변환, 문자열인 경우 그대로 사용
          if (Array.isArray(found.details)) {
            setEditedDetails(found.details.map(detail => `<p>${detail}</p>`).join(''))
          } else {
            setEditedDetails(found.details || '')
          }
          
          // 갤러리 설정
          setEditedGallery(found.gallery || [])
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
  
  // 갤러리 이미지 업로드 핸들러
  const handleGalleryImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const optimizedImage = await resizeAndOptimizeImage(file);
      
      const newGallery = [...editedGallery];
      if (newGallery[index]) {
        newGallery[index] = {
          ...newGallery[index],
          image: optimizedImage
        };
      } else {
        newGallery[index] = {
          image: optimizedImage,
          caption: ''
        };
      }
      
      setEditedGallery(newGallery);
    }
  }
  
  // 갤러리 캡션 변경 핸들러
  const handleCaptionChange = (index: number, caption: string) => {
    const newGallery = [...editedGallery];
    if (newGallery[index]) {
      newGallery[index] = {
        ...newGallery[index],
        caption
      };
    }
    setEditedGallery(newGallery);
  }
  
  // 이미지 전체화면 보기
  const openFullscreen = (image: string) => {
    setSelectedImage(image);
  }
  
  // 전체화면 닫기
  const closeFullscreen = () => {
    setSelectedImage(null);
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
        details: editedDetails, // HTML 형식으로 저장
        gallery: editedGallery
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
        <div className="max-w-6xl mx-auto space-y-12">
          {/* 상단 카드: 이미지 + 정보 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* 이미지 */}
            <div className="md:w-[70%] w-full h-80 md:h-auto relative bg-gray-100">
              {isEditing ? (
                <div className="relative w-full h-full flex flex-col" style={{ minHeight: 360, aspectRatio: '16/9', maxHeight: 500 }}>
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
                  style={{ minHeight: 360, aspectRatio: '16/9', maxHeight: 500 }}
                />
              )}
            </div>
            {/* 정보 */}
            <div className="md:w-[30%] w-full flex flex-col justify-center p-8 gap-4" style={{ minWidth: 0 }}>
              {/* 제목 */}
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                  className="text-3xl font-extrabold border-b-2 border-[#948979] focus:outline-none bg-transparent mb-4"
                  placeholder="프로젝트 제목"
                />
              ) : (
                <h1 className="text-3xl font-extrabold text-[#393E46] tracking-tight mb-2">
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

          {/* 갤러리 카드 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">프로젝트 갤러리</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isEditing ? (
                // 편집 모드의 갤러리
                Array.from({ length: 6 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex flex-col"
                  >
                    <div className="relative h-80 bg-gray-100 flex items-center justify-center">
                      {editedGallery[index]?.image ? (
                        <div className="w-full h-full relative">
                          <Image
                            src={editedGallery[index].image}
                            alt={`갤러리 이미지 ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <label className="bg-white text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-100">
                              변경
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleGalleryImageChange(e, index)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center p-4 text-center hover:bg-gray-200 transition-colors w-full h-full">
                          <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-gray-500 text-lg">이미지 추가</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleGalleryImageChange(e, index)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <input
                        type="text"
                        value={editedGallery[index]?.caption || ''}
                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="이미지 설명"
                      />
                    </div>
                  </div>
                ))
              ) : (
                // 보기 모드의 갤러리
                project?.gallery && project.gallery.length > 0 ? (
                  project.gallery.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div 
                        className="relative h-80 cursor-pointer"
                        onClick={() => openFullscreen(item.image)}
                      >
                        <Image
                          src={item.image}
                          alt={item.caption || `갤러리 이미지 ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                            확대
                          </span>
                        </div>
                      </div>
                      {item.caption && (
                        <div className="p-4">
                          <p className="text-gray-700 text-lg">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-16 text-center text-gray-500">
                    등록된 갤러리 이미지가 없습니다.
                  </div>
                )
              )}
            </div>
          </div>

          {/* 하단 카드: 상세 설명 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">상세 설명</h2>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <RichTextEditor
                  value={editedDetails}
                  onChange={setEditedDetails}
                />
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none mt-4"
                dangerouslySetInnerHTML={{ __html: typeof project.details === 'string' ? project.details : project.details.map(detail => `<p>${detail}</p>`).join('') }}
              />
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

      {/* 전체화면 이미지 모달 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <div className="relative w-full max-w-6xl max-h-screen">
            <div className="relative" style={{ maxHeight: '90vh' }}>
              <Image
                src={selectedImage}
                alt="갤러리 이미지 전체보기"
                width={1920}
                height={1080}
                className="object-contain mx-auto max-h-[90vh]"
              />
            </div>
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="닫기"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  )
} 