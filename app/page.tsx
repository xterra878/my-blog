import { deletePost } from './posts/delete/actions'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logout } from './logout/actions'
import SearchPosts from './SearchPosts'

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
  {posts && posts.length > 0 ? (
    <SearchPosts
      posts={posts}
      currentUserId={user?.id ?? null}
    />
  ) : (
    <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
      <p className="text-gray-400">Постов пока нет. Будь первым!</p>
    </div>
  )}
</main>
    </div>
  )
}