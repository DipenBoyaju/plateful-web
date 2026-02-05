import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Users, Share2, Utensils, Printer } from 'lucide-react'
import { getRecipeByid } from '@/actions/recipe-actions'
import { notFound } from 'next/navigation'
import { LikeButton } from '@/components/recipe/like-button'
import { SaveButton } from '@/components/recipe/save-button'
import { CommentsSection } from '@/components/recipe/comments-section'
import { FollowButton } from '@/components/follow/follow-button'
import { getLikesCount, isLikedByUser } from '@/actions/like-actions'
import { isSavedByUser } from '@/actions/save-actions'
import { getComments } from '@/actions/comment-actions'
import { isFollowing } from '@/actions/follow-actions'
import { getUser } from '@/actions/auth-actions'
import Link from 'next/link'

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const recipe = await getRecipeByid(id);

  if (!recipe) {
    notFound()
  }

  // Get all the data we need
  const user = await getUser()
  const likesCount = await getLikesCount(id)
  const isLiked = await isLikedByUser(id)
  const isSaved = await isSavedByUser(id)
  const comments = await getComments(id)

  // IMPORTANT: Get the author's user_id from the recipe
  const authorId = recipe.user_id // This is the key fix!

  // Check if current user follows the recipe author
  const userIsFollowing = user && user.id !== authorId
    ? await isFollowing(authorId)
    : false

  // Check if this is the user's own recipe
  const isOwnRecipe = user?.id === authorId

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 bg-white/50">
      {/* HERO SECTION */}
      <div className="relative mb-24">
        <div className="relative h-[65vh] min-h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)]">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Action Buttons: Positioned for Thumb-Reach/Desktop ease */}
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col gap-3">
              <LikeButton
                recipeId={id}
                initialLikes={likesCount}
                initialIsLiked={isLiked}
                isAuthenticated={!!user}
              />
              <SaveButton
                recipeId={id}
                initialIsSaved={isSaved}
                isAuthenticated={!!user}
              />
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-xl">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Header: Premium Glassmorphism */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[92%] md:w-[75%] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-white/50">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-orange-500/10 text-orange-600 border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              {recipe.difficulty} Level
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {recipe.title}
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-32">
        {/* LEFT COLUMN: The "Chef's Station" */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="sticky top-28 space-y-10">

            {/* Author Card: Sophisticated Minimalist */}
            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-50/50 border border-slate-100">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-4 ring-white shadow-lg">
                  <AvatarImage src={recipe.profiles.avatar_url} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                    {recipe.profiles.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Crafted by</span>
                  <Link href={`/profile/${recipe.profiles.username}`} className="text-lg font-bold text-slate-900 hover:text-orange-600 transition-colors">
                    {recipe.profiles.full_name || recipe.profiles.username}
                  </Link>
                </div>
              </div>
              {!isOwnRecipe && user && (
                <FollowButton
                  userId={authorId}
                  initialIsFollowing={userIsFollowing}
                  isAuthenticated={true}
                  className="rounded-xl shadow-sm"
                />
              )}
            </div>

            {/* Quick Stats: Clean Icons */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center p-6 rounded-[2rem] bg-orange-50/30 border border-orange-100/50">
                <Clock className="h-6 w-6 text-orange-600 mb-2" />
                <span className="text-[10px] font-bold text-orange-900/40 uppercase">Time</span>
                <span className="text-lg font-bold text-slate-900">{recipe.prep_time + recipe.cook_time}m</span>
              </div>
              <div className="flex flex-col items-center p-6 rounded-[2rem] bg-blue-50/30 border border-blue-100/50">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-[10px] font-bold text-blue-900/40 uppercase">Yields</span>
                <span className="text-lg font-bold text-slate-900">{recipe.servings} Servings</span>
              </div>
            </div>

            {/* Ingredients: Interactive Feel */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ingredients</h3>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient: any) => (
                  <label key={ingredient.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                    <input type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer" />
                    <span className="text-slate-700 group-has-checked:text-slate-400 group-has-checked:line-through transition-all">
                      <span className="font-bold text-slate-900 group-has-checked:text-slate-400">{ingredient.quantity}</span> {ingredient.item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: The Journey */}
        <main className="lg:col-span-8">
          <h2 className="text-4xl font-black mb-12 tracking-tight text-slate-900">Preparation</h2>
          <div className="space-y-16">
            {recipe.instructions.map((instruction: any, index: number) => (
              <div key={instruction.id} className="relative flex gap-8 group">
                <div className="flex-none">
                  <div className="sticky top-32 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-xl ring-8 ring-white">
                    {index + 1}
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xl text-slate-700 leading-relaxed font-medium">
                    {instruction.description}
                  </p>
                  {/* Option: If you have step images, they'd go here */}
                  <div className="mt-8 h-px w-full bg-linear-to-r from-slate-100 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <CommentsSection
              recipeId={id}
              initialComments={comments}
              currentUserId={user?.id}
              isAuthenticated={!!user}
            />
          </div>
        </main>
      </div>
    </div>
  )
}