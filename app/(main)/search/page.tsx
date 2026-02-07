'use client'

import { useState, useEffect, useTransition } from 'react'
import { searchRecipes, searchRecipesByIngredient, searchUsers, getTrendingRecipes, getPopularUsers } from '@/actions/search-actions'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Loader2, TrendingUp, Users as UsersIcon, ChefHat, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { FollowButton } from '@/components/follow/follow-button'
import { useRouter, useSearchParams } from 'next/navigation'
import { RecipeCardProps } from '../../../types/recipe';

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [recipes, setRecipes] = useState<RecipeCardProps[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [trendingRecipes, setTrendingRecipes] = useState<string[]>([])
  const [popularUsers, setPopularUsers] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('recipes')
  const [searchType, setSearchType] = useState<'title' | 'ingredient'>('title')

  // Filters
  const [difficulty, setDifficulty] = useState('all')
  const [maxCookTime, setMaxCookTime] = useState<number | undefined>()

  useEffect(() => {
    loadTrendingAndPopular()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      handleSearch()
    }
  }, [searchQuery, searchType, difficulty, maxCookTime])

  const loadTrendingAndPopular = async () => {
    const [trending, popular] = await Promise.all([
      getTrendingRecipes(12),
      getPopularUsers(10)
    ])
    setTrendingRecipes(trending)
    setPopularUsers(popular)
  }

  const handleSearch = () => {
    startTransition(async () => {
      if (activeTab === 'recipes') {
        if (searchType === 'ingredient') {
          const results = await searchRecipesByIngredient(searchQuery)
          setRecipes(results)
        } else {
          const results = await searchRecipes(searchQuery, {
            difficulty: difficulty !== 'all' ? difficulty : undefined,
            maxCookTime: maxCookTime
          })
          setRecipes(results)
        }
      } else if (activeTab === 'users') {
        const results = await searchUsers(searchQuery)
        setUsers(results)
      }
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="relative min-h-screen pb-20">
      {/* BACKGROUND DECO */}
      <div className="absolute top-0 right-0 w-1/3 h-120px bg-linear-30-to-b from-orange-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-20">
        {/* HEADER SECTION */}
        <div className="max-w-4xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Discover what&apos;s cooking
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Find your next
            <span className="text-orange-500 italic"> favorite meal.</span>
          </h1>
        </div>

        {/* MODERN SEARCH BAR */}
        <div className="relative z-10 mb-12">
          <form onSubmit={handleSearchSubmit} className="group relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'recipes'
                  ? searchType === 'ingredient' ? 'Chicken, avocado, lime...' : 'Search by recipe title...'
                  : 'Search by chef name...'
              }
              className="w-full pl-16 pr-40 py-10 text-xl md:text-2xl font-bold bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
            />
            <div className="absolute inset-y-3 right-3 hidden md:block">
              <Button
                type="submit"
                className="h-full px-10 rounded-[1.8rem] bg-slate-900 hover:bg-orange-600 text-lg font-black transition-all"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : 'Search'}
              </Button>
            </div>
          </form>

          {/* Quick Toggle Pill for Recipe Search Type */}
          {activeTab === 'recipes' && (
            <div className="flex justify-center mt-6">
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setSearchType('title')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${searchType === 'title' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  By Title
                </button>
                <button
                  onClick={() => setSearchType('ingredient')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${searchType === 'ingredient' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  By Ingredient
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TABS & FILTERS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-2">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              {['recipes', 'users', 'trending'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-3 py-4 bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-orange-500 rounded-full text-sm font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-white transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeTab === 'recipes' && searchType === 'title' && (
              <div className="flex items-center gap-3 animate-in fade-in duration-500">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-35px rounded-xl border-slate-100 font-bold bg-slate-50">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                {difficulty !== 'all' && (
                  <Button variant="ghost" size="icon" onClick={() => setDifficulty('all')} className="rounded-full text-rose-500 bg-rose-50 h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* TAB CONTENT: RECIPES */}
          <TabsContent value="recipes" className="outline-none">
            {isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 opacity-50">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-4/3 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {recipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} />)}
              </div>
            ) : (
              <EmptyState icon={ChefHat} title={searchQuery ? "No recipes found" : "Ready to cook?"} description={searchQuery ? "Try checking your spelling or using different ingredients." : "Start typing above to discover amazing community recipes."} />
            )}
          </TabsContent>

          {/* TAB CONTENT: USERS */}
          <TabsContent value="users" className="outline-none">
            {isPending ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-50 rounded-2xl" />)}
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {users.map((user: any) => <UserCard key={user.id} user={user} />)}
              </div>
            ) : (
              <EmptyState icon={UsersIcon} title="No chefs found" description="Try searching for a different name or username." />
            )}
          </TabsContent>

          {/* TAB CONTENT: TRENDING */}
          <TabsContent value="trending" className="outline-none">
            <div className="space-y-16">
              <section>
                <div className="flex items-center justify-between mb-8 px-2">
                  <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-orange-500 h-6 w-6" /> Trending Recipes
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {trendingRecipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} />)}
                </div>
              </section>

              <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3 px-2">
                  <UsersIcon className="text-orange-500 h-6 w-6" /> Top Contributors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {popularUsers.map((user: any) => <UserCard key={user.id} user={user} />)}
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function UserCard({ user }: { user: any }) {
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex items-center gap-6">
      <Link href={`/profile/${user.username}`} className="relative">
        <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
          <AvatarImage src={user.avatar_url} className="object-cover" />
          <AvatarFallback className="text-2xl font-black bg-orange-100 text-orange-600">
            {user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-orange-500 border-2 border-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ChefHat className="h-3 w-3 text-white" />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.username}`}>
          <h3 className="font-black text-xl text-slate-900 hover:text-orange-600 transition-colors truncate tracking-tight">
            @{user.username}
          </h3>
        </Link>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">
          {user.full_name || 'Home Chef'}
        </p>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5"><ChefHat className="h-3 w-3" /> {user.recipe_count} Recipes</span>
          <span className="flex items-center gap-1.5"><UsersIcon className="h-3 w-3" /> {user.follower_count} Followers</span>
        </div>
      </div>

      <FollowButton
        userId={user.id}
        initialIsFollowing={false}
        isAuthenticated={true}
        className="rounded-xl font-black px-6 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
      />
    </div>
  )
}

function EmptyState({ icon: Icon, title, description }: any) {
  return (
    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
      <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Icon className="h-10 w-10 text-slate-200" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium max-w-sm mx-auto">{description}</p>
    </div>
  )
}