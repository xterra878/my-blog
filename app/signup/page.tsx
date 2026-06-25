import Link from 'next/link'
import { signup } from './actions'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900">
          Мой блог
        </h1>

        <form
          action={signup}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
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
              required
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Создать аккаунт
          </button>

          <p className="text-center text-sm text-gray-500">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}