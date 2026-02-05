import { getRecipes } from "@/actions/recipe-actions"
import { getTrendingRecipes } from "@/actions/search-actions"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ChefHat, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  // Get trending recipes (most liked)
  const trendingRecipes = await getTrendingRecipes(6)

  // Get latest recipes
  const latestRecipes = await getRecipes()
  const recentRecipes = latestRecipes.slice(0, 6)

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="px-4 py-1.5 border-orange-200 text-orange-700 bg-orange-50/80">
            ✨ Join 20,000+ home chefs
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Master the art of <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500 italic">
              home cooking.
            </span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover thousands of community-tested recipes, share your culinary creations, and connect with food lovers worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/explore">
              <Button size="lg" className="px-8 rounded-xl">
                <ChefHat className="mr-2 h-5 w-5" />
                Explore Recipes
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="px-8 rounded-xl">
                <Sparkles className="mr-2 h-5 w-5" />
                Search & Discover
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-12 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {latestRecipes.length}+ Recipes
              </h3>
              <p className="text-slate-600">
                From quick meals to gourmet dishes
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                20,000+ Chefs
              </h3>
              <p className="text-slate-600">
                Join our passionate cooking community
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                100% Free
              </h3>
              <p className="text-slate-600">
                Share and discover recipes at no cost
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Recipes Section */}
      {trendingRecipes.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                Trending This Week
              </h2>
            </div>
            <Link href="/explore?sort=popular">
              <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                View All →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Recipes Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-orange-600" />
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">
              Latest Recipes
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
              View All →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Ready to share your recipes?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join our community of passionate home chefs and inspire others with your culinary creations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="px-8 rounded-xl">
                Get Started Free
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="px-8 rounded-xl">
                Browse Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}