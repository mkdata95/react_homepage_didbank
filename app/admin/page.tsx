'use client'

import { useState } from 'react'
import { siteContent } from '../data/siteContent'

export default function AdminPage() {
  const [content, setContent] = useState(siteContent)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setSaveMessage('저장되었습니다!')
      } else {
        setSaveMessage('저장에 실패했습니다.')
      }
    } catch {
      setSaveMessage('오류가 발생했습니다.')
    }

    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const updateContent = (section: string, field: string, value: unknown) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const addProject = () => {
    const newProject = {
      id: `project${content.projects.items.length + 1}`,
      title: "새 프로젝트",
      period: "",
      role: "",
      overview: "",
      details: [""],
      client: "",
      image: "",
      category: "",
      gallery: []
    }
    
    setContent(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: [...prev.projects.items, newProject]
      }
    }))
  }

  const removeProject = (projectId: string) => {
    setContent(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.filter(item => item.id !== projectId)
      }
    }))
  }

  const addDetail = (projectId: string) => {
    setContent(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.map(item => 
          item.id === projectId 
            ? { ...item, details: [...item.details, ""] }
            : item
        )
      }
    }))
  }

  const removeDetail = (projectId: string, detailIndex: number) => {
    setContent(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        items: prev.projects.items.map(item => 
          item.id === projectId 
            ? { ...item, details: item.details.filter((_, i) => i !== detailIndex) }
            : item
        )
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">웹사이트 내용 관리</h1>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
          
          {saveMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              {saveMessage}
            </div>
          )}

          {/* Hero 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Hero 섹션</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">강조 텍스트</label>
                <input
                  type="text"
                  value={content.hero.titleHighlight}
                  onChange={(e) => updateContent('hero', 'titleHighlight', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => updateContent('hero', 'description', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* About 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About 섹션</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) => updateContent('about', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비전 제목</label>
                <input
                  type="text"
                  value={content.about.vision.title}
                  onChange={(e) => updateContent('about', 'vision', { ...content.about.vision, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비전 내용</label>
                {content.about.vision.content.map((text, index) => (
                  <textarea
                    key={index}
                    value={text}
                    onChange={(e) => {
                      const newContent = [...content.about.vision.content]
                      newContent[index] = e.target.value
                      updateContent('about', 'vision', { ...content.about.vision, content: newContent })
                    }}
                    className="w-full px-4 py-2 border rounded-lg mb-2"
                    rows={2}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Services 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Services 섹션</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={content.services.title}
                  onChange={(e) => updateContent('services', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              {content.services.items.map((service, index) => (
                <div key={index} className="border-t pt-4">
                  <h3 className="font-medium mb-2">서비스 {index + 1}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서비스명</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const newItems = [...content.services.items]
                          newItems[index] = { ...service, title: e.target.value }
                          updateContent('services', 'items', newItems)
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const newItems = [...content.services.items]
                          newItems[index] = { ...service, description: e.target.value }
                          updateContent('services', 'items', newItems)
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact 섹션</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={content.contact.title}
                  onChange={(e) => updateContent('contact', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 필드</label>
                <input
                  type="text"
                  value={content.contact.form.name.label}
                  onChange={(e) => updateContent('contact', 'form', {
                    ...content.contact.form,
                    name: { ...content.contact.form.name, label: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일 필드</label>
                <input
                  type="text"
                  value={content.contact.form.email.label}
                  onChange={(e) => updateContent('contact', 'form', {
                    ...content.contact.form,
                    email: { ...content.contact.form.email, label: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메시지 필드</label>
                <input
                  type="text"
                  value={content.contact.form.message.label}
                  onChange={(e) => updateContent('contact', 'form', {
                    ...content.contact.form,
                    message: { ...content.contact.form.message, label: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Projects 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">실적 관리</h2>
              <button
                onClick={addProject}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                프로젝트 추가
              </button>
            </div>

            <div className="space-y-6">
              {content.projects.items.map((project, index) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">프로젝트 {index + 1}</h3>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트명</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const newItems = [...content.projects.items]
                          newItems[index] = { ...project, title: e.target.value }
                          setContent(prev => ({
                            ...prev,
                            projects: { ...prev.projects, items: newItems }
                          }))
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
                      <input
                        type="text"
                        value={project.period}
                        onChange={(e) => {
                          const newItems = [...content.projects.items]
                          newItems[index] = { ...project, period: e.target.value }
                          setContent(prev => ({
                            ...prev,
                            projects: { ...prev.projects, items: newItems }
                          }))
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">담당 업무</label>
                      <input
                        type="text"
                        value={project.role}
                        onChange={(e) => {
                          const newItems = [...content.projects.items]
                          newItems[index] = { ...project, role: e.target.value }
                          setContent(prev => ({
                            ...prev,
                            projects: { ...prev.projects, items: newItems }
                          }))
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 개요</label>
                      <textarea
                        value={project.overview}
                        onChange={(e) => {
                          const newItems = [...content.projects.items]
                          newItems[index] = { ...project, overview: e.target.value }
                          setContent(prev => ({
                            ...prev,
                            projects: { ...prev.projects, items: newItems }
                          }))
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">주요 작업 내용</label>
                      {project.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={detail}
                            onChange={(e) => {
                              const newItems = [...content.projects.items]
                              const newDetails = [...project.details]
                              newDetails[detailIndex] = e.target.value
                              newItems[index] = { ...project, details: newDetails }
                              setContent(prev => ({
                                ...prev,
                                projects: { ...prev.projects, items: newItems }
                              }))
                            }}
                            className="flex-1 px-4 py-2 border rounded-lg"
                          />
                          <button
                            onClick={() => removeDetail(project.id, detailIndex)}
                            className="text-red-600 hover:text-red-700 px-2"
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addDetail(project.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        + 작업 내용 추가
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">클라이언트</label>
                      <input
                        type="text"
                        value={project.client}
                        onChange={(e) => {
                          const newItems = [...content.projects.items]
                          newItems[index] = { ...project, client: e.target.value }
                          setContent(prev => ({
                            ...prev,
                            projects: { ...prev.projects, items: newItems }
                          }))
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
                      <input
                        type="text"
                        value={project.image}
                        onChange={(e) => {
                          const newItems = [...content.projects.items]
                          newItems[index] = { ...project, image: e.target.value }
                          setContent(prev => ({
                            ...prev,
                            projects: { ...prev.projects, items: newItems }
                          }))
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="/images/projects/example.jpg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 