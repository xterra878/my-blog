import { createPost } from './actions'
import CharCounter from './CharCounter'
export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
          Новый пост
        </h1>

        <form
          action={createPost}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >
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
  <CharCounter />
</div>

          <button
            type="submit"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Опубликовать
          </button>
        </form>
      </div>
    </div>
  )
}