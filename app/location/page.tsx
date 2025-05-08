"use client"
import { useSiteContent } from '../context/SiteContentContext'

export default function LocationPage() {
  const { siteContent } = useSiteContent()
  const info = siteContent.siteInfo
  const mapAddress = info?.address ? encodeURIComponent(info.address) : encodeURIComponent('삼성역')
  const mapUrl = `https://map.naver.com/v5/search/${mapAddress}`
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 rounded-xl py-16 flex flex-col justify-center" style={{ background: '#393E46' }}>
          <h1 className="text-4xl font-bold mb-4 pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>오시는 길</h1>
          <p className="text-xl pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>{info?.siteName} 전시장 및 사무실 위치를 안내합니다</p>
        </div>
      </section>
      {/* Info + Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 회사 정보 */}
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col gap-6">
            <div>
              <div className="text-lg font-bold mb-2 text-[#222831]">주소</div>
              <div className="text-gray-700">{info?.address || '주소 정보 없음'}</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-2 text-[#222831]">연락처</div>
              <div className="text-gray-700">{info?.phone || '연락처 정보 없음'}</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-2 text-[#222831]">이메일</div>
              <div className="text-gray-700">{info?.email || '이메일 정보 없음'}</div>
            </div>
          </div>
          {/* 지도 */}
          <div className="rounded-2xl overflow-hidden shadow-lg min-h-[320px] bg-gray-100 flex items-center justify-center">
            {/* 네이버 지도 embed (주소 기준) */}
            <iframe
              src={mapUrl}
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="네이버 지도"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  )
} 