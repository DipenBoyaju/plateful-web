import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Heart } from 'lucide-react'

interface RecipeCardProps {
  id: string
  title: string
  description: string
  image_url: string
  profiles: {
    username: string
    full_name: string
    avatar_url?: string
  }
  cook_time: number      // Changed from cookTime to cook_time (database field name)
  difficulty: 'Easy' | 'Medium' | 'Hard'
  likes_count?: number   // Changed from likes to likes_count (what we return from actions)
}

export function RecipeCard({
  id,
  title,
  description,
  image_url,
  profiles,
  cook_time,              // Use snake_case (matches database)
  difficulty,
  likes_count = 0,        // Default to 0 if not provided
}: RecipeCardProps) {
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  }

  return (
    <Link href={`/recipe/${id}`} className="block group">
      <Card className="h-full overflow-hidden border-slate-100 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Cook Time Badge */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1.5 bg-black/50 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {cook_time} min
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className={difficultyColor[difficulty]}>
              {difficulty}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6 border border-slate-200">
              <AvatarImage src={profiles.avatar_url} />
              <AvatarFallback className="text-xs">
                {profiles.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-slate-500">
              {profiles.full_name || profiles.username}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xl mb-2 text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-auto">
          {/* Likes */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">{likes_count}</span>
            </div>
          </div>

          {/* View Recipe Link */}
          <div className="pt-4 text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            View Recipe →
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}