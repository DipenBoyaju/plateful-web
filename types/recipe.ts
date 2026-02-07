export interface RecipeCardProps {
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