import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CollectedProvider } from '@/context/CollectedContext';
import { NotificationProvider } from '@/context/NotificationContext';
import React from 'react';

function RootNavigation() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CollectedProvider>
        <NotificationProvider>
          <RootNavigation />
          <Stack screenOptions={{ headerShown: false }} />
        </NotificationProvider>
      </CollectedProvider>
    </AuthProvider>
  );
}
