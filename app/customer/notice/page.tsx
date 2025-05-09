export default function NoticePage() {
  const notices = [
    { id: 1, title: '새로운 소식을 알려드립니다.', date: '2024-10-24', isNew: true },
    { id: 2, title: 'pro#03 펜션테마 새롭게 출시!', date: '2018-08-28', isNew: false },
    { id: 3, title: '공지사항 글쓰기공지사항 글쓰기공지사항', date: '2018-09-04', isNew: false },
  ];

  return (
    <main className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">공지사항</h1>
        <p className="text-center text-gray-500 mb-10">새로운 소식을 알려드립니다.</p>
        <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl shadow p-8">
          <ul>
            {notices.map(notice => (
              <li key={notice.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <span className="truncate font-medium">{notice.title}</span>
                <div className="flex items-center gap-4">
                  {notice.isNew && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">NEW</span>
                  )}
                  <span className="text-sm text-gray-500">{notice.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
} 