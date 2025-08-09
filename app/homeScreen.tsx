import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../lib/contextProviders/authProvider';
import { useStyleParser } from '../lib/utilities/style-parser';
import Account from './screens/Account';
import MoneyScreen from './screens/money';
import InnerHomeScreen from './screens/innerHome';




export default function HomeScreen() {
  const [screen, setScreen] = useState<ScreenType>('home');
  const { session } = useAuth();
  const ps = useStyleParser();


  type ScreenType = 'home' | 'account' | 'fin';


  return (
    <View className="flex-1">




      <View className="flex-1" style={ps('bg-2')}>
        {
          screen === 'home' && <InnerHomeScreen />
        }
        {
          screen === 'account' && <Account session={session} />
        }
        {
          screen === 'fin' && <MoneyScreen />
        }
      </View>
      





      <View className="flex-none flex-row items-center justify-center p-4" style={ps('bg-3 bw-t-1 bc-normal')}>
        <Pressable className="flex-1 justify-center items-center" onPress={() => setScreen('account')}>
          <Text style={ps('text-2xl fw-700 text-normal')}>Account</Text>
        </Pressable>
        <Pressable className="flex-1 justify-center items-center" onPress={() => setScreen('home')}>
          <Text style={ps('text-2xl fw-700 text-normal')}>Home</Text>
        </Pressable>
        <Pressable className="flex-1 justify-center items-center" onPress={() => setScreen('fin')}>
          <Text style={ps('text-2xl fw-700 text-normal')}>Fin</Text>
        </Pressable>
      </View>

    </View>
  )
}