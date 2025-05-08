"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'

interface Project {
  id: string;
  title: string;
  period: string;
  role: string;
  overview: string;
  details: string[];
  client: string;
  image: string;
  category: string;
  gallery?: string[];
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then((data: Project[]) => {
        const found = data.find((p) => p.id === params.id)
        if (found) {
          setProject(found)
          setEditedContent(found.details.join('\n'))
        }
      })
  }, [params.id])

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">프로젝트를 찾을 수 없습니다.</div>
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('저장 중...')
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          details: editedContent.split('\n')
        }),
      })
      if (response.ok) {
        setSaveMessage('저장되었습니다!')
        setIsEditing(false)
        setProject({ ...project, details: editedContent.split('\n') })
      } else {
        setSaveMessage('저장에 실패했습니다.')
      }
    } catch {
      setSaveMessage('오류가 발생했습니다.')
    }
    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* 상단 카드: 이미지 + 정보 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* 이미지 (6) */}
            <div className="md:w-3/5 w-full h-80 md:h-auto relative">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover w-full h-full"
                style={{ minHeight: 320 }}
              />
            </div>
            {/* 정보 (4) */}
            <div className="md:w-2/5 w-full flex flex-col justify-center p-8 gap-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">기간</h2>
                <p className="text-gray-600 mb-3">{project.period}</p>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">카테고리</h2>
                <p className="text-gray-600 mb-3">{project.category}</p>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">개요</h2>
                <p className="text-gray-600 leading-relaxed">{project.overview}</p>
              </div>
            </div>
          </div>

          {/* 하단 카드: 상세 설명 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">상세 설명</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  수정하기
                </button>
              )}
            </div>
            {saveMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{saveMessage}</div>
            )}
            {isEditing ? (
              <div className="space-y-4">
                <RichTextEditor
                  value={editedContent}
                  onChange={(newContent) => setEditedContent(newContent)}
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? '저장 중...' : '저장하기'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                {project.details.map((detail, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">{detail}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 