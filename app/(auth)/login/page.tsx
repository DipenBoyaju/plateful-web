"use client"
import { signIn } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInState } from "@/types/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

const initialState: SignInState = {
  error: undefined,
}
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState)
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your Plateful account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
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
              />
            </div>

            {state?.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}