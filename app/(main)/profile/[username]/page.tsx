import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FollowButton } from '@/components/follow/follow-button'
import { getFollowersCount, getFollowingCount, isFollowing } from '@/actions/follow-actions'
import { getUser } from '@/actions/auth-actions'
import { RecipeCard } from '@/components/recipe/recipe-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
            <AvatarFallback className="text-4xl">
              {profile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{profile.username}</h1>
                {profile.full_name && (
                  <p className="text-slate-600 text-lg">{profile.full_name}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-0">
                {isOwnProfile ? (
                  <Link href="/profile/edit">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                ) : user ? (
                  <FollowButton
                    userId={profile.id}
                    initialIsFollowing={userIsFollowing}
                    isAuthenticated={!!user}
                  />
                ) : (
                  <Link href="/login">
                    <Button>Follow</Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{recipesWithLikes.length}</p>
                <p className="text-sm text-slate-500">Recipes</p>
              </div>
              <div className="text-center cursor-pointer hover:opacity-70 transition-opacity">
                <p className="text-2xl font-bold text-slate-900">{followersCount}</p>
                <p className="text-sm text-slate-500">Followers</p>
              </div>
              <div className="text-center cursor-pointer hover:opacity-70 transition-opacity">
                <p className="text-2xl font-bold text-slate-900">{followingCount}</p>
                <p className="text-sm text-slate-500">Following</p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {isOwnProfile ? 'Your Recipes' : `${profile.username}'s Recipes`}
        </h2>

        {recipesWithLikes.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <p className="text-slate-500 text-lg mb-4">
              {isOwnProfile ? "You haven't posted any recipes yet" : "No recipes yet"}
            </p>
            {isOwnProfile && (
              <Link href="/recipe/create">
                <Button>Create Your First Recipe</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipesWithLikes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}