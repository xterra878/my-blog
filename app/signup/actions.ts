'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!username || username.trim().length === 0) {
    redirect('/signup?error=' + encodeURIComponent('Введите никнейм'))
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    redirect('/signup?error=' + encodeURIComponent('Этот никнейм уже занят, выберите другой'))
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  if (signUpData.user) {
    await supabase
      .from('profiles')
      .update({ username })
      .eq('id', signUpData.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}