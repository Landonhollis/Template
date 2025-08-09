import { View, Text, Pressable, ScrollView } from 'react-native';
import { currentThemeName, useTheme } from '../../lib/contextProviders/themeProvider';
import { useStyleParser } from '../../lib/utilities/style-parser';
import { useState, useEffect } from 'react';
import { getCurrentUser, User } from '../../lib/utilities/api/testApi';


export default function InnerHomeScreen() {

  const { ctn, updateTheme } = useTheme();
  const ps = useStyleParser();
  const [testActive, setTestActive] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const themeName = currentThemeName();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const switchTheme = async () => {
      if (ctn === 'theme1') {
        await updateTheme('theme2');
      } else if (ctn === 'theme2') {
        await updateTheme('theme3');
      } else if (ctn === 'theme3') {
        await updateTheme('theme4');
      } else {
        await updateTheme('theme1');
      }
    };

  return (
    <ScrollView className="flex-1 pt-20 p-4" style={ps('bg-2')}>
      <Text className="self-center mb-8" style={ps('f-1 text-xl text-normal')}>Welcome to Inner Home</Text>
      

      <Pressable className="self-center p-2 m-4 active:scale-95 active:opacity-70" style={ps('bg-1 shadow-2 br-4 bw-2 bc-normal')} onPress={() => switchTheme()}>
        <Text style={ps('f-1 text-lg text-normal')}>test the theme switch</Text>
      </Pressable>

      <Text className="mb-12 self-center" style={ps('f-1 text-xl text-normal')}>Current theme name: {ctn}</Text>




      <View className="overflow-hidden self-center mb-20" style={ps('bg-1 br-4 shadow-2 bw-2 bc-normal')}>
        <View className="flex-row justify-between items-center" style={ps('bg-2 bw-b-1 bc-normal')}>
          <Text className="mt-5 ml-6" style={ps('text-strong fw-500 text-md f-1')}>Example Theme chanages</Text>

          <Pressable className="m-2 p-2 active:opacity-60" style={testActive ? ps('bg-a1 br-4 bw-2 bc-normal') : ps('br-4 bg-3 bw-2 bc-accent bg-a2')} onPress={() => setTestActive(!testActive)}>
            <Text style={testActive? ps('fw-700 text-inverse') : ps('text-inverse')}>{testActive ? 'active' : 'not active'}</Text>
          </Pressable>
        </View>

        <View className="flex-row justify-between items-center p-4 m-6" style={ps('bg-2 br-4 shadow-2 bw-1 bc-normal')}>

          <View className="p-2 m-2" style={ps('br-4 bg-3 bw-1 shadow-2 bc-normal')}>
            <Text className="m-2" style={ps('text-normal f-1')}>normal text</Text>
            <Text className="m-2" style={ps('text-normal f-1')}>third background</Text>
          </View>

          <View className="p-2 m-2" style={ps('bg-4 br-4 bw-1 shadow-2 bc-normal')}>
            <Text className="m-2" style={ps('text-strong f-1')}>strong text</Text>
            <Text className="m-2" style={ps('text-muted f-1')}>muted text</Text>
            <Text className="m-2" style={ps('text-normal f-1')}>alternate bg</Text>
          </View>

        </View>

      </View>
      



      <View className="overflow-hidden self-center" style={ps('bg-1 br-4 shadow-2 bw-2 bc-normal')}>
        <View className="flex-row justify-between items-center" style={ps('bg-2 bw-b-1 bc-normal')}>
          <Text className="mt-5 ml-6" style={ps('text-strong  f-1 fw-500 text-lg')}>Supa Base Testing</Text>
        </View>

        <View className="p-4 m-6" style={ps('bg-2 br-4 shadow-2 bw-1 bc-normal')}>
          {loading ? (
            <Text className="text-center" style={ps('text-muted f-1')}>Loading user data...</Text>
          ) : user ? (
            <View>
              <Text className="mb-2" style={ps('text-strong f-1 fw-600')}>User Information:</Text>
              <Text className="mb-1" style={ps('text-normal f-1')}>UID: {user.uid}</Text>
              {user.email && <Text className="mb-1" style={ps('text-normal f-1')}>Email: {user.email}</Text>}
              {user.username && <Text className="mb-1" style={ps('text-normal f-1')}>Username: {user.username}</Text>}
              {user.created_at && <Text className="mb-1" style={ps('text-muted f-1 text-sm')}>Created: {new Date(user.created_at).toLocaleDateString()}</Text>}
            </View>
          ) : (
            <Text className="text-center" style={ps('text-muted f-1')}>No user data found</Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}