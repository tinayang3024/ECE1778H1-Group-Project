import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // 👈 Add Expo Icons
import RecipeDisplayList from '@/components/RecipeDisplayList';
import { MOCK_RECIPE_LIST } from '@/utils/mockData';

export default function TabDashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipes</Text>

        {/* Icon Button — floating style but aligned with header */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.push('/(tabs)/newRecipe')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Separator */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Recipe List */}
      <View style={{ flex: 1 }}>
        <RecipeDisplayList data={MOCK_RECIPE_LIST} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  addButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
  },
});
