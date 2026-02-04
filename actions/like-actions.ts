'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(recipeId: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to like recipes' }
  }

  try {
    const { data: existingLike } = await supabase.from('likes').select('*').eq('recipe_id', recipeId).eq('user_id', user.id).single();

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)

      if (error) throw error

      revalidatePath(`/recipe/${recipeId}`)
      revalidatePath('/')
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ recipe_id: recipeId, user_id: user.id })

      if (error) throw error

      revalidatePath(`/recipe/${recipeId}`)
      revalidatePath('/')
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { error: "Failed to toggle like" }
  }
}

export async function getLikesCount(recipeId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('recipe_id', recipeId)

  if (error) {
    return 0;
  }

  return count || 0;
}

export async function isLikedByUser(recipeId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase.from('likes').select('*').eq('recipe_id', recipeId).eq('user_id', user.id).single();

  return !!data;
}