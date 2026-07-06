import Link from 'next/link'
import { deletePost } from './posts/delete/actions'
import { formatDate } from './formatDate'

type Post = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string | null
  user_id: string
  profiles: { username: string | null } | null
}

const PREVIEW_LENGTH = 600

export default function PostCard({
  post,
  currentUserId,
}: {
  post: Post
  currentUserId: string | null
}) {
  const isLong = post.content.length > PREVIEW_LENGTH
  const preview = isLong
    ? post.content.slice(0, PREVIEW_LENGTH) + '...'
    : post.content

  return (
    <article className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="block p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {post.title}
          </h2>
        </div>
        <p className="mt-2 leading-relaxed text-gray-600">
          {preview}
        </p>
        {isLong && (
          <p className="mt-2 text-sm font-medium text-gray-400 hover:text-gray-600">
            Читать далее →
          </p>
        )}
        <p className="mt-4 text-xs text-gray-400">
          {post.profiles?.username && (
            <span className="font-medium text-gray-500">
              {post.profiles.username}
            </span>
          )}
          {post.profiles?.username && ' · '}
          {formatDate(post.created_at)}
          {post.updated_at && (
            <span className="ml-2">
              · изменено {formatDate(post.updated_at)}
            </span>
          )}
        </p>
      </Link>

      {currentUserId && currentUserId === post.user_id && (
        <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-3">
          <Link
            href={`/posts/edit/${post.id}`}
            className="text-xs font-medium text-gray-400 transition hover:text-gray-900"
          >
            Редактировать
          </Link>
          <form action={deletePost} className="flex items-center">
            <input type="hidden" name="postId" value={post.id} />
            <button
              type="submit"
              className="text-xs font-medium text-gray-400 transition hover:text-red-600"
            >
              Удалить
            </button>
          </form>
        </div>
      )}
    </article>
  )
}