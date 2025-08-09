import { supabase } from '../supabase'

// Interface for User data structure
export interface User {
  uid: string
  display_name?: string
  email?: string
  phone?: string
  providers?: string[]
  provider_type?: string
  created_at?: string
  last_signed_in_at?: string
  [key: string]: any
}

// Function to get user data by UID (from auth.users table)
export const getUserByUid = async (uid: string): Promise<User | null> => {
  try {
    // For auth schema, we need to use the admin API or get it from the session
    // Since we can't directly query auth.users, we'll get the user from the current session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session?.user || session.user.id !== uid) {
      console.error('Error fetching user session:', error)
      return null
    }

    // Map the auth user data to our User interface
    const authUser = session.user
    const userData: User = {
      uid: authUser.id,
      email: authUser.email,
      phone: authUser.phone,
      created_at: authUser.created_at,
      last_signed_in_at: authUser.last_sign_in_at,
      display_name: authUser.user_metadata?.display_name,
      provider_type: authUser.app_metadata?.provider,
      providers: authUser.app_metadata?.providers,
    }

    return userData
  } catch (error) {
    console.error('Unexpected error fetching user:', error)
    return null
  }
}

// Function to get current authenticated user's data
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Get the current session and extract user data
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      console.error('No authenticated session:', sessionError)
      return null
    }

    // Map the auth user data to our User interface
    const authUser = session.user
    const userData: User = {
      uid: authUser.id,
      email: authUser.email,
      phone: authUser.phone,
      created_at: authUser.created_at,
      last_signed_in_at: authUser.last_sign_in_at,
      // Map other fields from user_metadata or app_metadata if available
      display_name: authUser.user_metadata?.display_name,
      provider_type: authUser.app_metadata?.provider,
      providers: authUser.app_metadata?.providers,
    }

    return userData
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Hook-like function for React components to get current user
export const useCurrentUser = async (): Promise<User | null> => {
  return await getCurrentUser()
}