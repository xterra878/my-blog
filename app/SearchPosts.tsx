'use client'

import { useState } from 'react'
import PostCard from './PostCard'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string | null
  user_id: string
  profiles: { username: string | null } | null
}

export default function SearchPosts({
  posts,
  currentUserId,
}: {
  posts: Post[]
  currentUserId: string | null
}) {
  const [query, setQuery] = useState('')

  const filtered = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Поиск по постам..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
      />

      {filtered.length > 0 ? (
        filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-400">Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}