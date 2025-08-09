import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import { ThemeProvider } from '../../lib/contextProviders/themeProvider'
import { useStyleParser } from '../../lib/utilities/style-parser'
import { supabase } from '../../lib/utilities/supabase'


export default function Account({ session }: { session: Session | null }) {
  const ps = useStyleParser()
  
  if (!session) {
    return (
      <View className="flex-1 items-center justify-center" style={ps('bg-1')}>
        <Text style={ps('text-normal text-lg f-1')}>No session found. Please log in.</Text>
      </View>
    )
  }


  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')


  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <View className="flex-1 p-4" style={ps('bg-1')}>
        <View className="mb-4 mt-5">
          <Text className="mb-2" style={ps('text-normal text-md fw-500 f-1')}>Email</Text>
          <TextInput 
            className="rounded-lg p-3"
            style={ps('bg-3 bc-normal bw-1 text-muted f-1')}
            value={session?.user?.email} 
            editable={false} 
          />
        </View>
        <View className="mb-4">
          <Text className="mb-2" style={ps('text-normal text-md fw-500 f-1')}>Username</Text>
          <TextInput 
            className="rounded-lg p-3"
            style={ps('bg-6 bc-normal bw-1 text-normal f-1')}
            value={username || ''} 
            onChangeText={(text) => setUsername(text)} 
          />
        </View>
        <View className="mb-4">
          <Text className="mb-2" style={ps('text-normal text-md fw-500 f-1')}>Website</Text>
          <TextInput 
            className="rounded-lg p-3"
            style={ps('bg-6 bc-normal bw-1 text-normal f-1')}
            value={website || ''} 
            onChangeText={(text) => setWebsite(text)} 
          />
        </View>

        <View className="mb-4 mt-5">
          <Pressable 
            className="rounded-lg p-4 items-center"
            style={[ps('bg-a1 shadow-2'), { opacity: loading ? 0.5 : 1 }]}
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
            disabled={loading}
          >
            <Text style={ps('text-normal fw-600 f-1')}>{loading ? 'Loading ...' : 'Update'}</Text>
          </Pressable>
        </View>

        <View className="mb-4">
          <Pressable className="rounded-lg p-4 items-center" style={ps('bg-a3 shadow-1')} onPress={() => supabase.auth.signOut()}>
            <Text style={ps('text-normal fw-600 f-1')}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </ThemeProvider>
  )
}

