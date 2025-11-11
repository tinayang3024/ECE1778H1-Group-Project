// app/(tabs)/personalCollection.tsx
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RecipeDisplayList from '@/components/RecipeDisplayList';
import { MOCK_RECIPE_LIST } from '@/utils/mockData';
import { useCollected } from '@/context/CollectedContext';
import { MOCK_RECIPES } from './_mockRecipes';
import RecipeDisplayWrapper from '@/components/RecipeDisplayWrapper';

export default function TabPersonalCollectionScreen() {
  const router = useRouter();
  const { collected } = useCollected();

  const data = (collected ?? []).map((c) => {
    // if we have a full collected item with image, use it directly
    if (c.imageUrl) {
      return {
        id: c.id,
        title: c.title ?? 'Saved recipe',
        category: '',
        area: '',
        instructions: c.instructions ?? '',
        tags: [],
        imageUrl: c.imageUrl,
        youtubeUrl: '',
        ingredients: (c.ingredients ?? []).map((ing) => ({ ingredient: ing, measure: '' })),
        dateModified: undefined,
      };
    }
    // fallback to local mock if present
    const local = MOCK_RECIPES.find((r) => r.id === c.id);
    if (local) {
      return {
        id: local.id,
        title: local.title,
        category: 'User Recipe',
        area: local.author ?? '',
        instructions: local.steps ? local.steps.join('\n') : local.description ?? '',
        tags: [],
        imageUrl: local.image ?? '',
        youtubeUrl: '',
        ingredients: (local.ingredients ?? []).map((ing) => ({ ingredient: ing, measure: '' })),
        dateModified: undefined,
      };
    }
    // minimal placeholder (should be rare now that we store full item on like)
    return {
      id: c.id,
      title: c.title ?? 'Saved recipe',
      category: '',
      area: '',
      instructions: '',
      tags: [],
      imageUrl: '',
      youtubeUrl: '',
      ingredients: [],
      dateModified: undefined,
    };
  });

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>No liked recipes yet</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring and tap ❤️ on your favorite dishes!
          </Text>
        </View>
      ) : (
        <View style={styles.listWrapper}>
          <RecipeDisplayWrapper data={data} />
        </View>
      )}
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
  listWrapper: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    paddingVertical: 8,
  },
  emptyCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 60,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },
});
