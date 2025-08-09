import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import "../global.css"
import { useStyleParser } from '../lib/utilities/style-parser'
import { supabase } from '../lib/utilities/supabase'
import HomeScreen from './homeScreen'
import Auth from './screens/Auth'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const ps = useStyleParser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View className="flex-1" style={ps('bg-1')}>
      {session && session.user ? <HomeScreen/> : <Auth />}
    </View>
  )
}