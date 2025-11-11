import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { GoogleSignInHandler } from '../components/SignInHandler';

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
  const onPressGoogle = async () => {
    await GoogleSignInHandler(login);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <GoogleSigninButton onPress={onPressGoogle} />
    </View>
  );
}

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
