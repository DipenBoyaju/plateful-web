import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChefHat, Clock, Heart } from 'lucide-react'

interface RecipeCardProps {
  id: string
  title: string
  description: string
  image_url: string
  profiles: {
    full_name: string
    avatar_url?: string
  }
  cookTime: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  likes: number
}

export function RecipeCard({
  id,
  title,
  description,
  image_url,
  profiles,
  cookTime,
  difficulty,
  likes,
}: RecipeCardProps) {
  // cosnt { data: user } = await
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  }

  return (
    <Link href={`/recipe/${id}`} className="block group">
      <Card className="h-full overflow-hidden border-slate-100 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1.5 bg-black/50 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {cookTime} min
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 border border-slate-200">
                <AvatarImage src={profiles.avatar_url} />
                <AvatarFallback className="text-[10px]">{profiles.full_name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{profiles.full_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className={difficultyColor[difficulty]}>
                {difficulty}
              </Badge>
              <ChefHat className="h-4 w-4" />
            </div>
          </div>

          <h3 className="font-bold text-xl mb-2 text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-1.5 text-slate-500 group/heart cursor-pointer">
              <Heart className="h-4 w-4 transition-colors group-hover/heart:fill-rose-500 group-hover/heart:text-rose-500" />
              <span className="text-sm font-medium">{likes}</span>
            </div>
          </div>
          <div className="pt-4 text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            View Recipe →
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}