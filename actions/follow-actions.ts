'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFollow(followingId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to follow users' }
  }

  // Prevent self-follow
  if (user.id === followingId) {
    return { error: 'You cannot follow yourself' }
  }

  try {
    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', followingId)
      .single()

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId)

      if (error) throw error

      revalidatePath(`/profile/${followingId}`)
      revalidatePath('/')
      return { success: true, following: false }
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: followingId })

      if (error) throw error

      revalidatePath(`/profile/${followingId}`)
      revalidatePath('/')
      return { success: true, following: true }
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    return { error: 'Failed to toggle follow' }
  }
}

export async function isFollowing(followingId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', user.id)
    .eq('following_id', followingId)
    .single()

  return !!data
}

export async function getFollowersCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)

  if (error) {
    console.error('Error getting followers count:', error)
    return 0
  }

  return count || 0
}

export async function getFollowingCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)

  if (error) {
    console.error('Error getting following count:', error)
    return 0
  }

  return count || 0
}

export async function getFollowers(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower_id,
      profiles:follower_id (
        id,
        username,
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('following_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting followers:', error)
    return []
  }

  return data.map(item => item.profiles)
}

export async function getFollowing(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('follows')
    .select(`
      following_id,
      profiles:following_id (
        id,
        username,
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting following:', error)
    return []
  }

  return data.map(item => item.profiles)
}