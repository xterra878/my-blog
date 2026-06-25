'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await supabase.from('posts').insert({
    title,
    content,
    user_id: user.id,
  })

  revalidatePath('/')
  redirect('/')
}