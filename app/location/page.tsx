"use client"
import { useSiteContent } from '../context/SiteContentContext'

export default function LocationPage() {
  const { siteContent } = useSiteContent()
  const info = siteContent.siteInfo
  const mapAddress = info?.address ? encodeURIComponent(info.address) : encodeURIComponent('삼성역')
  const mapUrl = `https://map.naver.com/v5/search/${mapAddress}`
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center" style={{ backgroundColor: '#181617', backgroundImage: 'url(/images/hero-default.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '48px' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center w-full pt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">회사소개</h1>
        </div>
      </div>
      {/* 경로 네비게이션 */}
      <div className="bg-white border-b">
        <div className="container mx-auto flex gap-2 py-4 px-2 text-gray-500 text-sm items-center" style={{ maxWidth: '1100px' }}>
          <span>홈</span>
          <span className="mx-1">&gt;</span>
          <span>회사소개</span>
          <span className="mx-1">&gt;</span>
          <span className="text-black">오시는길</span>
        </div>
      </div>
      {/* CONTACT US 타이틀 */}
      <div className="text-center mt-16 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#B85C38] tracking-widest mb-2">CONTACT <span className="text-black">US</span></h2>
        <p className="text-gray-600 text-lg">찾아오시는 길을 자세히 알려드립니다.</p>
      </div>
      {/* 지도 */}
      <div className="mx-auto mb-12" style={{ maxWidth: '1100px' }}>
        <div className="rounded-xl overflow-hidden shadow-lg border">
          <iframe
            src={mapUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="네이버 지도"
          ></iframe>
        </div>
      </div>
      {/* 회사 정보 */}
      <div className="mx-auto mb-20" style={{ maxWidth: '1100px' }}>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="bg-white rounded-xl shadow p-8 flex-1 min-w-[320px]">
            <div className="mb-4">
              <div className="text-lg font-bold mb-1 text-[#222831]">주소</div>
              <div className="text-gray-700">{info?.address || '주소 정보 없음'}</div>
            </div>
            <div className="mb-4">
              <div className="text-lg font-bold mb-1 text-[#222831]">연락처</div>
              <div className="text-gray-700">{info?.phone || '연락처 정보 없음'}</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-1 text-[#222831]">이메일</div>
              <div className="text-gray-700">{info?.email || '이메일 정보 없음'}</div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 안내/버튼 등은 필요시 추가 */}
    </main>
  )
} 