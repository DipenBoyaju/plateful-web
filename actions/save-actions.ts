'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleSave(recipeId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to save recipes' }
  }

  try {
    // Check if already saved
    const { data: existingSave } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('recipe_id', recipeId)
      .eq('user_id', user.id)
      .single()

    if (existingSave) {
      // Unsave
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)

      if (error) throw error

      revalidatePath(`/recipe/${recipeId}`)
      revalidatePath('/saved')
      return { success: true, saved: false }
    } else {
      // Save
      const { error } = await supabase
        .from('saved_recipes')
        .insert({ recipe_id: recipeId, user_id: user.id })

      if (error) throw error

      revalidatePath(`/recipe/${recipeId}`)
      revalidatePath('/saved')
      return { success: true, saved: true }
    }
  } catch (error) {
    console.error('Error toggling save:', error)
    return { error: 'Failed to toggle save' }
  }
}

export async function isSavedByUser(recipeId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('saved_recipes')
    .select('*')
    .eq('recipe_id', recipeId)
    .eq('user_id', user.id)
    .single()

  return !!data
}

export async function getSavedRecipes() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('saved_recipes')
    .select(`
      recipe_id,
      recipes:recipe_id (
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        ),
        likes(count)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved recipes:', error)
    return []
  }

  return data.map(item => item.recipes)
}