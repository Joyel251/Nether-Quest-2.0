'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: "team"+Number(formData.get('team-number'))+"@supabase" as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
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

  // Return success so client can trigger pixel transition animation
  revalidatePath('/', 'layout')
  return { success: true }
}