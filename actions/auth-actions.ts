'use server'

import { createClient } from '@/lib/supabase/server'
import { SignInState, SignUpState } from '@/types/auth';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const username = formData.get('username') as string;

  if (!email || !password || !fullName || !username) {
    return { error: 'All fields are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }
  const supabase = await createClient()

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    return { error: 'Username already taken' }
  }

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }
  if (!data.user) {
    return { error: 'Failed to create user' }
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .single()

  // Create profile
  if (!existingProfile) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username,
      full_name: fullName,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  revalidatePath('/', 'layout')
  return { success: "Account created! Redirecting to login..." }
}

export async function signIn(prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: "Email and password are required" }
  }
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...user, profile }
}