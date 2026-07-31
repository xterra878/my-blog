import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deletePost } from '@/app/posts/delete/actions'
import { formatDate } from '@/app/formatDate'
import { createComment } from './comments-actions'
import CommentItem from './CommentItem'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(username)')
    .eq('id', id)
    .maybeSingle()

  if (!post) {
    redirect('/')
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isAuthor = user?.id === post.user_id

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username)')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Назад
          </Link>
          {isAuthor && (
            <div className="flex items-center gap-3">
              <Link
                href={`/posts/edit/${post.id}`}
                className="text-sm font-medium text-gray-400 hover:text-gray-900"
              >
                Редактировать
              </Link>
              <form action={deletePost} className="flex items-center">
                <input type="hidden" name="postId" value={post.id} />
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-400 hover:text-red-600"
                >
                  Удалить
                </button>
              </form>
            </div>
          )}
        </div>

        <article className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            {post.title}
          </h1>

          <p className="mt-2 text-xs text-gray-400">
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

          <p className="mt-6 leading-relaxed text-gray-700 whitespace-pre-wrap">
            {post.content}
          </p>
        </article>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Комментарии {comments && comments.length > 0 && `(${comments.length})`}
          </h2>

          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment) => {
                const isCommentAuthor = user?.id === comment.user_id
                const hoursPassed =
                  (Date.now() - new Date(comment.created_at).getTime()) / (1000 * 60 * 60)
                const canEdit = isCommentAuthor && hoursPassed <= 48

                return (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    isCommentAuthor={isCommentAuthor}
                    canEdit={canEdit}
                  />
                )
              })
            ) : (
              <p className="text-sm text-gray-400">Пока нет комментариев.</p>
            )}
          </div>

          {user ? (
            <form action={createComment} className="mt-6 space-y-3">
              <input type="hidden" name="postId" value={post.id} />
              <textarea
                name="content"
                required
                rows={3}
                placeholder="Написать комментарий..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="submit"
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Отправить
              </button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              <Link href="/login" className="font-medium text-gray-900 hover:underline">
                Войдите
              </Link>
              , чтобы оставить комментарий.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}