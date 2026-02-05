import { getUser } from "@/actions/auth-actions";
import { getSavedRecipes } from "@/actions/save-actions";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { redirect } from "next/navigation";


export default async function SavedRecipesPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login')
  }

  const savedRecipes = await getSavedRecipes()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Saved Recipes</h1>
        <p className="text-gray-600">
          {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No saved recipes yet</p>
          <p className="text-gray-400">
            Start saving recipes you love to find them here later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedRecipes.map((recipe: any) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </div>
  )
}