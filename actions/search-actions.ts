'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchRecipes(query: string, filters?: {
  difficulty?: string
  minCookTime?: number
  maxCookTime?: number
}) {
  const supabase = await createClient()

  let queryBuilder = supabase
    .from('recipes')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)

  // Search by title or description
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Filter by difficulty
  if (filters?.difficulty && filters.difficulty !== 'all') {
    queryBuilder = queryBuilder.eq('difficulty', filters.difficulty)
  }

  // Filter by cook time range
  if (filters?.minCookTime) {
    queryBuilder = queryBuilder.gte('cook_time', filters.minCookTime)
  }
  if (filters?.maxCookTime) {
    queryBuilder = queryBuilder.lte('cook_time', filters.maxCookTime)
  }

  queryBuilder = queryBuilder.order('created_at', { ascending: false })

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Error searching recipes:', error)
    return []
  }

  // Get like counts for each recipe
  const recipesWithLikes = await Promise.all(
    (data || []).map(async (recipe) => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipe.id)

      return {
        ...recipe,
        likes_count: count || 0
      }
    })
  )

  return recipesWithLikes
}

export async function searchRecipesByIngredient(ingredient: string) {
  const supabase = await createClient()

  // Search in ingredients table
  const { data: ingredientMatches, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('recipe_id')
    .ilike('item', `%${ingredient}%`)

  if (ingredientsError || !ingredientMatches) {
    console.error('Error searching ingredients:', ingredientsError)
    return []
  }

  const recipeIds = [...new Set(ingredientMatches.map(i => i.recipe_id))]

  if (recipeIds.length === 0) return []

  // Get recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)
    .in('id', recipeIds)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }

  // Get like counts
  const recipesWithLikes = await Promise.all(
    (recipes || []).map(async (recipe) => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipe.id)

      return {
        ...recipe,
        likes_count: count || 0
      }
    })
  )

  return recipesWithLikes
}

export async function searchUsers(query: string) {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error('Error searching users:', error)
    return []
  }

  // Get recipe count and follower count for each user
  const usersWithStats = await Promise.all(
    (users || []).map(async (user) => {
      const { count: recipeCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id)

      return {
        ...user,
        recipe_count: recipeCount || 0,
        follower_count: followerCount || 0
      }
    })
  )

  return usersWithStats
}

export async function getTrendingRecipes(limit: number = 12) {
  const supabase = await createClient()

  // Get all recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50) // Get recent recipes

  if (error || !recipes) {
    console.error('Error fetching trending recipes:', error)
    return []
  }

  // Get like counts and sort by popularity
  const recipesWithLikes = await Promise.all(
    recipes.map(async (recipe) => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipe.id)

      return {
        ...recipe,
        likes_count: count || 0
      }
    })
  )

  // Sort by likes and return top recipes
  return recipesWithLikes
    .sort((a, b) => b.likes_count - a.likes_count)
    .slice(0, limit)
}

export async function getPopularUsers(limit: number = 10) {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(50)

  if (error || !users) {
    console.error('Error fetching users:', error)
    return []
  }

  // Get follower counts
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id)

      const { count: recipeCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      return {
        ...user,
        follower_count: followerCount || 0,
        recipe_count: recipeCount || 0
      }
    })
  )

  // Sort by followers and return top users
  return usersWithStats
    .sort((a, b) => b.follower_count - a.follower_count)
    .slice(0, limit)
}