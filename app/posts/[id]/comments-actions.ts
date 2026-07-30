'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createComment(formData: FormData) {
  const supabase = await createClient()

  const postId = formData.get('postId') as string
  const content = formData.get('content') as string

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  if (!content || content.trim().length === 0) {
    return
  }

  await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content,
  })

  revalidatePath(`/posts/${postId}`)
}

export async function updateComment(formData: FormData) {
  const supabase = await createClient()

  const commentId = formData.get('commentId') as string
  const postId = formData.get('postId') as string
  const content = formData.get('content') as string

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { data: comment } = await supabase
    .from('comments')
    .select('*')
    .eq('id', commentId)
    .maybeSingle()

  if (!comment || comment.user_id !== user.id) {
    return
  }

  const createdAt = new Date(comment.created_at).getTime()
  const now = Date.now()
  const hoursPassed = (now - createdAt) / (1000 * 60 * 60)

  if (hoursPassed > 48) {
    return
  }

  if (!content || content.trim().length === 0) {
    return
  }

  await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)

  revalidatePath(`/posts/${postId}`)
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient()

  const commentId = formData.get('commentId') as string
  const postId = formData.get('postId') as string

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  revalidatePath(`/posts/${postId}`)
}