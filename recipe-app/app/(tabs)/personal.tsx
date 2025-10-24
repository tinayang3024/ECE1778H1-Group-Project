import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

// Personal profile page: shows user info and number of collected recipes.
// Clicking "View Collection" takes the user to the personalCollection screen.
export default function TabPersonalScreen() {
  const router = useRouter();
  const { collectedCount } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text style={styles.stat}>Collected recipes: {collectedCount}</Text>

      <View style={styles.buttonRow}>
        <Button title="View Collection" onPress={() => router.push('/(tabs)/personalCollection')} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Create New Recipe" onPress={() => router.push('/(tabs)/newRecipe')} />
      </View>

      <EditScreenInfo path="app/(tabs)/personal.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  separator: { marginVertical: 8, height: 1, width: '100%' },
  stat: { fontSize: 16, marginBottom: 12 },
  buttonRow: { marginVertical: 6 },
});
