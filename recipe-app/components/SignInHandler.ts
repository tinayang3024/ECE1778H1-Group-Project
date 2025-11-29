import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { AuthUser } from '../context/AuthContext';

// make it accept a callback coming from the component / screen
export const GoogleSignInHandler = async (
  onSuccess: (session: { user: AuthUser; accessToken: string }) => void,
) => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      console.log('User info:', response);

      const gUser = response.data.user;
      const idToken = response.data.idToken;
      const serverAuthCode = response.data.serverAuthCode;

      const authUser: AuthUser = {
        name: gUser?.name ?? undefined,
        email: gUser?.email,
        picture: gUser?.photo ?? undefined,
      };

      onSuccess({
        user: authUser,
        accessToken: idToken || serverAuthCode || 'google-session',
      });
    } else {
      console.log('Google sign-in cancelled');
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          console.log('Sign-in in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play services not available or outdated');
          break;
        default:
          console.log('Google sign-in error', error);
      }
    } else {
      console.log('Unknown sign-in error', error);
    }
  }
};
