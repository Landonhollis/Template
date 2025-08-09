import { View, Text, Pressable } from 'react-native';
import { useStyleParser } from '../../lib/utilities/style-parser';
import { supabase } from '../../lib/utilities/supabase';
import { useAuth } from '../../lib/contextProviders/authProvider';

export default function MoneyScreen() {

  const ps = useStyleParser()
  

  return (
    <View className="flex-1 justify-center items-center" style={ps('bg-2')}>
      <Text style={ps('f-1 text-xl text-normal')}>Welcome to Money</Text>
    </View>
  );
}