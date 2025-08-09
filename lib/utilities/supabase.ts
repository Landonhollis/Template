import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ggppnafyhxnhfkrxlefu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncHBuYWZ5aHhuaGZrcnhsZWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTMwMjYsImV4cCI6MjA2NzQ4OTAyNn0.oRK13gnEaBHow6PTfTmEDqk6E0vat5PIvCv6W8u78KE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})