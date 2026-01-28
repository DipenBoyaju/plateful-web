import { getRecipes } from "@/actions/recipe-actions"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { Badge, Search } from "lucide-react"
import Link from "next/link"


// const dummyRecipes = [
//   {
//     id: '1',
//     title: 'Classic Spaghetti Carbonara',
//     description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
//     imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
//     author: { name: 'Mario Rossi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mario' },
//     cookTime: 30,
//     difficulty: 'Medium' as const,
//     likes: 234,
//   },
//   {
//     id: '2',
//     title: 'Homemade Margherita Pizza',
//     description: 'Simple and delicious pizza with fresh mozzarella and basil',
//     imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
//     author: { name: 'Sofia Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
//     cookTime: 45,
//     difficulty: 'Easy' as const,
//     likes: 567,
//   },
//   {
//     id: '3',
//     title: 'Thai Green Curry',
//     description: 'Aromatic and spicy curry with coconut milk and fresh vegetables',
//     imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
//     author: { name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
//     cookTime: 40,
//     difficulty: 'Hard' as const,
//     likes: 432,
//   },
//   {
//     id: '4',
//     title: 'Chocolate Lava Cake',
//     description: 'Decadent chocolate dessert with a molten center',
//     imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
//     author: { name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
//     cookTime: 25,
//     difficulty: 'Medium' as const,
//     likes: 891,
//   },
//   {
//     id: '5',
//     title: 'Greek Salad',
//     description: 'Fresh and healthy salad with feta cheese and olives',
//     imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
//     author: { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
//     cookTime: 15,
//     difficulty: 'Easy' as const,
//     likes: 345,
//   },
//   {
//     id: '6',
//     title: 'Beef Wellington',
//     description: 'Elegant dish with beef tenderloin wrapped in puff pastry',
//     imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800',
//     author: { name: 'Oliver Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver' },
//     cookTime: 120,
//     difficulty: 'Hard' as const,
//     likes: 1203,
//   },
// ]

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Blur */}
      <div className="space-y-12 py-12 px-4 max-w-7xl mx-auto">
        <header className="py-16 md:py-24 space-y-10 max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <Badge className="px-4 py-1.5 border-orange-200 text-orange-700 bg-orange-50/80 animate-in fade-in slide-in-from-bottom-3 duration-1000">
              ✨ Join 20,000+ home chefs
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Master the art of <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500 italic">
                home cooking.
              </span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Browse thousands of community-tested recipes with step-by-step guides and nutritional insights.
            </p>
          </div>

          {/* Modern Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
              <div className="pl-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search recipes, ingredients, or cuisines..."
                className="w-full px-4 py-3 outline-none text-slate-700 bg-transparent"
              />
              <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Search
              </button>
            </div>

            {/* Trending Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Pasta', 'Healthy', 'Quick', 'Vegan', 'Dessert'].map((tag) => (
                <button key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-700 transition-colors">
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">Popular Recipes</h2>
            <Link href="/recipes" className="text-sm font-medium text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline">
              View all recipes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}