'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: "team" + formData.get('team-number') + "@supabase" as string,
    password: formData.get('password') as string,
    options: {
      data: {
        team_number: formData.get('team-number') as string,
        team_name: formData.get('team-name') as string,
        round: 1,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error)
    
    // Check if it's because user already exists
    if (error.message.includes('User already registered') || 
        error.message.includes('already been registered') || 
        error.code === 'user_already_exists') {
      return {
        error: 'USER_EXISTS',
        message: 'A team with this number already exists. Please try logging in instead.'
      }
    }
    
    return {
      error: 'SIGNUP_FAILED',
      message: 'Failed to create team. Please try again.'
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
