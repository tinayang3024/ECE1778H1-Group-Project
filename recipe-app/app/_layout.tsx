import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CollectedProvider } from '@/context/CollectedContext';
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
        <RootNavigation />
        <Stack screenOptions={{ headerShown: false }} />
        {children}
      </CollectedProvider>
    </AuthProvider>
  );
}
