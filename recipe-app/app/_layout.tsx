// import { Stack } from "expo-router";
// import { AuthProvider, useAuth } from "../contexts/AuthContext";
// import React from "react";

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//     </AuthProvider>
//   );
// }

import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React from 'react';

function RootNavigation() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
