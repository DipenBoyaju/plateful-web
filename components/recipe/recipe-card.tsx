import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, Heart, ArrowRight } from 'lucide-react'

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
  cook_time: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  likes_count?: number
}

export function RecipeCard({
  id,
  title,
  description,
  image_url,
  profiles,
  cook_time,
  difficulty,
  likes_count = 0,
}: RecipeCardProps) {
  const difficultyStyles = {
    Easy: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Hard: 'bg-rose-50 text-rose-600 border-rose-100',
  }

  return (
    <Link href={`/recipe/${id}`} className="block group">
      <Card className="h-full overflow-hidden border-none bg-white transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 rounded-[2rem]">
        {/* IMAGE SECTION */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Top Overlay: Difficulty */}
          <div className="absolute top-4 left-4">
            <Badge className={`px-3 py-1 border font-bold text-[10px] uppercase tracking-widest rounded-lg backdrop-blur-md shadow-sm ${difficultyStyles[difficulty]}`}>
              {difficulty}
            </Badge>
          </div>

          {/* Bottom Overlay: Cook Time */}
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-1.5 bg-slate-900/80 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-orange-400" />
              {cook_time}m
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <CardContent className="p-6">
          {/* Profile & Likes Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 ring-2 ring-slate-50">
                <AvatarImage src={profiles.avatar_url} />
                <AvatarFallback className="text-[10px] font-bold bg-orange-100 text-orange-600">
                  {profiles.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {profiles.full_name || profiles.username}
              </span>
            </div>

            {/* Refined Like Indicator: It only "pops" on card hover, but stays subtle */}
            <div className="flex items-center gap-1.5 text-slate-300 transition-all duration-300 group-hover:text-slate-500">
              <Heart
                className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-rose-500"
                strokeWidth={2.5}
              />
              <span className="text-xs font-black">{likes_count}</span>
            </div>
          </div>

          <h3 className="font-black text-xl mb-2 text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1 tracking-tight">
            {title}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium opacity-80">
            {description}
          </p>
        </CardContent>

        {/* FOOTER SECTION */}
        <CardFooter className="px-6 pb-6 pt-0 mt-auto">
          <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between group/btn">
            <span className="text-sm font-bold text-slate-900">View Recipe</span>
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}