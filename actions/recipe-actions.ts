"use server"
import { createClient } from "@/lib/supabase/server";
import { RecipeFormData } from "@/lib/validations";
import { revalidatePath } from "next/cache";


export async function createRecipe(data: RecipeFormData, imageFile?: File) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to create a recipe' }
  }

  try {
    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('recipe-images').upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('recipe-images').getPublicUrl(fileName)

      imageUrl = publicUrl
    }

    const { data: recipe, error: recipeError } = await supabase.from('recipes').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      image_url: imageUrl,
      prep_time: data.prepTime,
      cook_time: data.cookTime,
      servings: data.servings,
      difficulty: data.difficulty,
    }).select().single()

    if (recipeError) throw recipeError

    const ingredientsData = data.ingredients.map((ingredient, index) => ({
      recipe_id: recipe.id,
      item: ingredient.item,
      quantity: ingredient.quantity,
      order_index: index
    }))

    const { error: ingredientsError } = await supabase.from('ingredients').insert(ingredientsData)

    if (ingredientsError) throw ingredientsError

    const instructionsData = data.instructions.map((instruction, index) => ({
      recipe_id: recipe.id,
      step_number: index + 1,
      description: instruction,
    }))

    const { error: instructionsError } = await supabase.from('instructions').insert(instructionsData)

    if (instructionsError) throw instructionsError

    revalidatePath('/')
    return { success: true, recipeId: recipe.id }

  } catch (error) {
    console.error('Error creating recipe:', error)
    return { error: 'Failed to create recipe' }
  }
}

export async function getRecipes() {
  const supabase = await createClient()

  const { data: recipes, error } = await supabase.from('recipes').select(`
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `).order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }

  return recipes
}

export async function getRecipeByid(id: string) {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase.from('recipes').select(`*,
    profiles:user_id (
        username,
        full_name,
        avatar_url,
        bio
      ),
      ingredients(*),
      instructions(*)
    `).eq('id', id).single()

  if (error) {
    console.error('Error fetching recipe:', error)
    return null
  }

  recipe.ingredients.sort((a: any, b: any) => a.order_index - b.order_index)
  recipe.instructions.sort((a: any, b: any) => a.step_number - b.step_number)

  return recipe
}