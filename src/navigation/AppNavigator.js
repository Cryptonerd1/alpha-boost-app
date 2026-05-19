/**
 * AppNavigator
 *
 * Root navigation structure.
 * - If the user has not onboarded: show OnboardingScreen first.
 * - Otherwise: show the main tab layout.
 *
 * Tab structure mirrors Cal AI:
 *   Home | Progress | [+ FAB] | Lock | Profile
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import KegelScreen from '../screens/KegelScreen';
import RecipesScreen from '../screens/RecipesScreen';
import PerformanceLogScreen from '../screens/PerformanceLogScreen';
import AlphaLockScreen from '../screens/AlphaLockScreen';
import GameDayScreen from '../screens/GameDayScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import { Colors, Radius } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Tab configuration ─────────────────────────────────────────

const TABS = [
  { name: 'HomeTab',     label: 'Home',     icon: '🏠' },
  { name: 'ProgressTab', label: 'Progress',  icon: '📊' },
  { name: 'ScannerTab',  label: null,        icon: null }, // FAB — handled separately
  { name: 'LockTab',     label: 'Lock',      icon: '🔒' },
  { name: 'ProfileTab',  label: 'Profile',   icon: '👤' },
];

// ─── Custom Tab Bar ────────────────────────────────────────────

/**
 * Renders a floating pill-shaped tab bar with a central FAB (+ button),
 * exactly like Cal AI's bottom navigation.
 */
function CustomTabBar({ state, navigation }) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const isScanner = tab.name === 'ScannerTab';

          const onPress = () => {
            if (!isFocused) navigation.navigate(tab.name);
          };

          // Central FAB (scan button)
          if (isScanner) {
            return (
              <TouchableOpacity key={tab.name} style={styles.fabWrapper} onPress={onPress} activeOpacity={0.85}>
                <View style={styles.fab}>
                  <Text style={styles.fabIcon}>+</Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={tab.name} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
              <Text style={[styles.tabIcon, { opacity: isFocused ? 1 : 0.4 }]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{tab.label}</Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Home stack (nested navigator for drill-down screens) ──────

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Kegel" component={KegelScreen} />
      <Stack.Screen name="Recipes" component={RecipesScreen} />
      <Stack.Screen name="GameDay" component={GameDayScreen} />
    </Stack.Navigator>
  );
}

// ─── Placeholder for Profile screen ───────────────────────────

function ProfileScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>Profile</Text>
      <Text style={styles.placeholderSub}>
        Account sync, settings, and your 30-day report — coming soon.
      </Text>
    </View>
  );
}

// ─── Main Tab Navigator ────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab"     component={HomeStack} />
      <Tab.Screen name="ProgressTab" component={PerformanceLogScreen} />
      <Tab.Screen name="ScannerTab"  component={ScannerScreen} />
      <Tab.Screen name="LockTab"     component={AlphaLockScreen} />
      <Tab.Screen name="ProfileTab"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────────

export default function AppNavigator({ isOnboarded }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Tab bar wrapper — sits above the bottom safe area
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },

  // Floating pill container
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },

  // Individual tab item
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabIcon: { fontSize: 20, marginBottom: 2 },
  tabLabel: { fontSize: 10, fontWeight: '700', color: Colors.grey },
  tabLabelActive: { color: Colors.primary },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },

  // Central FAB
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '300',
    lineHeight: 32,
  },

  // Profile placeholder
  placeholder: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 22,
  },
});
