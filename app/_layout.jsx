import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  View,
  ActivityIndicator,
  Text,
  Animated,
  Image,
  StyleSheet
} from 'react-native';
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

import { useRef } from 'react';
import Toast from 'react-native-toast-message';

import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  // Animation state
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded, fontError] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  useEffect(() => {
    // Blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();

    async function prepare() {
      try {
        if (fontsLoaded || fontError) {
          // Keep showing our custom splash for a bit longer if needed or hide native immediately
          // Hiding native splash so our custom one shows
          await SplashScreen.hideAsync();
          // Simulate a minimum delay or just wait for fonts
          setTimeout(() => setAppIsReady(true), 2000); // 2 seconds custom splash
        }
      } catch (e) {
        console.warn('Error preparing app:', e);
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={require('../assets/images/Fstocka.png')}
            style={styles.splashLogo}
            resizeMode="contain"
          />
        </Animated.View>
        {/* <Text style={styles.splashText}>Stocka</Text> */}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#fff' },
              animation: 'default',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#09111E', // Theme color
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 120,
    height: 120,
  },
  splashText: {
    marginTop: 20,
    color: '#fff',
    fontFamily: 'Urbanist_700Bold', // Make sure fonts are loaded or use system font as backup? 
    // Wait, if fonts aren't loaded this might error. Safer to use system font here or wait for fonts inside prepare.
    // Actually the splash is showing WHILE fonts are loading. So we shouldn't rely on custom fonts yet unless we are sure.
    // I will use a safe font here.
    fontSize: 24,
    fontWeight: 'bold',
  }
});





