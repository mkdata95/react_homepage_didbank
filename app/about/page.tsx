import { siteContent } from '../data/siteContent'
import Image from 'next/image'

const timeline = siteContent.about.timeline || [
  { year: '2003', event: '회사 설립\nDPC 법인설립' },
  { year: '2004', event: 'fedelta설립,\n광고대행사 이전' },
  { year: '2008', event: '상업전환\n법인화' },
  { year: '2014', event: '특허등록\n국내최초 홀로그램스크린' },
  { year: '2016', event: '해외진출\n홍콩 오션파크 설치\n홀로그램스크린 수출' },
  { year: '2018', event: '전시/설치 등\n국내 대기업 홀로그램스크린 설치' },
]

const logo = '/logo.png'

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center" style={{ backgroundColor: '#181617', backgroundImage: 'url(/images/hero-default.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '48px' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center w-full pt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">회사소개</h1>
          <p className="text-lg text-gray-200">고객을 가장 먼저 생각하는 기업, 고객이 먼저 자랑하는 기업이 되겠습니다.</p>
        </div>
      </div>
      {/* 인사말/소개 */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center gap-16">
          {/* 좌측 이미지+텍스트 */}
          <div className="md:w-1/2 w-full flex flex-col items-center md:items-start">
            <Image
              src={logo}
              alt="회사 로고"
              width={320}
              height={200}
              className="w-80 h-48 object-contain mb-8 rounded-xl shadow"
            />
            <div className="text-2xl font-bold mb-4 text-[#B85C38]">DAONTHEME GREETINGS</div>
            <div className="text-lg font-bold mb-6 text-gray-800">함께 성장하고 서로 신뢰하는<br />행복한 기업문화를 꿈꾸는 기업!</div>
          </div>
          {/* 우측 인사말/설명 */}
          <div className="md:w-1/2 w-full flex flex-col items-center md:items-start">
            <div className="text-2xl font-bold mb-6 text-[#222831]">안녕하십니까?<br />다온테마 홈페이지를 방문해주셔서 진심으로 감사드립니다.</div>
            <div className="text-base leading-relaxed text-gray-700 mb-4">
              행복테크는 국내 저작권 특허등록을 보유한 광시야각 직물 특수스크린 솔루션으로, 스마트융합 미디어환경에 최적화된 제품 공급과 함께 20여년의 노하우로 홀로그램 콘텐츠/설치 구축에 특화된 회사입니다.<br />
              오랜 노하우와 전문 인력을 통해 최상의 품질과 성능을 자랑하며 국내외 다양한 대형 전시/설치와 함께 업계 1위의 자리를 지켜왔습니다.<br />
              본사는 다양한 고객과의 긴밀한 기획으로 맞춤형 AI시스템을 개발/제작하여 대외 이미지 업그레이드 및 남다른 가치를 만들어 왔습니다.<br />
              다양한 연혁과 경험을 통해 명실상부한 업계 선두기업이자 미래비전을 이끄는 행복테크가 될 것을 약속드립니다.<br />
              감사합니다.
            </div>
          </div>
        </div>
      </section>
      {/* 걸어온 길(타임라인) - 하단 가로형 */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-[#B85C38] text-center">걸어온 길</h2>
          <div className="flex flex-row items-start justify-center gap-8 overflow-x-auto pb-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[160px]">
                <div className="w-14 h-14 rounded-full bg-[#222831] text-[#DFD0B8] flex items-center justify-center text-lg font-bold mb-2">{item.year}</div>
                <div className="text-gray-700 text-center whitespace-pre-line text-sm">{item.event}</div>
                {idx < timeline.length - 1 && (
                  <div className="w-16 h-1 bg-[#948979] my-4 mx-auto rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 