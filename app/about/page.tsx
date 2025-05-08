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

const logo = siteContent.about.logo || '/logo.png'

export default function AboutPage() {
  return (
    <main className="pt-20">
      <section className="py-20" style={{ background: '#393E46', color: '#DFD0B8' }}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row max-w-6xl">
          {/* 좌측 타임라인 */}
          <div className="md:w-1/3 w-full md:pr-12 mb-12 md:mb-0">
            <h2 className="text-2xl font-bold mb-8" style={{ color: '#DFD0B8' }}>걸어온 길</h2>
            <div className="relative">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex items-start mb-10">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full" style={{ background: '#222831', color: '#DFD0B8' }}>{item.year}</div>
                    {idx < timeline.length - 1 && (
                      <div className="w-1 h-12" style={{ background: '#948979' }}></div>
                    )}
                  </div>
                  <div className="whitespace-pre-line text-base leading-relaxed" style={{ color: '#DFD0B8' }}>{item.event}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 우측 인사말/로고/설명 */}
          <div className="md:w-2/3 w-full flex flex-col items-center justify-center">
            <Image
              src={logo}
              alt="회사 로고"
              width={200}
              height={200}
              className="w-48 h-48 object-contain"
            />
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#DFD0B8' }}>인사말 / 걸어온 길</h1>
            <p className="mb-6 text-center text-lg" style={{ color: '#DFD0B8' }}>행복한 인사말을 방문해주셔서 보다 자세한 정보를 제공해 드립니다.</p>
            <div className="text-center text-2xl font-bold mb-4" style={{ color: '#DFD0B8' }}>국내 최초 홀로그램 스크린 상용화!</div>
            <div className="text-center text-base mb-4" style={{ color: '#DFD0B8' }}>제품 브랜드: 홀로스크린(Holosal)</div>
            <div className="text-base leading-relaxed mb-2" style={{ color: '#DFD0B8' }}>
              행복테크는 국내 저작권 특허등록을 보유한 광시야각 직물 특수스크린 솔루션으로, 스마트융합 미디어환경에 최적화된 제품 공급과 함께 20여년의 노하우로 홀로그램 콘텐츠/설치 구축에 특화된 회사입니다.<br />
              오랜 노하우와 전문 인력을 통해 최상의 품질과 성능을 자랑하며 국내외 다양한 대형 전시/설치와 함께 업계 1위의 자리를 지켜왔습니다.<br />
              본사는 다양한 고객과의 긴밀한 기획으로 맞춤형 AI시스템을 개발/제작하여 대외 이미지 업그레이드 및 남다른 가치를 만들어 왔습니다.<br />
              다양한 연혁과 경험을 통해 명실상부한 업계 선두기업이자 미래비전을 이끄는 행복테크가 될 것을 약속드립니다.<br />
              감사합니다.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 