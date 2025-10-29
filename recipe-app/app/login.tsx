import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
  AuthSessionResult,
} from 'expo-auth-session';
import { useAuth } from '../context/AuthContext';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GoogleSignInHelper from '@/components/SignIn';

const GOOGLE_CLIENT_ID_WEBAPP =
  '590532636165-qup3d4tbpbl7fe255edokd2snr88sqid.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_IOS =
  '590532636165-2cu1n0n22kg3i34gc6aqfgbm3kuj1gtj.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID_WEBAPP,
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: GOOGLE_CLIENT_ID_IOS,
});
// doc: https://react-native-google-signin.github.io/docs/setting-up/expo
// tutorial: https://www.youtube.com/watch?v=u9I54N80oBo
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login } = useAuth();

  // // 1. Your Google OAuth "Web application" client ID
  // const GOOGLE_CLIENT_ID_WEBAPP =
  //   '590532636165-qup3d4tbpbl7fe255edokd2snr88sqid.apps.googleusercontent.com';
  // const GOOGLE_CLIENT_ID_IOS =
  //   '590532636165-2cu1n0n22kg3i34gc6aqfgbm3kuj1gtj.apps.googleusercontent.com';

  // // 2. Redirect URI (must be whitelisted in Google Cloud console)
  // // @ts-ignore
  // const redirectUri = makeRedirectUri({ useProxy: true });
  // console.log('Auth redirect URI (add this to Google Cloud):', redirectUri);
  // console.log('hello?:', redirectUri);

  // // 3. Build the auth request
  // const [request, response, promptAsync] = useAuthRequest(
  //   {
  //     clientId: GOOGLE_CLIENT_ID_WEBAPP,
  //     responseType: ResponseType.Token, // implicit flow with access_token
  //     scopes: ['openid', 'email', 'profile'],
  //     redirectUri,
  //   },
  //   {
  //     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  //   },
  // );

  // // Fetch Google profile with the returned token
  // const finalizeLogin = useCallback(
  //   async (accessToken: string) => {
  //     try {
  //       const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });

  //       const data = await profileRes.json();

  //       login({
  //         user: {
  //           name: data.name,
  //           email: data.email,
  //           picture: data.picture,
  //         },
  //         accessToken,
  //       });
  //     } catch (err) {
  //       console.warn('Failed to fetch Google user info:', err);
  //     }
  //   },
  //   [login],
  // );

  // // 4. When the auth flow completes, response will update
  // useEffect(() => {
  //   const handleAuthResponse = async (res: AuthSessionResult | null) => {
  //     if (!res || res.type !== 'success') return;
  //     const accessToken = (res.params as any)?.access_token;
  //     if (accessToken) {
  //       await finalizeLogin(accessToken);
  //     }
  //   };
  //   handleAuthResponse(response);
  // }, [response, finalizeLogin]);

  // // 5. Start login when button pressed
  // const handleGoogleLogin = async () => {
  //   if (!request) return;
  //   // With your current SDK/types: just call promptAsync() naked.
  //   // No { useProxy } — not supported in your version.
  //   // @ts-expect-error useProxy is missing from types
  //   await promptAsync({ useProxy: true });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <GoogleSigninButton onPress={GoogleSignInHelper} />
      {/* <Pressable
        style={({ pressed }) => [
          styles.googleButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        ]}
        disabled={!request}
        onPress={handleGoogleLogin}
      >
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>

      {!request && (
        <View style={{ marginTop: 16 }}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Preparing sign-in…</Text>
        </View>
      )}

      <Text style={styles.footerNote}>
        We use Google Sign-In to create your session. No password is stored.
      </Text> */}
    </View>
  );
}

// same styles you already had:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerNote: {
    marginTop: 24,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 16,
  },
});
