'use client'

import { useState } from 'react'

export default function CharCounter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <textarea
        id="content"
        name="content"
        rows={6}
        required
        onChange={(e) => setCount(e.target.value.length)}
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
      />
      <p className="mt-1 text-right text-xs text-gray-400">
        {count} символов
      </p>
    </div>
  )
}