'use client'

import { useState } from 'react'
import { updateComment, deleteComment } from './comments-actions'
import { formatDate } from '@/app/formatDate'

export default function CommentItem({
  comment,
  postId,
  isCommentAuthor,
  canEdit,
}: {
  comment: {
    id: string
    content: string
    created_at: string
    updated_at: string | null
    profiles: { username: string | null } | null
  }
  postId: string
  isCommentAuthor: boolean
  canEdit: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)

  async function handleUpdate(formData: FormData) {
    await updateComment(formData)
    setIsEditing(false)
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-600">
            {comment.profiles?.username || 'Пользователь'}
          </span>
          {' · '}
          {formatDate(comment.created_at)}
          {comment.updated_at && (
            <span className="ml-1">
              · изменено {formatDate(comment.updated_at)}
            </span>
          )}
        </p>

        {isCommentAuthor && !isEditing && (
          <div className="flex items-baseline gap-3">
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-gray-400 hover:text-gray-900"
              >
                Редактировать
              </button>
            )}
            <form action={deleteComment}>
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="postId" value={postId} />
              <button
                type="submit"
                className="text-xs font-medium text-gray-400 hover:text-red-600"
              >
                Удалить
              </button>
            </form>
          </div>
        )}
      </div>

      {isEditing ? (
        <form action={handleUpdate} className="mt-3 space-y-2">
          <input type="hidden" name="commentId" value={comment.id} />
          <input type="hidden" name="postId" value={postId} />
          <textarea
            name="content"
            required
            rows={3}
            defaultValue={comment.content}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100"
            >
              Отменить
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}
    </div>
  )
}