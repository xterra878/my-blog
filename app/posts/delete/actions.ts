'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deletePost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const postId = formData.get('postId') as string

  await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)

  revalidatePath('/')
}