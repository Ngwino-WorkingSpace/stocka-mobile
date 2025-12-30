import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';

// Import your screens
import WelcomeScreen from '../../Pages/Welcome.jsx';
import LandingScreen from '../../Pages/Landing.jsx';
import SignupScreen from "../../Pages/signup.jsx";
import SignInScreen from "../../Pages/signin.jsx";
import PlainDashboardScreen from "../../Pages/PlainDashboard.jsx";
import StockScreen from "../../Pages/Stock.jsx";
import SalesScreen from "../../Pages/Sales.jsx";
import ReportScreen from "../../Pages/Reports.jsx";
import ProfileScreen from "../../Pages/Profile.jsx";
import DebtorsScreen from "../../Pages/Debtors.jsx";
import ForgotPasswordScreen from "../../Pages/forgot-PassWord.jsx";
import OTPScreen from "../../Pages/OTP.jsx";

const Stack = createNativeStackNavigator();

export default function MainScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure everything is initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#09364D" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#fff' },
              animationDuration: 200,
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={SignInScreen} />
            <Stack.Screen name="dashboard" component={PlainDashboardScreen} />
            <Stack.Screen name="Stock" component={StockScreen} />
            <Stack.Screen name="Sales" component={SalesScreen} />
            <Stack.Screen name="Reports" component={ReportScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="debtors" component={DebtorsScreen} />
            <Stack.Screen name="forgot-password" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />

          </Stack.Navigator>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
