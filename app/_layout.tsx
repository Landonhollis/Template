import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'
import { AccountProvider } from '../lib/contextProviders/accountProvider'
import { AuthProvider } from '../lib/contextProviders/authProvider'
import { ThemeProvider, useTheme } from '../lib/contextProviders/themeProvider'




// Component that handles themed status bar - must be inside ThemeProvider
function ThemedStatusBar() {
  const { ct } = useTheme();

  return (
    <StatusBar 
      translucent 
      backgroundColor="transparent"
      style={ct ? ct['sb-style'] as 'light' | 'dark' : 'light'}
    />
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Lora': require('../assets/fonts/Lora.ttf'),
    'Lora-Italic': require('../assets/fonts/Lora-Italic.ttf'),
    'DM': require('../assets/fonts/DM.ttf'),
    'DM-Italic': require('../assets/fonts/DM-Italic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <ThemeProvider>
      <AuthProvider>
        <AccountProvider>
          <SafeAreaProvider className="flex-1">
            <ThemedStatusBar />
            <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
              <Slot />
            </View>
          </SafeAreaProvider>
        </AccountProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}