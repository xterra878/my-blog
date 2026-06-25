import { deletePost } from './posts/delete/actions'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logout } from './logout/actions'

export default async function Home() {
  const supabase = await createClient()

  const { data: posts } = await supabase
  .from('posts')
  .select('*, profiles(username)')
  .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()
  let username: string | null = null
if (user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle()
  username = profile?.username ?? null
}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Мой блог
          </h1>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
  href="/profile"
  className="hidden text-sm text-gray-500 hover:text-gray-900 sm:inline"
>
  {username ?? user.email}
</Link>
              <Link
                href="/posts/new"
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Новый пост
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
                >
                  Выйти
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Войти
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article
  key={post.id}
  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
>
  <div className="flex items-start justify-between gap-4">
    <h2 className="text-xl font-semibold text-gray-900">
      {post.title}
    </h2>
    {user && user.id === post.user_id && (
      <form action={deletePost}>
        <input type="hidden" name="postId" value={post.id} />
        <button
          type="submit"
          className="shrink-0 text-xs font-medium text-gray-400 transition hover:text-red-600"
        >
          Удалить
        </button>
      </form>
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
    {new Date(post.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}
  </p>
</article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
              <p className="text-gray-400">Постов пока нет. Будь первым!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}