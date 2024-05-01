import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export const supabase = createClientComponentClient();

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  console.log("success")
  if (error) throw error;
  return data;
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  });
  if (error) throw error;
  return data;
}


export async function signInWithEmail(email: string, password: string) {
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  const { data: user, error } = await supabase
    .from('user_signins')
    .select('*')
    .eq('email', email)
    .single();

  if (!user || user.failed_attempts >= 3) {
    throw new Error('Account is locked.');
  }

  if (signInError) {
    const { error: updateError } = await supabase
      .from('user_signins')
      .update({ failed_attempts: user.failed_attempts + 1 })
      .eq('email', email);
    throw signInError;
  }

  if (data) {
    const { error: resetError } = await supabase
      .from('user_signins')
      .update({ failed_attempts: 0 })
      .eq('email', email);
  }

  return data;
}
