'use client'

import { useState, useEffect, useTransition } from 'react'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Filter, SlidersHorizontal } from 'lucide-react'
import { searchRecipes } from '@/actions/search-actions'

export default function ExplorePage() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [difficulty, setDifficulty] = useState('all')
  const [maxCookTime, setMaxCookTime] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'quickest'>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Load recipes on mount and when filters change
  useEffect(() => {
    loadRecipes()
  }, [difficulty, maxCookTime, sortBy])

  const loadRecipes = () => {
    setIsLoading(true)
    startTransition(async () => {
      // Search with filters (empty query returns all)
      const results = await searchRecipes('', {
        difficulty: difficulty !== 'all' ? difficulty : undefined,
        maxCookTime: maxCookTime
      })

      // Sort results
      let sortedResults = [...results]
      if (sortBy === 'popular') {
        sortedResults.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
      } else if (sortBy === 'quickest') {
        sortedResults.sort((a, b) => a.cook_time - b.cook_time)
      }
      // 'newest' is already sorted by created_at desc from the query

      setRecipes(sortedResults)
      setIsLoading(false)
    })
  }

  const clearFilters = () => {
    setDifficulty('all')
    setMaxCookTime(undefined)
    setSortBy('newest')
  }

  const hasActiveFilters = difficulty !== 'all' || maxCookTime !== undefined

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Recipes</h1>
        <p className="text-slate-600">
          Discover delicious recipes from our community
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {hasActiveFilters && '(Active)'}
          </Button>
          <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="quickest">Quickest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Filters - Always visible */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl">
            {/* Sort By */}
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="quickest">Quickest to Make</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
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

            {/* Max Cook Time */}
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

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="self-end"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-600">
          {isLoading ? 'Loading...' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Filter className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 text-lg mb-2">No recipes found</p>
          <p className="text-slate-400 mb-4">Try adjusting your filters</p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}