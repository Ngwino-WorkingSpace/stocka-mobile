import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import WelcomeScreen from '../../Pages/Welcome.jsx';
import LandingScreen from '../../Pages/Landing.jsx';
import SignupScreen from "../../Pages/signup.jsx";
import SignInScreen from "../../Pages/signin.jsx";
import PlainDashboardScreen from "../../Pages/PlainDashboard.jsx";
import StockScreen from "../../Pages/Stock.jsx";

const Stack = createNativeStackNavigator();

export default function MainScreen() {
  return (
      <Stack.Navigator
        initialRouteName="Welcome" // start screen
        screenOptions={{
          headerShown: false, // hides default header
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={SignInScreen} />
        <Stack.Screen name="dashboard" component={PlainDashboardScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />

      </Stack.Navigator>
  );
}
