import { siteContent } from './data/siteContent'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-7xl font-bold mb-8 leading-tight">
              {siteContent.hero.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
              <span className="text-blue-300">{siteContent.hero.titleHighlight}</span>
            </h1>
            <p className="text-2xl mb-12 text-gray-100">
              {siteContent.hero.description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </p>
            <div className="flex gap-6 justify-center">
              <Link
                href="/portfolio"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                {siteContent.hero.primaryButton.replace('서비스 살펴보기', '주요실적')}
              </Link>
              <a
                href="/contact"
                className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
              >
                {siteContent.hero.secondaryButton}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-20 text-gray-900">{siteContent.about.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h3 className="text-3xl font-semibold text-blue-600">{siteContent.about.vision.title}</h3>
                {siteContent.about.vision.content.map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="space-y-8">
                <h3 className="text-3xl font-semibold text-blue-600">{siteContent.about.values.title}</h3>
                <ul className="space-y-6">
                  {siteContent.about.values.items.map((item, i) => (
                    <li key={i} className="flex items-start group">
                      <span className="text-blue-600 mr-4 text-xl group-hover:scale-110 transition-transform">•</span>
                      <span className="text-gray-600 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-20 text-gray-900">{siteContent.services.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {siteContent.services.items.map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 주요 실적 미리보기 (4개 + 더보기) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{siteContent.projects.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {siteContent.projects.items.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.period}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{project.overview}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/portfolio" className="inline-block bg-[#222831] text-[#DFD0B8] px-8 py-3 rounded-lg font-semibold hover:bg-[#948979] hover:text-[#222831] transition-colors shadow-md">더보기</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/*
      <section id="contact" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-20 text-gray-900">{siteContent.contact.title}</h2>
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                      {siteContent.contact.form.name.label}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={siteContent.contact.form.name.placeholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                      {siteContent.contact.form.email.label}
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder={siteContent.contact.form.email.placeholder}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-3">
                    {siteContent.contact.form.message.label}
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder={siteContent.contact.form.message.placeholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg shadow-lg"
                >
                  {siteContent.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      */}
    </main>
  )
} 