'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleLike } from '@/actions/like-actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  recipeId: string
  initialLikes: number
  initialIsLiked: boolean
  isAuthenticated: boolean
}

export function LikeButton({ recipeId, initialLikes, initialIsLiked, isAuthenticated }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      // Optimistic update
      setIsLiked(!isLiked)
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

      const result = await toggleLike(recipeId)
    })
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={`rounded-full transition-all hover:scale-110 ${isLiked
        ? 'bg-rose-100 hover:bg-rose-200 text-rose-600'
        : 'bg-white/90 backdrop-blur-sm hover:bg-white'
        }`}
      onClick={handleLike}
      disabled={isPending}
    >
      <Heart
        className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
      />
      {likesCount > 0 && (
        <span className="absolute -top-2 -left-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {likesCount}
        </span>
      )}
    </Button>
  )
}