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

export default function PostCard({
  post,
  currentUserId,
}: {
  post: Post
  currentUserId: string | null
}) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {post.title}
        </h2>
        {currentUserId && currentUserId === post.user_id && (
          <div className="flex items-center gap-3">
            <Link
              href={`/posts/edit/${post.id}`}
              className="shrink-0 text-xs font-medium text-gray-400 transition hover:text-gray-900"
            >
              Редактировать
            </Link>
            <form action={deletePost} className="flex items-center">
              <input type="hidden" name="postId" value={post.id} />
              <button
                type="submit"
                className="shrink-0 text-xs font-medium text-gray-400 transition hover:text-red-600"
              >
                Удалить
              </button>
            </form>
          </div>
        )}
      </div>
      <p className="mt-2 leading-relaxed text-gray-600">
        {post.content}
      </p>
      <p className="mt-4 text-xs text-gray-400">
  {post.profiles?.username && (
    <span className="font-medium text-gray-500">
      {post.profiles.username}
    </span>
  )}
  {post.profiles?.username && ' · '}
  {formatDate(post.created_at)}
  {post.updated_at && (
    <span className="ml-2 text-gray-400">
      · изменено {formatDate(post.updated_at)}
    </span>
  )}
</p>
    </article>
  )
}