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
  const [errorMessage, setErrorMessage] = React.useState<string>(''); // State to hold error messages

  async function onSubmit(event: React.SyntheticEvent) {
    const router = useRouter();

      event.preventDefault();
      setIsLoading(true);
      setErrorMessage(''); // Clear any existing error messages
  
      try {
        const data = await signInWithEmail(email, password);
        if (data.user && data.session) {
          // Assuming you want to redirect upon a successful sign-in
          router.push('/path/to/success/page'); // Adjust the path as needed
        } else {
          // This else block might not be necessary if all errors are thrown, but it's here for completeness
          setErrorMessage('Failed to sign in. Please try again.');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
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
            {/* Conditionally render the error message here */}
            {errorMessage && (
              <div id="error-message" style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : "Sign In with Email"}
          </Button>
        </div>
      </form>
      {/* Google Sign-in Button */}
      <Button variant="outline" type="button" onClick={handleSignInWithGoogle} disabled={isLoading} data-testid="google-login-button">
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      {/* Facebook Sign-in Button */}
      <Button variant="outline" type="button" onClick={handleSignInWithFacebook} disabled={isLoading} data-testid="facebook-login-button">
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
