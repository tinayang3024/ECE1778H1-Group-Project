import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { TAB_ICON_SIZE } from '@/utils/constants';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {/* Left tab — Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="newRecipe"
        options={{
          title: '',
          tabBarLabel: '',
          tabBarIcon: () => null, 
          tabBarButton: () => (
            <Pressable
              onPress={() => router.push('/newRecipe')}
              style={({ pressed }) => [
                styles.plusButtonContainer,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.plusButton}>
                <FontAwesome6 name="add" size={28} color="#fff" />
              </View>
            </Pressable>
          ),
        }}
      />

      {/* Right tab — Profile */}
      <Tabs.Screen
        name="personal"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />

      {/* Hidden routes */}
      <Tabs.Screen
        name="recipeDetails/[id]"
        options={{
          href: null,
          title: 'Recipe Details',
        }}
      />
      <Tabs.Screen
        name="personalCollection"
        options={{
          href: null,
          title: 'Personal Collection',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -18, // lift above the tab bar
  },
  plusButton: {
    width: 58,
    height: 58,
    borderRadius: 32,
    backgroundColor: '#2563eb', // blue – change if needed
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});
