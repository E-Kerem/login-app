"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { useRouter } from 'next/router';
import { signInWithEmail, signInWithFacebook, signInWithGoogle } from "@/lib/supabaseClient"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  async function onSubmit(event: React.SyntheticEvent) {
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
      event.preventDefault();
      setIsLoading(true);
    
      try {
        const response = await signInWithEmail(email, password);
        if (response) {
          router.push('@src/app/loggedIn'); // Navigate to the success page
        }
      } catch (error) {
        console.error('Sign in error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();

    } catch (error) {
      console.error('Google sign in error:', error);

    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithFacebook = async () => {
    setIsLoading(true);
    try {
      await signInWithFacebook();

    } catch (error) {
      console.error('Facebook sign in error:', error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Your password"
              type="password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : "Sign In with Email"}
          </Button>
        </div>
      </form>
      {/* Other components remain the same */}
      <Button variant="outline" type="button" onClick={handleSignInWithGoogle} disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button variant="outline" type="button" onClick={handleSignInWithFacebook} disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.facebook className="mr-2 h-4 w-4" />
        )}
        Facebook
      </Button>
    </div>
  );
}
