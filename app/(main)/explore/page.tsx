'use client'

import { useState, useEffect, useTransition } from 'react'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
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

  useEffect(() => {
    loadRecipes()
  }, [difficulty, maxCookTime, sortBy])

  const loadRecipes = () => {
    setIsLoading(true)
    startTransition(async () => {
      const results = await searchRecipes('', {
        difficulty: difficulty !== 'all' ? difficulty : undefined,
        maxCookTime: maxCookTime
      })

      let sortedResults = [...results]
      if (sortBy === 'popular') {
        sortedResults.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
      } else if (sortBy === 'quickest') {
        sortedResults.sort((a, b) => a.cook_time - b.cook_time)
      }

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
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">
            Explore <span className="text-orange-500">Flavors.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Discover the best recipes from our global community of chefs.
          </p>
        </div>

        {/* Desktop Sorting Only - Kept clean */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3">Sort By</span>
          <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <SelectTrigger className="w-[180px] border-none bg-white shadow-sm rounded-xl font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="quickest">Quickest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            className={`rounded-xl font-bold gap-2 h-12 px-6 transition-all ${showFilters ? 'bg-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-orange-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in">
                !
              </span>
            )}
          </Button>

          {/* Quick Filter Badges (Commonly used filters) */}
          {['Easy', 'Medium', 'Hard'].map((lvl) => (
            <Button
              key={lvl}
              variant="ghost"
              onClick={() => setDifficulty(difficulty === lvl ? 'all' : lvl)}
              className={`rounded-xl h-12 px-6 font-bold border ${difficulty === lvl ? 'bg-orange-50 border-orange-200 text-orange-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            >
              {lvl}
            </Button>
          ))}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-slate-400 hover:text-rose-500 font-bold gap-2"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Limit</label>
                <Select
                  value={maxCookTime?.toString() || 'all'}
                  onValueChange={(val) => setMaxCookTime(val === 'all' ? undefined : parseInt(val))}
                >
                  <SelectTrigger className="rounded-xl border-slate-100 h-12 font-bold bg-slate-50">
                    <SelectValue placeholder="Any Duration" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Any Duration</SelectItem>
                    <SelectItem value="15">Under 15 min</SelectItem>
                    <SelectItem value="30">Under 30 min</SelectItem>
                    <SelectItem value="60">Under 1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add more filter columns here as you grow */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meal Type</label>
                <div className="flex items-center h-12 px-4 bg-slate-50 rounded-xl text-slate-300 italic text-sm border border-slate-100">
                  Category filters coming soon...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-slate-100" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
          {isLoading ? 'Searching...' : `${recipes.length} results`}
        </p>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* RECIPE GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-[4/3] bg-slate-100 rounded-[2rem]" />
              <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
              <div className="h-6 w-2/3 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Filter className="h-8 w-8 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No matches found</h3>
          <p className="text-slate-500 font-medium mb-8">Try clearing your filters or exploring a different category.</p>
          <Button onClick={clearFilters} variant="outline" className="rounded-xl font-bold border-slate-200">
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  )
}