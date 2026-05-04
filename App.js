import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import KegelScreen from './src/screens/KegelScreen';
import GameDayScreen from './src/screens/GameDayScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import PerformanceLogScreen from './src/screens/PerformanceLogScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const GREEN = '#22c55e';

function TabIcon({ focused, emoji, label }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
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
          height: 76,
          paddingBottom: 12,
          paddingTop: 4,
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
      <Stack.Screen name="GameDay" component={GameDayScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_complete').then(val => {
      setIsOnboarded(val === 'true');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#0a0a0a', letterSpacing: -1 }}>
          Alpha<Text style={{ color: GREEN }}>Boost</Text>
        </Text>
        <ActivityIndicator color={GREEN} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isOnboarded && (
            <Stack.Screen name="Onboarding">
              {props => <OnboardingScreen {...props} />}
            </Stack.Screen>
          )}
          <Stack.Screen name="Main" component={MainStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
