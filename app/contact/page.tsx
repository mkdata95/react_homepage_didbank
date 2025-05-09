"use client"
import { useState } from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function ContactPage() {
  const { siteContent } = useSiteContent()
  const adminEmail = siteContent.siteInfo.email
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess('')
    setError('')
    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, to: adminEmail })
      })
      if (res.ok) {
        setSuccess('문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setError('문의 접수에 실패했습니다. 다시 시도해 주세요.')
      }
    } catch {
      setError('서버 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4 mt-20" style={{ maxWidth: '1100px' }}>
        <div className="bg-white rounded-xl shadow-lg">
          {/* 헤더 */}
          <div className="border-b px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">문의하기</h2>
          </div>
          {/* 폼 */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">이름 <span className="text-red-500">*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="이름을 입력하세요" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">이메일 <span className="text-red-500">*</span></label>
                  <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="이메일을 입력하세요" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">제목 <span className="text-red-500">*</span></label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="제목을 입력하세요" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">문의 내용 <span className="text-red-500">*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} required placeholder="문의 내용을 입력하세요" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y text-lg" style={{ height: '300px' }} />
              </div>
            </div>
            {/* 버튼 영역 */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? '전송 중...' : '문의하기'}
              </button>
            </div>
            {success && <div className="text-green-600 text-center font-semibold mt-4">{success}</div>}
            {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
          </form>
        </div>
      </div>
    </main>
  )
} 