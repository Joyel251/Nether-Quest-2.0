'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: "team"+formData.get('team-number')+"@supabase" as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    console.error('Supabase login error:', error)
    
    // If login failed, check if it's because user doesn't exist or wrong password
    if (error.message.includes('Invalid login credentials') || 
        error.message.includes('Team not confirmed') ||
        error.code === 'invalid_credentials') {
      
      // Try to sign up with same credentials to check if user exists
      const { error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      
      if (signupError && (
          signupError.message.includes('User already registered') || 
          signupError.message.includes('already been registered') || 
          signupError.code === 'user_already_exists'
        )) {
        // User exists but password is wrong
        return { 
          success: false, 
          error: 'WRONG_PASSWORD',
          message: 'Incorrect password! Please try again.' 
        }
      } else {
        // User doesn't exist
        return { 
          success: false, 
          error: 'USER_NOT_EXISTS',
          message: 'Team not found! Please register first.' 
        }
      }
    }
    
    throw new Error(error.message)
  }

  // Redirect to dashboard after successful login
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: "team"+formData.get('team-number')+"@supabase" as string,
    password: formData.get('password') as string,
  }

  console.log(data.email)

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    console.error('Supabase signup error:', error)
    
    // If user already exists, return a specific error type
    if (error.message.includes('User already registered') || 
        error.message.includes('already been registered') || 
        error.code === 'user_already_exists') {
      return { 
        success: false, 
        error: 'USER_EXISTS',
        message: 'User already exists! Please proceed to login.' 
      }
    }
    
    throw new Error(error.message)
  }

  // Don't redirect - let the client handle the step transition
  return { success: true }
}
