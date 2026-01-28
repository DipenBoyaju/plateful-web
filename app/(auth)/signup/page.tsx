"use client"
import { signUp } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";


export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, { error: "", success: "" })

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <CardTitle className="text-3xl font-bold">Join Plateful</CardTitle>
          <CardDescription>Create an account to share your recipes</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                required
                disabled={isPending}
                onChange={(e) => {
                  e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
                minLength={6}
              />
              <p className="text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            {state?.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                {state.success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}