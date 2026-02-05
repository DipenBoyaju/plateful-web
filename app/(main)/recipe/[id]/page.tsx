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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="relative mb-16">
        <div className="relative h-[60vh] min-h-100 w-full rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Action Buttons on Image */}
          <div className="absolute top-6 right-6 flex gap-2">
            <LikeButton
              recipeId={id}
              initialLikes={likesCount}
              initialIsLiked={isLiked}
              isAuthenticated={!!user}
            />
            <Button variant="secondary" size="icon" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all hover:scale-110">
              <Share2 className="h-5 w-5" />
            </Button>
            <SaveButton
              recipeId={id}
              initialIsSaved={isSaved}
              isAuthenticated={!!user}
            />
          </div>
        </div>

        {/* Floating Header Card */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-3">
              {recipe.difficulty}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              {recipe.title}
            </h1>
            <p className="text-slate-500 italic max-w-xl mx-auto leading-relaxed">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">

        {/* LEFT COLUMN - Sticky Info (4/12) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <Clock className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                <span className="block text-xs uppercase text-slate-400 font-bold">Total Time</span>
                <span className="font-semibold">{recipe.prep_time + recipe.cook_time} mins</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <Users className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                <span className="block text-xs uppercase text-slate-400 font-bold">Servings</span>
                <span className="font-semibold">{recipe.servings} people</span>
              </div>
            </div>

            {/* Author Section with Follow Button */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Link href={`/profile/${recipe.profiles.username}`}>
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={recipe.profiles.avatar_url} />
                    <AvatarFallback>
                      {recipe.profiles.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-bold uppercase">Recipe by</p>
                  <Link href={`/profile/${recipe.profiles.username}`}>
                    <p className="font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer">
                      {recipe.profiles.full_name || recipe.profiles.username}
                    </p>
                  </Link>
                </div>
              </div>

              {/* Follow Button - only show if not own recipe and user is logged in */}
              {!isOwnRecipe && user && (
                <FollowButton
                  userId={authorId}
                  initialIsFollowing={userIsFollowing}
                  isAuthenticated={true}
                  variant="outline"
                  size="sm"
                />
              )}

              {/* Show "Your Recipe" badge if it's the user's own recipe */}
              {isOwnRecipe && (
                <div className="text-center py-2 px-4 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                  Your Recipe
                </div>
              )}

              {/* Show login prompt if not logged in */}
              {!user && (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Follow
                  </Button>
                </Link>
              )}
            </div>

            {/* Ingredients List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-600" /> Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient: any) => (
                  <li key={ingredient.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50/50 transition-colors group cursor-pointer">
                    <div className="h-5 w-5 rounded border-2 border-slate-200 group-hover:border-orange-500 transition-colors shrink-0" />
                    <span className="text-slate-700 leading-tight">
                      <span className="font-bold text-slate-900">{ingredient.quantity}</span> {ingredient.item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full py-6 rounded-xl bg-slate-900 hover:bg-orange-600 transition-all shadow-lg shadow-slate-200">
              <Printer className="mr-2 h-4 w-4" /> Print Shopping List
            </Button>
          </div>
        </aside>

        {/* RIGHT COLUMN - Instructions (8/12) */}
        <main className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
              Instructions
              <div className="h-px flex-1 bg-slate-100" />
            </h2>
            <div className="space-y-10">
              {recipe.instructions.map((instruction: any, index: number) => (
                <div key={instruction.id} className="relative pl-12 group">
                  {/* Vertical Line Connector */}
                  {index !== recipe.instructions.length - 1 && (
                    <div className="absolute left-4.75 top-10 -bottom-10 w-0.5 bg-slate-100" />
                  )}
                  {/* Step Number */}
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-orange-500 text-orange-600 flex items-center justify-center font-black transition-all shadow-sm">
                    {index + 1}
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      {instruction.description}
                    </p>
                    <div className="h-1 w-20 bg-slate-50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comments Section */}
          <CommentsSection
            recipeId={id}
            initialComments={comments}
            currentUserId={user?.id}
            isAuthenticated={!!user}
          />
        </main>
      </div>
    </div>
  )
}