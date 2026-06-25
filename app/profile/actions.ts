'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateUsername(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const username = formData.get('username') as string

  if (!username || username.trim().length === 0) {
    redirect('/profile?error=' + encodeURIComponent('Введите никнейм'))
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user.id)
    .maybeSingle()

  if (existing) {
    redirect('/profile?error=' + encodeURIComponent('Этот никнейм уже занят, выберите другой'))
  }

  await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
  redirect('/')
}