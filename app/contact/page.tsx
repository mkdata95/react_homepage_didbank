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
    <main className="pt-20 bg-white min-h-screen">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-center mb-20 text-[#222831]">문의하기</h1>
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">이름</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="이름" className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">이메일</label>
                    <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="이메일" className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-3">제목</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="제목" className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-3">문의 내용</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required placeholder="문의 내용" className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg" style={{ minHeight: '320px' }} />
                </div>
                <button type="submit" disabled={sending} className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg shadow-lg">
                  {sending ? '전송 중...' : '제출하기'}
                </button>
                {success && <div className="text-green-600 text-center font-semibold mt-2">{success}</div>}
                {error && <div className="text-red-600 text-center font-semibold mt-2">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 