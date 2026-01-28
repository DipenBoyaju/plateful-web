import { z } from 'zod'

export const recipeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  prepTime: z.number().min(1).max(1440),
  cookTime: z.number().min(1).max(1440),
  servings: z.number().min(1).max(100),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  ingredients: z.array(
    z.object({
      item: z.string().min(1, 'Ingredient name is required'),
      quantity: z.string().min(1, 'Quantity is required'),
    })
  ).min(1, 'At least one ingredient is required'),
  instructions: z.array(
    z.string().min(1, 'Instruction cannot be empty')
  ).min(1, 'At least one instruction is required'),
})

export type RecipeFormData = z.infer<typeof recipeSchema>