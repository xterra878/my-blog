'use client'

import { useState } from 'react'

const LIMIT = 5000

export default function CharCounter({
  defaultValue = '',
}: {
  defaultValue?: string
}) {
  const [count, setCount] = useState(defaultValue.length)

  const isNearLimit = count >= LIMIT * 0.8
  const isOverLimit = count >= LIMIT

  return (
    <div>
      <textarea
        id="content"
        name="content"
        rows={6}
        required
        defaultValue={defaultValue}
        maxLength={LIMIT}
        onChange={(e) => setCount(e.target.value.length)}
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
      />
      <p className={`mt-1 text-right text-xs transition ${
        isOverLimit
          ? 'font-medium text-red-600'
          : isNearLimit
          ? 'font-medium text-orange-500'
          : 'text-gray-400'
      }`}>
        {count} / {LIMIT}
      </p>
    </div>
  )
}