'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const postId = formData.get('postId') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const { data: existingPost } = await supabase
    .from('posts')
    .select('title, content')
    .eq('id', postId)
    .maybeSingle()

  const hasChanges =
    existingPost &&
    (existingPost.title !== title || existingPost.content !== content)

  await supabase
    .from('posts')
    .update(
      hasChanges
        ? { title, content, updated_at: new Date().toISOString() }
        : { title, content }
    )
    .eq('id', postId)
    .eq('user_id', user.id)

  revalidatePath('/')
  redirect(`/posts/${postId}`)
}