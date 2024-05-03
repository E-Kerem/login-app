"use client"

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { signInWithEmail, signInWithFacebook, signInWithGoogle } from "@/lib/supabaseClient";
import { redirect } from 'next/navigation'
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  
}
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(''); 

  
  const redirectUser = () => {
    if (typeof window !== "undefined") {
      window.location.href = '/nearestSea';  // Updated path
    }
  };
  

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      redirectUser();
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMessage('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      console.log("sucecss")
      redirectUser();
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
      //redirectUser();
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
          <Button type="submit" onClick={onSubmit} disabled={isLoading}>
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
