'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment, deleteComment } from '@/actions/comment-actions'
import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string
  }
}

interface CommentsSectionProps {
  recipeId: string
  initialComments: Comment[]
  currentUserId?: string
  isAuthenticated: boolean
}

export function CommentsSection({
  recipeId,
  initialComments,
  currentUserId,
  isAuthenticated
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    startTransition(async () => {
      const result = await addComment(recipeId, newComment)

      if (result.error) {
        setError(result.error)
      } else if (result.comment) {
        setComments([result.comment, ...comments])
        setNewComment('')
        setError(null)
      }
    })
  }

  const handleDelete = (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    startTransition(async () => {
      const result = await deleteComment(commentId, recipeId)

      if (result.success) {
        setComments(comments.filter(c => c.id !== commentId))
      }
    })
  }

  return (
    <section className="pt-12 border-t border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          Community Notes ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="min-h-24 mb-3"
            disabled={isPending}
          />
          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}
          <Button type="submit" disabled={isPending || !newComment.trim()}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </Button>
        </form>
      ) : (
        <div className="bg-slate-50 p-6 rounded-lg text-center mb-8">
          <p className="text-slate-600">
            Please <a href="/login" className="text-orange-600 font-medium">log in</a> to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6 h-160 overflow-scroll">
        {comments.length === 0 ? (
          <p className="text-center text-slate-400 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.profiles.avatar_url} />
                    <AvatarFallback>
                      {comment.profiles.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{comment.profiles.username}</p>
                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {currentUserId === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-slate-600">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}