import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationCtx = {
  isOptedIn: boolean;
  permissionStatus: Notifications.PermissionStatus | null;
  expoPushToken?: string;
  enableDailyNotifications: () => Promise<void>;
  disableDailyNotifications: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
};

const STORAGE_KEY_OPTIN = '@notif_opt_in_v1';
const STORAGE_KEY_SCHEDULE_ID = '@notif_schedule_id_v1';
const STORAGE_KEY_PUSH_TOKEN = '@notif_push_token_v1';

const NotificationContext = createContext<NotificationCtx | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOptedIn, setIsOptedIn] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(
    null,
  );
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);

  // Show notifications while app is foregrounded
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,      // replaces shouldShowAlert
        shouldShowList: true,        // recommended to also show in notification center
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  // Initialize: read opt-in and schedule id, register token & channel
  useEffect(() => {
    (async () => {
      try {
        const rawOpt = await AsyncStorage.getItem(STORAGE_KEY_OPTIN);
        if (rawOpt === '1') setIsOptedIn(true);

        // create Android channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
          });
        }

        // get existing permission status
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status);

        // try restore push token if present
        const saved = await AsyncStorage.getItem(STORAGE_KEY_PUSH_TOKEN);
        if (saved) setExpoPushToken(saved);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const requestPermissionsAndGetToken = useCallback(async () => {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    setPermissionStatus(finalStatus);

    if (finalStatus !== 'granted') {
      return undefined;
    }

    // Get Expo push token (useful if you want to send remote pushes)
    if (Device.isDevice) {
      try {
        const tokenObj = await Notifications.getExpoPushTokenAsync();
        const token = tokenObj.data;
        setExpoPushToken(token);
        await AsyncStorage.setItem(STORAGE_KEY_PUSH_TOKEN, token);
        return token;
      } catch {
        return undefined;
      }
    } else {
      // emulator doesn't support push tokens
      return undefined;
    }
  }, []);

  const scheduleDailyAt6pm = useCallback(async () => {
    // cancel previous if exists
    try {
      const prev = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE_ID);
      if (prev) {
        await Notifications.cancelScheduledNotificationAsync(prev);
      }
    } catch {}

    // make sure permission granted
    const permToken = await requestPermissionsAndGetToken();
    if (permissionStatus && permissionStatus !== 'granted' && !permToken) {
      // permission not granted — still allow scheduling local notifications on some platforms
    }

    // schedule local daily notification at 18:00 (6pm)
    const trigger: Notifications.NotificationTriggerInput =
      Platform.OS === 'android'
        ? { hour: 18, minute: 0, repeats: true, channelId: 'daily-reminder' }
        : { hour: 18, minute: 0, repeats: true };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Dinner ideas 🍽️',
        body: 'Check the app for dinner recipe inspirations — tap to explore!',
        data: { screen: '/(tabs)/' },
      },
      trigger,
    });

    await AsyncStorage.setItem(STORAGE_KEY_SCHEDULE_ID, id);
    await AsyncStorage.setItem(STORAGE_KEY_OPTIN, '1');
    setIsOptedIn(true);
  }, [permissionStatus, requestPermissionsAndGetToken]);

  const cancelScheduled = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE_ID);
      if (id) {
        await Notifications.cancelScheduledNotificationAsync(id);
        await AsyncStorage.removeItem(STORAGE_KEY_SCHEDULE_ID);
      }
    } catch {}
    await AsyncStorage.removeItem(STORAGE_KEY_OPTIN);
    setIsOptedIn(false);
  }, []);

  const enableDailyNotifications = useCallback(async () => {
    await scheduleDailyAt6pm();
  }, [scheduleDailyAt6pm]);

  const disableDailyNotifications = useCallback(async () => {
    await cancelScheduled();
  }, [cancelScheduled]);

  const sendTestNotification = useCallback(async () => {
    // send a quick immediate notification (local)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Dinner ideas 🍽️',
        body: 'Check the app for dinner recipe inspirations — tap to explore!',
        data: { screen: '/(tabs)/' },
      },
      trigger: null,
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        isOptedIn,
        permissionStatus,
        expoPushToken,
        enableDailyNotifications,
        disableDailyNotifications,
        sendTestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
