"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiTrash2, FiPlus } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'

const ITEMS_PER_PAGE = 12

export interface PortfolioItem {
  id: string
  title: string
  period: string
  role: string
  overview: string
  details: string[]
  client: string
  image: string
  category: string
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState<PortfolioItem>({
    id: '',
    title: '',
    period: '',
    role: '',
    overview: '',
    details: [''],
    client: '',
    image: '/images/projects/science-museum.jpg',
    category: '',
  })
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  // 데이터 불러오기
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setItems(data))
  }, [])

  // 카테고리/페이지네이션
  const categories = ['전체', ...Array.from(new Set(items.map(i => i.category)))]
  const filtered = selectedCategory === '전체' ? items : items.filter(p => p.category === selectedCategory)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // 추가
  const handleAdd = async () => {
    if (!newItem.title.trim()) return alert('프로젝트명을 입력하세요!')
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, id: uuidv4() })
    })
    const { id } = await res.json()
    setItems(prev => [...prev, { ...newItem, id }])
    setNewItem({ id: '', title: '', period: '', role: '', overview: '', details: [''], client: '', image: '/images/projects/science-museum.jpg', category: '' })
    setIsAdding(false)
  }

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    await fetch('/api/portfolio', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 rounded-xl py-16 flex flex-col justify-center" style={{ background: '#393E46' }}>
          <h1 className="text-4xl font-bold mb-4 pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>주요실적</h1>
          <p className="text-xl pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>페델타의 주요 프로젝트와 성과를 소개합니다</p>
        </div>
      </section>

      {/* Portfolio Categories & Add Button */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  className={
                    `px-7 py-2 rounded-full font-bold text-base transition-all duration-200 shadow-sm border-2 ` +
                    (selectedCategory === cat ? 'bg-[#222831] text-[#DFD0B8] border-[#948979] shadow-lg scale-105' :
                      'bg-[#DFD0B8] text-[#393E46] border-transparent hover:bg-[#948979] hover:text-[#222831] hover:border-[#393E46]')
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors shadow"
              >
                <FiPlus /> 실적 추가
              </button>
            )}
          </div>
          {isAdding && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 p-6 flex flex-col md:flex-row gap-6 items-center">
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
                          setNewItem(prev => ({ ...prev, image: reader.result as string }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Image
                    src={newItem.image || '/images/projects/science-museum.jpg'}
                    alt="실적 이미지"
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
                  value={newItem.title}
                  onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="프로젝트명"
                  className="text-xl font-bold border rounded-lg p-2 mb-2"
                />
                <input
                  type="text"
                  value={newItem.period}
                  onChange={e => setNewItem(prev => ({ ...prev, period: e.target.value }))}
                  placeholder="기간"
                  className="border rounded-lg p-2 mb-2"
                />
                <input
                  type="text"
                  value={newItem.role}
                  onChange={e => setNewItem(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="담당 역할"
                  className="border rounded-lg p-2 mb-2"
                />
                <input
                  type="text"
                  value={newItem.client}
                  onChange={e => setNewItem(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="클라이언트"
                  className="border rounded-lg p-2 mb-2"
                />
                <input
                  type="text"
                  value={newItem.category}
                  onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="카테고리"
                  className="border rounded-lg p-2 mb-2"
                />
                <textarea
                  value={newItem.overview}
                  onChange={e => setNewItem(prev => ({ ...prev, overview: e.target.value }))}
                  placeholder="간단 설명"
                  className="border rounded-lg p-2 mb-2 h-16"
                />
                <textarea
                  value={newItem.details.join('\n')}
                  onChange={e => setNewItem(prev => ({ ...prev, details: e.target.value.split('\n') }))}
                  placeholder="주요 작업 (줄바꿈으로 구분)"
                  className="border rounded-lg p-2 mb-2 h-24"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAdd}
                    className="px-6 py-2 rounded-lg bg-[#222831] text-[#DFD0B8] font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false)
                      setNewItem({ id: '', title: '', period: '', role: '', overview: '', details: [''], client: '', image: '/images/projects/science-museum.jpg', category: '' })
                    }}
                    className="px-6 py-2 rounded-lg border border-[#222831] text-[#222831] font-semibold hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {paginated.map(project => (
                <div key={project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col h-full border border-gray-100 hover:border-[#948979] relative group">
                  {project.image && (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#393E46]/80 to-transparent" />
                      <div className="absolute left-0 bottom-0 p-4">
                        <div className="inline-block bg-[#DFD0B8] text-[#222831] text-xs font-bold px-3 py-1 rounded-full shadow">{project.category || '카테고리'}</div>
                      </div>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-2 shadow transition-opacity opacity-0 group-hover:opacity-100"
                        title="삭제"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col p-5">
                    <h2 className="text-lg font-bold mb-2 text-[#222831] group-hover:text-[#948979] transition-colors">{project.title}</h2>
                    <div className="text-gray-600 mb-3 line-clamp-2">{project.overview}</div>
                    <div className="flex flex-wrap gap-2 mt-auto text-xs text-gray-500">
                      {project.period && <span className="inline-block bg-gray-100 rounded px-2 py-1">{project.period}</span>}
                      {project.role && <span className="inline-block bg-gray-100 rounded px-2 py-1">{project.role}</span>}
                    </div>
                    <Link href={`/portfolio/${project.id}`} className="mt-4 w-full py-2 rounded-lg bg-[#393E46] text-[#DFD0B8] font-semibold hover:bg-[#222831] transition-colors text-center block">상세 보기</Link>
                  </div>
                </div>
              ))}
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-4 py-2 rounded-lg border font-semibold ${page === num ? 'bg-[#222831] text-[#DFD0B8]' : 'bg-white text-[#393E46] hover:bg-[#DFD0B8] hover:text-[#222831]'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#222831] mb-2">100+</div>
                <div className="text-gray-600">완료 프로젝트</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#222831] mb-2">50+</div>
                <div className="text-gray-600">고객사</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#222831] mb-2">95%</div>
                <div className="text-gray-600">고객 만족도</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#222831] mb-2">10+</div>
                <div className="text-gray-600">산업 분야</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 