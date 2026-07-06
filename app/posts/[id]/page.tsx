import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deletePost } from '@/app/posts/delete/actions'
import { formatDate } from '@/app/formatDate'

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

      </div>
    </div>
  )
}