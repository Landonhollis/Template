import { supabase } from '../supabase'

// Interface for user preferences
export interface UserPreferences {
  created_at: string
  theme_name: string
  user_id: string
  notifications: boolean
}

// Type for theme names
export type Ctn = 'theme1' | 'theme2' | 'theme3' | 'theme4'

// Function to get user's theme preference
export const getCurrentThemeName = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('theme_name')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      return 'theme1' // Default theme if no preference is found
    }

    return data.theme_name
  } catch (error) {
    console.error('Unexpected error fetching theme preference:', error)
    return 'theme1' // Default theme in case of error
  }
}

// Function to update user's theme preference
export const updateThemeName = async (userId: string, themeName: Ctn): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .update({ theme_name: themeName })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating user theme preference:', error);
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error updating theme preference:', error)
    return false
  }
}
