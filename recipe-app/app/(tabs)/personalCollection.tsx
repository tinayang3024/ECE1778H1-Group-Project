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
        <View style={styles.empty}>
          <Text style={styles.emptyText}>You haven't liked any recipes yet.</Text>
        </View>
      ) : (
        <RecipeDisplayWrapper data={data} />
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
});
