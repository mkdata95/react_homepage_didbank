export default function DownloadsPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 rounded-xl py-16 flex flex-col justify-center" style={{ background: '#393E46' }}>
          <h1 className="text-4xl font-bold mb-4 pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>자료다운로드</h1>
          <p className="text-xl pl-4 md:pl-16" style={{ color: '#DFD0B8' }}>페델타의 제품 및 서비스 관련 자료를 다운로드하실 수 있습니다</p>
        </div>
      </section>

      {/* Downloads Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center space-x-4 mb-12">
              <button className="px-6 py-2 bg-[#222831] text-[#DFD0B8] rounded-full hover:bg-[#948979] hover:text-[#222831]">전체</button>
              <button className="px-6 py-2 bg-[#DFD0B8] text-[#393E46] rounded-full hover:bg-[#948979] hover:text-[#222831]">제품 카탈로그</button>
              <button className="px-6 py-2 bg-[#DFD0B8] text-[#393E46] rounded-full hover:bg-[#948979] hover:text-[#222831]">기술 문서</button>
              <button className="px-6 py-2 bg-[#DFD0B8] text-[#393E46] rounded-full hover:bg-[#948979] hover:text-[#222831]">사용자 매뉴얼</button>
            </div>

            <div className="space-y-6">
              {/* Download Item 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#222831] font-medium">제품 카탈로그</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">2024년 제품 카탈로그</h3>
                    <p className="text-gray-600">
                      페델타의 모든 제품과 서비스를 한눈에 볼 수 있는 종합 카탈로그입니다.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>다운로드</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Download Item 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#222831] font-medium">기술 문서</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">클라우드 플랫폼 기술 백서</h3>
                    <p className="text-gray-600">
                      페델타 클라우드 플랫폼의 기술적 특징과 아키텍처를 상세히 설명한 백서입니다.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>다운로드</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Download Item 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#222831] font-medium">사용자 매뉴얼</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">엔터프라이즈 솔루션 사용자 가이드</h3>
                    <p className="text-gray-600">
                      엔터프라이즈 솔루션의 설치부터 운영까지 상세히 설명된 사용자 매뉴얼입니다.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>다운로드</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Download Item 4 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#222831] font-medium">기술 문서</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">보안 솔루션 기술 가이드</h3>
                    <p className="text-gray-600">
                      페델타 보안 솔루션의 기술적 특징과 보안 아키텍처를 설명한 가이드입니다.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>다운로드</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Download Item 5 */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#222831] font-medium">사용자 매뉴얼</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">IoT 플랫폼 운영 가이드</h3>
                    <p className="text-gray-600">
                      IoT 플랫폼의 설치, 설정, 운영에 대한 상세한 가이드입니다.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>다운로드</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">추가 자료가 필요하신가요?</h2>
            <p className="text-gray-600 mb-8">
              필요한 자료가 없으시다면 언제든지 문의해 주세요. 빠른 시일 내에 답변 드리겠습니다.
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
    </main>
  )
} 