"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/notice')
      .then(res => res.json())
      .then(data => setNotices(data))
    // 관리자 여부 확인 - 쿠키 기반으로 변경
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const found = cookies.find(c => c.startsWith('admin_auth='))
      setIsAdmin(Boolean(found && found.split('=')[1] === '1'))
    }
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 상단 비주얼 */}
      <div className="relative h-64 bg-black mt-16">
        <img src="/images/visual.jpg" className="w-full h-full object-cover opacity-60" alt="고객센터 비주얼" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-2">고객센터</h1>
        </div>
      </div>
      {/* 2차 메뉴 */}
      <div className="bg-white border-b">
        <div className="container mx-auto flex gap-4 py-4 px-2" style={{ maxWidth: '1100px' }}>
          <button className="font-bold border-b-2 border-black px-4">공지사항</button>
          <Link href="/customer/qna" className="text-gray-500 px-4">문의하기</Link>
        </div>
      </div>
      {/* 경로 네비게이션 */}
      <div className="container mx-auto text-sm text-gray-400 py-2 px-2 flex gap-2 items-center" style={{ maxWidth: '1100px' }}>
        <span>홈</span>
        <span className="mx-1">/</span>
        <span>고객센터</span>
        <span className="mx-1">/</span>
        <span className="text-black">공지사항</span>
      </div>
      {/* 공지사항 리스트 */}
      <div className="container mx-auto py-8 px-2" style={{ maxWidth: '1100px' }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <div>전체 <span className="text-blue-600 font-bold">{notices.length}</span>건</div>
          {isAdmin && (
            <Link href="/customer/notice/write" className="bg-blue-600 text-white px-4 py-2 rounded font-bold">글쓰기</Link>
          )}
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">번호</th>
                <th className="p-2">제목</th>
                <th className="p-2">작성자</th>
                <th className="p-2">조회</th>
                <th className="p-2">날짜</th>
                <th className="p-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, idx) => (
                <tr key={notice.id}>
                  <td className="p-2">{notice.id}</td>
                  <td className="p-2 text-left">
                    <Link href={`/customer/notice/${notice.id}`} className="text-blue-700 hover:underline">
                      {notice.title}
                    </Link>
                  </td>
                  <td className="p-2">{notice.author}</td>
                  <td className="p-2">{notice.views}</td>
                  <td className="p-2">{notice.date?.slice(0, 10)}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    <Link href={`/customer/notice/edit/${notice.id}`} className="text-xs text-white bg-gray-500 rounded px-2 py-1">수정</Link>
                    <button
                      className="text-xs text-white bg-red-500 rounded px-2 py-1"
                      onClick={async () => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          await fetch(`/api/notice/${notice.id}`, { method: 'DELETE' })
                          setNotices(notices.filter(n => n.id !== notice.id))
                        }
                      }}
                    >삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 