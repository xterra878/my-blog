import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updatePost } from './actions'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!post) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
          Редактировать пост
        </h1>

        <form
          action={updatePost}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >
          <input type="hidden" name="postId" value={post.id} />

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Заголовок
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Текст поста
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              required
              defaultValue={post.content}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  )
}