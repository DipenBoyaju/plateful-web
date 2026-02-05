'use client'

import { useState, useEffect, useTransition } from 'react'
import { searchRecipes, searchRecipesByIngredient, searchUsers, getTrendingRecipes, getPopularUsers } from '@/actions/search-actions'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Loader2, TrendingUp, Users as UsersIcon, ChefHat } from 'lucide-react'
import Link from 'next/link'
import { FollowButton } from '@/components/follow/follow-button'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [recipes, setRecipes] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [trendingRecipes, setTrendingRecipes] = useState<any[]>([])
  const [popularUsers, setPopularUsers] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('recipes')
  const [searchType, setSearchType] = useState<'title' | 'ingredient'>('title')

  // Filters
  const [difficulty, setDifficulty] = useState('all')
  const [maxCookTime, setMaxCookTime] = useState<number | undefined>()

  // Load trending/popular on mount
  useEffect(() => {
    loadTrendingAndPopular()
  }, [])

  // Search when query changes
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
    // Update URL
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover & Search</h1>
        <p className="text-slate-600">Find recipes, ingredients, and inspiring chefs</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'recipes'
                  ? searchType === 'ingredient'
                    ? 'Search by ingredient (e.g., chicken, tomato)...'
                    : 'Search recipes by title or description...'
                  : 'Search users by name or username...'
              }
              className="pl-12 py-6 text-lg rounded-xl"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="px-8 rounded-xl"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        {/* Search Type Toggle (only for recipes) */}
        {activeTab === 'recipes' && (
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant={searchType === 'title' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('title')}
            >
              By Title
            </Button>
            <Button
              type="button"
              variant={searchType === 'ingredient' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('ingredient')}
            >
              By Ingredient
            </Button>
          </div>
        )}
      </form>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        {/* Recipes Tab */}
        <TabsContent value="recipes">
          {/* Filters */}
          {searchType === 'title' && (
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium mb-2 block">Max Cook Time</label>
                <Select
                  value={maxCookTime?.toString() || 'all'}
                  onValueChange={(val) => setMaxCookTime(val === 'all' ? undefined : parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    <SelectItem value="15">Under 15 min</SelectItem>
                    <SelectItem value="30">Under 30 min</SelectItem>
                    <SelectItem value="60">Under 1 hour</SelectItem>
                    <SelectItem value="120">Under 2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setDifficulty('all')
                  setMaxCookTime(undefined)
                }}
                className="self-end"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Results */}
          {isPending ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : recipes.length > 0 ? (
            <>
              <p className="text-slate-600 mb-4">Found {recipes.length} recipes</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </>
          ) : searchQuery ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg mb-2">No recipes found</p>
              <p className="text-slate-400">Try different keywords or filters</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <ChefHat className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-lg">Search for recipes to get started</p>
            </div>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          {isPending ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : users.length > 0 ? (
            <>
              <p className="text-slate-600 mb-4">Found {users.length} users</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user: any) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </>
          ) : searchQuery ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg mb-2">No users found</p>
              <p className="text-slate-400">Try different keywords</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <UsersIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-lg">Search for users to get started</p>
            </div>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending">
          <div className="space-y-12">
            {/* Trending Recipes */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                Trending Recipes
              </h2>
              {trendingRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trendingRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No trending recipes yet</p>
              )}
            </section>

            {/* Popular Users */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UsersIcon className="h-6 w-6 text-orange-600" />
                Popular Chefs
              </h2>
              {popularUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularUsers.map((user: any) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No popular users yet</p>
              )}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// User Card Component
function UserCard({ user }: { user: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${user.username}`}>
          <Avatar className="h-16 w-16 border-2 border-white shadow-md cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="text-2xl">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <Link href={`/profile/${user.username}`}>
            <h3 className="font-bold text-lg hover:text-orange-600 transition-colors cursor-pointer">
              {user.username}
            </h3>
          </Link>
          {user.full_name && (
            <p className="text-slate-600 text-sm">{user.full_name}</p>
          )}
          <div className="flex gap-4 mt-2 text-sm text-slate-500">
            <span>{user.recipe_count} recipes</span>
            <span>{user.follower_count} followers</span>
          </div>
        </div>

        <FollowButton
          userId={user.id}
          initialIsFollowing={false}
          isAuthenticated={true}
          size="sm"
        />
      </div>

      {user.bio && (
        <p className="text-slate-600 text-sm mt-4 line-clamp-2">{user.bio}</p>
      )}
    </div>
  )
}