// // app/_layout.tsx
// import React from 'react';
// import { Stack, Redirect } from 'expo-router';
// import { AuthProvider, useAuth } from '../context/AuthContext';

// function AuthenticatedOrNot() {
//   const { isLoggedIn, user } = useAuth();
//   console.log('isLoggedIn in layout:', isLoggedIn);
//   console.log('user in layout:', user);

//   // if NOT logged in → show the auth stack (login, maybe register)
//   if (!isLoggedIn) {
//     return (
//       <Stack screenOptions={{ headerShown: false }}>
//         {/* this will render app/login.tsx when you navigate to /login */}
//         <Stack.Screen name="login" />
//       </Stack>
//     );
//   }

//   // if logged in → push them into tabs layout
//   // return <Redirect href="/(tabs)" />;
//   return <Redirect href="/(tabs)" />;
//   // return <Redirect href="/login" />;
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <AuthenticatedOrNot />
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
