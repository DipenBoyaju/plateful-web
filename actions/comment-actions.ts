'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(recipeId: string, content: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to comment' }
  }

  if (!content || content.trim().length === 0) {
    return { error: 'Comment cannot be empty' }
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        recipe_id: recipeId,
        user_id: user.id,
        content: content.trim()
      })
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error

    revalidatePath(`/recipe/${recipeId}`)
    return { success: true, comment: data }
  } catch (error) {
    console.error('Error adding comment:', error)
    return { error: 'Failed to add comment' }
  }
}

export async function deleteComment(commentId: string, recipeId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  try {
    // Check ownership
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment || comment.user_id !== user.id) {
      return { error: 'You can only delete your own comments' }
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error

    revalidatePath(`/recipe/${recipeId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { error: 'Failed to delete comment' }
  }
}

export async function getComments(recipeId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data
}