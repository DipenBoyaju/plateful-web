'use client'

import { Button } from '@/components/ui/button'
import { toggleFollow } from '@/actions/follow-actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, UserCheck } from 'lucide-react'
import { cn } from "@/lib/utils"

interface FollowButtonProps {
  userId: string
  initialIsFollowing: boolean
  isAuthenticated: boolean
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function FollowButton({
  userId,
  initialIsFollowing,
  isAuthenticated,
  variant = 'default',
  size = 'default',
  className
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleFollow = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      // Optimistic update
      const previousFollowing = isFollowing
      setIsFollowing(!isFollowing)

      const result = await toggleFollow(userId)

      if (result.error) {
        // Revert on error
        setIsFollowing(previousFollowing)
        console.error(result.error)
      }
    })
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleFollow}
      disabled={isPending}
      className={cn(
        isFollowing ? 'border-slate-300' : '',
        className
      )}
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  )
}