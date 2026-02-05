import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FollowButton } from '@/components/follow/follow-button'
import { getFollowersCount, getFollowingCount, isFollowing } from '@/actions/follow-actions'
import { getUser } from '@/actions/auth-actions'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Share2, Utensils } from 'lucide-react'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) {
    notFound()
  }

  // Get current user
  const user = await getUser()
  const isOwnProfile = user?.id === profile.id

  // Get user's recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  // Get like counts for recipes
  const recipesWithLikes = await Promise.all(
    (recipes || []).map(async (recipe) => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipe.id)

      return {
        ...recipe,
        likes_count: count || 0
      }
    })
  )

  // Get follower/following counts
  const followersCount = await getFollowersCount(profile.id)
  const followingCount = await getFollowingCount(profile.id)

  // Check if current user follows this profile
  const userIsFollowing = user && !isOwnProfile ? await isFollowing(profile.id) : false

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      {/* PROFILE HEADER - Modernized */}
      <div className="relative mb-16 pb-12 border-b border-slate-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

          {/* Avatar with Ring/Shadow effect */}
          <div className="relative">
            <Avatar className="w-40 h-40 border-[6px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-100">
              <AvatarImage src={profile.avatar_url} alt={profile.username} className="object-cover" />
              <AvatarFallback className="text-5xl font-black bg-orange-50 text-orange-600">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className="absolute bottom-2 right-2 h-8 w-8 bg-slate-900 rounded-full border-4 border-white flex items-center justify-center text-white cursor-pointer hover:bg-orange-600 transition-colors">
                <span className="text-[10px] font-bold">+</span>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
                  {profile.username}
                </h1>
                {profile.full_name && (
                  <p className="text-xl font-medium text-slate-500">{profile.full_name}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                {isOwnProfile ? (
                  <Link href="/profile/edit">
                    <Button variant="outline" className="rounded-xl px-6 font-bold border-slate-200 hover:bg-slate-50 transition-all">
                      Edit Profile
                    </Button>
                  </Link>
                ) : user ? (
                  <FollowButton
                    userId={profile.id}
                    initialIsFollowing={userIsFollowing}
                    isAuthenticated={!!user}
                    className="rounded-xl px-8 shadow-lg shadow-orange-200"
                  />
                ) : (
                  <Link href="/login">
                    <Button className="rounded-xl px-8 bg-slate-900 hover:bg-orange-600 shadow-lg transition-all">
                      Follow
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Bar - Minimalist */}
            <div className="flex justify-center md:justify-start items-center gap-12 py-2">
              <div className="group cursor-default">
                <p className="text-2xl font-black text-slate-900 leading-none">{recipesWithLikes.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recipes</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-2xl font-black text-slate-900 leading-none group-hover:text-orange-600 transition-colors">{followersCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Followers</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-2xl font-black text-slate-900 leading-none group-hover:text-orange-600 transition-colors">{followingCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Following</p>
              </div>
            </div>

            {/* Bio with subtle styling */}
            {profile.bio && (
              <div className="max-w-2xl">
                <p className="text-slate-600 leading-relaxed text-lg font-medium opacity-90">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECIPES GRID SECTION */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isOwnProfile ? 'Your Kitchen' : `${profile.username}'s Creations`}
          </h2>
          <div className="h-px flex-1 mx-8 bg-slate-100 hidden md:block" />
          <div className="flex gap-2">
            {/* Potential filter buttons for modern UI */}
            <Button variant="ghost" size="sm" className="font-bold text-orange-600">Latest</Button>
            <Button variant="ghost" size="sm" className="font-bold text-slate-400 hover:text-slate-600">Popular</Button>
          </div>
        </div>

        {recipesWithLikes.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <div className="bg-white w-20 h-20 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
              <Utensils className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-400 text-lg font-medium mb-8 max-w-xs mx-auto">
              {isOwnProfile
                ? "Your kitchen is empty! Time to share your first culinary masterpiece."
                : "This chef hasn't posted any secrets yet."}
            </p>
            {isOwnProfile && (
              <Link href="/recipe/create">
                <Button className="rounded-xl px-8 py-6 bg-slate-900 hover:bg-orange-600 shadow-xl transition-all font-bold">
                  Create Your First Recipe
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recipesWithLikes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}