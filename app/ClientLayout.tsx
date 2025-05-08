"use client"
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode, useState, useEffect } from 'react'

const Footer = dynamic(() => import('./components/Footer'), { ssr: false })

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    // 쿠키에서 로그인 상태 확인
    const cookies = document.cookie.split(';').map(c => c.trim())
    const found = cookies.find(c => c.startsWith('admin_auth='))
    setIsLoggedIn(Boolean(found && found.split('=')[1] === '1'))
  }, [])

  const handleLogout = () => {
    document.cookie = 'admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // 간단 예시: 아이디 admin, 비번 1234
    if (loginId === 'admin' && loginPw === '1234') {
      document.cookie = 'admin_auth=1; path=/'
      setIsLoggedIn(true)
      setIsLoginModalOpen(false)
      setLoginError('')
      setLoginId('')
      setLoginPw('')
      window.location.reload()
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <>
      {!isAdmin && (
        <header className="fixed w-full" style={{ background: '#222831', boxShadow: '0 2px 8px 0 #393E46', borderBottom: '2px solid #393E46', zIndex: 50 }}>
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold" style={{ color: '#DFD0B8' }}>
                페델타
              </Link>
              <div className="hidden md:flex items-center space-x-10">
                <Link href="/about" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>회사소개</Link>
                <Link href="/products" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>주요제품</Link>
                <Link href="/portfolio" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>주요실적</Link>
                <Link href="/downloads" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>자료다운로드</Link>
                <Link href="/location" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>오시는길</Link>
                <Link href="/contact" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>문의하기</Link>
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/admin" className="font-semibold transition-colors" style={{ color: '#DFD0B8' }}>관리자</Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-lg border border-[#DFD0B8] text-[#DFD0B8] font-semibold hover:bg-[#DFD0B8] hover:text-[#222831] transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-2 rounded-lg border border-[#DFD0B8] text-[#DFD0B8] font-semibold hover:bg-[#DFD0B8] hover:text-[#222831] transition-colors"
                  >
                    로그인
                  </button>
                )}
              </div>
              <button className="md:hidden transition-colors" style={{ color: '#DFD0B8' }}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>
      )}
      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs relative">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-6 text-center">관리자 로그인</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="아이디"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="border rounded-lg px-3 py-2"
                autoFocus
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
              <button
                type="submit"
                className="bg-[#222831] text-[#DFD0B8] font-bold py-2 rounded-lg hover:bg-[#948979] hover:text-[#222831] transition-colors"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      )}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
} 