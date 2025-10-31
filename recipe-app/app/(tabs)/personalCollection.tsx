// app/(tabs)/personalCollection.tsx
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RecipeDisplayList from '@/components/RecipeDisplayList';
import { MOCK_RECIPE_LIST } from '@/utils/mockData';

export default function TabPersonalCollectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* 👈 Go Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/personal')}
          android_ripple={{ color: '#ccc', borderless: true }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>

        <Text style={styles.headerTitle}>Recipe Collection</Text>
        {/* Invisible placeholder to keep title centered */}
        <View style={{ width: 24 }} />
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
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
  },
});
