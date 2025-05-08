"use client"

import React, { useState, useEffect } from 'react'
import { useProducts } from '../../context/ProductContext'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiEdit2 } from 'react-icons/fi'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

export default function ProductDetailPage() {
  const params = useParams()
  const { products, updateProduct } = useProducts()
  const [isEditing, setIsEditing] = useState(false)
  const [editedImage, setEditedImage] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDesc, setEditedDesc] = useState('')
  const [editedTags, setEditedTags] = useState('')
  const [editedDetail, setEditedDetail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // params.id가 배열인 경우 첫 번째 요소를 사용
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  const product = products.find(p => p.id === productId)

  useEffect(() => {
    // 로그인 상태 확인
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  useEffect(() => {
    if (product) {
      setEditedImage(product.image || '')
      setEditedTitle(product.title || '')
      setEditedDesc(product.description || '')
      setEditedTags(product.tags ? product.tags.join(', ') : '')
      setEditedDetail(product.detail || '')
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">제품을 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 제품 ID: {productId}</p>
          <p className="text-gray-600 mt-2">사용 가능한 제품 ID: {products.map(p => p.id).join(', ')}</p>
          <div className="mt-4">
            <Link 
              href="/products" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              제품 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 저장 함수
  const handleSave = async () => {
    await updateProduct(product.id, {
      ...product,
      image: editedImage,
      title: editedTitle,
      description: editedDesc,
      tags: editedTags.split(',').map(t => t.trim()).filter(Boolean),
      detail: editedDetail
    })
    setIsEditing(false)
  }

  // 이미지 업로드 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 상단 카드: 이미지 + 정보 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 flex flex-col md:flex-row">
            {/* 이미지 (7) */}
            <div
              className="relative bg-gray-100 flex flex-col items-center justify-center"
              style={{ flexBasis: '70%', minWidth: 0, minHeight: 360, aspectRatio: '16/9', maxHeight: 500 }}
            >
              <div className="relative w-full h-full" style={{ minHeight: 320 }}>
                {isEditing ? (
                  <Image
                    src={editedImage || product.image || '/images/products/MSI.png'}
                    alt="제품 이미지"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={product.image || '/images/products/MSI.png'}
                    alt="제품 이미지"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              {isEditing && (
                <div className="w-full flex flex-col items-center mt-4">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="mb-1" />
                  <span className="text-xs text-gray-500">이미지 변경</span>
                </div>
              )}
            </div>
            {/* 정보 (3) */}
            <div
              className="flex flex-col justify-center p-8 gap-6"
              style={{ flexBasis: '30%', minWidth: 0 }}
            >
              {/* 제품명 */}
              <div className="mb-4">
                {isEditing ? (
                  <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="w-full border-b-2 border-[#948979] bg-transparent text-3xl font-extrabold focus:outline-none" />
                ) : (
                  <h1 className="text-3xl font-extrabold text-[#393E46] tracking-tight mb-2">
                    {product.title}
                    <span className="block w-12 h-1 bg-[#948979] mt-2 rounded"></span>
                  </h1>
                )}
              </div>
              {/* 간단 설명 */}
              <div className="mb-4">
                {isEditing ? (
                  <textarea value={editedDesc} onChange={e => setEditedDesc(e.target.value)} className="w-full border rounded-lg p-3 text-base" />
                ) : (
                  <div className="bg-[#F4EFE6] text-[#393E46] rounded-lg px-4 py-3 shadow-sm flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#948979]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    <span className="font-medium">{product.description}</span>
                  </div>
                )}
              </div>
              {/* 태그 */}
              {isEditing ? (
                <input type="text" value={editedTags} onChange={e => setEditedTags(e.target.value)} className="w-full border rounded-lg p-2" placeholder="태그를 쉼표(,)로 구분" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">{tag}</span>
                  ))}
                </div>
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
                  value={editedDetail}
                  onChange={setEditedDetail}
                />
              </div>
            ) : (
              <div
                className="prose max-w-none mt-4"
                dangerouslySetInnerHTML={{ __html: product.detail || '' }}
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
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      )}
    </main>
  )
} 