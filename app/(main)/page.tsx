import { getRecipes } from "@/actions/recipe-actions"
import { getTrendingRecipes } from "@/actions/search-actions"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { TrendingUp, ChefHat, Users, Sparkles, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  // Get trending recipes (most liked)
  const trendingRecipes = await getTrendingRecipes(6)

  // Get latest recipes
  const latestRecipes = await getRecipes()
  const recentRecipes = latestRecipes.slice(0, 6)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-200px bg-radial-gradient(circle_at_top,_var(--tw-gradient-stops)) from-orange-100/40 via-transparent to-transparent -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-20 md:pb-24 px-4 max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-100 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">Join 20,000+ home chefs</p>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Master the art of <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-orange-600 italic">home cooking.</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Discover thousands of community-tested recipes, share your culinary creations, and connect with food lovers worldwide.
          </p>

          <div className="flex flex-wrap justify-center gap-5 pt-4">
            <Link href="/explore">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-orange-600 text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-slate-200">
                <ChefHat className="mr-3 h-6 w-6" />
                Explore Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Modern "Floating" Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: ChefHat, label: "Recipes", val: `${latestRecipes.length}+`, desc: "From quick snacks to gourmet feats", color: "bg-orange-500" },
              { icon: Users, label: "Community", val: "20k+", desc: "Passionate chefs sharing secrets", color: "bg-blue-500" },
              { icon: Sparkles, label: "Pricing", val: "Free", desc: "No subscriptions, just great food", color: "bg-amber-500" }
            ].map((stat, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.val}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING SECTION - Editorial Style */}
      {trendingRecipes.length > 0 && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-xs">
                <TrendingUp className="h-4 w-4" />
                Popular this week
              </div>
              <h2 className="text-5xl font-black tracking-tight text-slate-900">
                Trending Recipes
              </h2>
            </div>
            <Link href="/explore?sort=popular">
              <Button variant="ghost" className="text-lg font-bold group text-slate-600 hover:text-orange-600">
                See everything
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trendingRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>
      )}

      {/* RECENT SECTION */}
      <section className="py-24 px-4 max-w-7xl mx-auto bg-slate-50/50 rounded-[3rem] border border-slate-100">
        <div className="flex items-center justify-between mb-12 px-6">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Fresh from the Kitchen</h2>
          <Link href="/explore">
            <Button variant="outline" className="rounded-xl border-slate-200 font-bold">Newest Arrivals</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recentRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </section>

      {/* CTA SECTION - Premium Card */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto relative rounded-[3rem] overflow-hidden bg-slate-900 p-12 md:p-24">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-radial-gradient(circle_at_top_right,_var(--tw-gradient-stops)) from-orange-500/20 via-transparent to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Share your <span className="text-orange-500">cooking</span> magic.
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Join thousands of creators. Post your first recipe today and inspire the world.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg shadow-xl shadow-orange-900/20">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}