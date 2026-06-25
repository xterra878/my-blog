import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateUsername } from './actions'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900">
          Мой профиль
        </h1>

        <form
          action={updateUsername}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1.5 text-sm text-gray-500">{user.email}</p>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Никнейм
            </label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={profile?.username ?? ''}
              required
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  )
}