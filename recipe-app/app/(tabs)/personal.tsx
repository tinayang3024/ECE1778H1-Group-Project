import { Text, View } from '@/components/Themed';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCollected } from '@/context/CollectedContext';
import { useNotifications } from '@/context/NotificationContext';
import { Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabPersonalScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { collected } = useCollected();
  const {
    isOptedIn,
    enableDailyNotifications,
    disableDailyNotifications,
    sendTestNotification,
    permissionStatus,
  } = useNotifications();

  const collectedCount = (collected ?? []).length;

  const displayName = user?.name ?? 'Guest';
  const displayEmail = user?.email ?? 'No email';
  const displayPhoto =
    user?.picture ?? 'https://ui-avatars.com/api/?name=User&background=E2E8F0&color=0F172A';

  // Handle sign-out with confirmation
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout(); // clear session in AuthContext
            router.replace('/login'); // go back to login screen
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: displayPhoto }} style={styles.avatar} />

        <View style={styles.profileText}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
          <Text style={styles.subtle}>Collected recipes: {collectedCount}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.primaryBtn]}
          onPress={() => router.push('/(tabs)/personalCollection')}
        >
          <Text style={styles.primaryBtnText}>View My Collection</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity style={[styles.actionBtn, styles.logoutBtn]} onPress={handleSignOut}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text>Daily recipe reminder</Text>
          <Switch
            value={!!isOptedIn}
            onValueChange={async (val) => {
              if (val) {
                await enableDailyNotifications();
              } else {
                await disableDailyNotifications();
              }
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {/* uncomment for notification demo */}
          {/* <Pressable
            onPress={() => sendTestNotification()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, padding: 8, flexDirection: 'row', alignItems: 'center' }]}
          >
            <Ionicons name="send" size={20} color="#111" />
            <Text style={{ marginLeft: 8 }}>Test Notification (Demo Only)</Text>
          </Pressable> */}
          <Text style={{ marginLeft: 8, color: '#666' }}>
            {/* uncomment for notification permission */}
            {/* Permission: {permissionStatus ?? 'unknown'} */}
          </Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 72;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#e2e8f0',
  },
  profileText: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
  },
  subtle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actions: {
    gap: 12,
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#1e90ff',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#e2e8f0',
  },
  secondaryBtnText: {
    color: '#0f172a',
    fontWeight: '500',
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
});
