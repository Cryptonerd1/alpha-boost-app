import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import KegelScreen from '../screens/KegelScreen';
import GameDayScreen from '../screens/GameDayScreen';
import RecipesScreen from '../screens/RecipesScreen';
import PerformanceLogScreen from '../screens/PerformanceLogScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GREEN = '#22c55e';

function TabIcon({ focused, emoji, label }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
      <Text style={{ fontSize: 9, fontWeight: focused ? '700' : '500', color: focused ? GREEN : '#9ca3af', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 72,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏠" label="Home" /> }} />
      <Tab.Screen name="Scanner" component={ScannerScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📸" label="Scan" /> }} />
      <Tab.Screen name="Kegel" component={KegelScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🏋️" label="Kegels" /> }} />
      <Tab.Screen name="Recipes" component={RecipesScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🥤" label="Recipes" /> }} />
      <Tab.Screen name="PerformanceLog" component={PerformanceLogScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📊" label="Log" /> }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="GameDay" component={GameDayScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator({ isOnboarded }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="Main" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
