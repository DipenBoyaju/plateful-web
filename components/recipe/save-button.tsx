'use client'

import { toggleSave } from "@/actions/save-actions"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "../ui/button"
import { Bookmark } from "lucide-react"

interface SaveButtonProps {
  recipeId: string
  initialIsSaved: boolean
  isAuthenticated: boolean
}

export function SaveButton({ recipeId, initialIsSaved, isAuthenticated }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSave = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      setIsSaved(!isSaved)

      const result = await toggleSave(recipeId)

      if (result.error) {
        setIsSaved(isSaved)
        console.error(result.error)
      }
    })
  }

  return (
    <Button variant="secondary" size="icon" className={`rounded-full transition-all hover:scale-110 ${isSaved ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600' : 'bg-white/90 backdrop-blur-sm hover:bg-white'}`} onClick={handleSave} disabled={isPending}>
      <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
    </Button>
  )
}