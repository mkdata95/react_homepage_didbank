"use client"

import { useProducts, Product } from '../context/ProductContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiTrash2, FiPlus, FiTag } from 'react-icons/fi'
import Image from 'next/image'

// UUID 생성 함수
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function ProductsPage() {
  const { products, addProduct, deleteProduct } = useProducts()
  const [isAdding, setIsAdding] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newProduct, setNewProduct] = useState<Product>({
    id: generateUUID(),
    title: '',
    description: '',
    detail: '',
    image: '/images/products/MSI.png',
  })

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  // 제품에서 카테고리 추출(중복 제거)
  useEffect(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter((c): c is string => Boolean(c))))
    setCategories(cats)
  }, [products])

  const handleAddCategory = () => {
    const cat = newCategory.trim()
    if (!cat) return
    if (categories.includes(cat)) return alert('이미 존재하는 카테고리입니다.')
    setCategories(prev => [...prev, cat])
    setNewCategory('')
  }
  const handleDeleteCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat))
  }

  const handleAddProduct = () => {
    if (!newProduct.title.trim()) return alert('제품명을 입력하세요!')
    addProduct(newProduct)
    setNewProduct({
      id: generateUUID(),
      title: '',
      description: '',
      detail: '',
      image: '/images/products/MSI.png',
      tags: []
    })
    setIsAdding(false)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setNewProduct({
      id: generateUUID(),
      title: '',
      description: '',
      detail: '',
      image: '/images/products/MSI.png',
      tags: []
    })
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 rounded-xl py-16 flex flex-col justify-center" style={{ background: '#393E46' }}>
          <h1 className="text-4xl font-bold mb-4 pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>제품</h1>
          <p className="text-xl pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>최고의 품질과 혁신적인 기술로 만든 제품을 소개합니다</p>
        </div>
      </section>

      {/* Products List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-8 flex justify-end gap-2">
            {isLoggedIn && !isAdding && (
              <>
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors shadow"
                >
                  <FiPlus /> 제품 추가
                </button>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#DFD0B8] text-[#222831] font-semibold hover:bg-[#222831] hover:text-[#DFD0B8] transition-colors shadow"
                >
                  <FiTag /> 카테고리 관리
                </button>
              </>
            )}
          </div>
          {isAdding && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/4 flex flex-col items-center">
                <label className="w-full flex flex-col items-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewProduct(prev => ({ ...prev, image: reader.result as string }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Image
                    src={newProduct.image || '/images/products/MSI.png'}
                    alt="제품 이미지"
                    width={128}
                    height={128}
                    className="object-cover rounded-xl border mb-2"
                  />
                  <span className="text-xs text-gray-500">이미지 변경</span>
                </label>
              </div>
              <div className="w-full md:w-3/4 flex flex-col gap-2">
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={e => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="제품명"
                  className="text-xl font-bold border rounded-lg p-2 mb-2"
                />
                <select
                  value={newProduct.category || ''}
                  onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="border rounded-lg p-2 mb-2"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="간단 설명"
                  className="border rounded-lg p-2 mb-2 h-16"
                />
                <textarea
                  value={newProduct.detail}
                  onChange={e => setNewProduct(prev => ({ ...prev, detail: e.target.value }))}
                  placeholder="상세 설명"
                  className="border rounded-lg p-2 mb-2 h-24"
                />
                <p className="text-sm text-gray-500 mb-2">상세 설명은 하단 상세 설명 영역에 본문으로 출력됩니다.</p>
                <input
                  type="text"
                  value={newProduct.tags ? newProduct.tags.join(', ') : ''}
                  onChange={e => setNewProduct(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }))}
                  placeholder="태그를 쉼표(,)로 구분하여 입력"
                  className="border rounded-lg p-2 mb-2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg border border-[#222831] text-[#222831] font-semibold hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden relative flex flex-col group transition hover:shadow-2xl"
                  style={{ minHeight: 380 }}
                >
                  {/* 이미지 영역 */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover w-full h-full"
                      />
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('정말 삭제하시겠습니까?')) deleteProduct(product.id)
                      }}
                      className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-2 shadow transition-opacity opacity-100 hover:scale-110"
                      title="삭제"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                  {/* 내용 영역 */}
                  <div className="flex-1 flex flex-col p-6 gap-2">
                    <h3 className="text-lg font-bold mb-1 text-[#222831]">{product.title}</h3>
                    <p className="text-gray-500 mb-2 text-sm">{product.description}</p>
                    {/* 태그만 태그 스타일로 출력 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags && product.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 border">{tag}</span>
                      ))}
                    </div>
                    <div className="flex-1 flex items-end justify-center">
                      <Link
                        href={`/products/${product.id}`}
                        className="block w-full text-center font-bold py-2 rounded-lg text-[#222831] hover:bg-gray-100 transition"
                      >
                        상세 보기
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">제품 문의</h2>
            <p className="text-gray-600 mb-8">
              제품에 대한 자세한 정보나 견적 문의가 필요하시다면 언제든지 연락주세요.
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#222831] text-[#DFD0B8] px-8 py-3 rounded-lg font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>
      </section>

      {/* 카테고리 관리 모달 */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-6 text-center">카테고리 관리</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="새 카테고리 입력"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                className="border rounded-lg px-3 py-2 flex-1"
              />
              <button
                onClick={handleAddCategory}
                className="bg-[#222831] text-[#DFD0B8] font-bold px-4 py-2 rounded-lg hover:bg-[#948979] hover:text-[#222831] transition-colors"
              >
                추가
              </button>
            </div>
            <ul className="space-y-2">
              {categories.length === 0 && <li className="text-gray-400 text-center">카테고리가 없습니다.</li>}
              {categories.map(cat => (
                <li key={cat} className="flex items-center justify-between bg-[#F4EFE6] rounded-lg px-4 py-2">
                  <span className="font-medium text-[#393E46]">{cat}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  )
} 