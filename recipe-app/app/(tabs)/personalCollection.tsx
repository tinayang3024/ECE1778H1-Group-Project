import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { useCollected } from '@/context/CollectedContext';
import { MOCK_RECIPES } from './_mockRecipes';
import RecipeDisplayWrapper from '@/components/RecipeDisplayWrapper';
import { Ionicons } from '@expo/vector-icons';

export default function TabPersonalCollectionScreen() {
  const router = useRouter();
  const { collected } = useCollected();

  const data = (collected ?? []).map((c) => {
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
    const local = MOCK_RECIPES.find((r) => r.id === c.id);
    if (local) {
      return {
        id: local.id,
        title: local.title,
        category: 'User Recipe',
        area: local.author ?? '',
        instructions: local.steps ? local.steps.join('\n') : (local.description ?? ''),
        tags: [],
        imageUrl: local.image ?? '',
        youtubeUrl: '',
        ingredients: (local.ingredients ?? []).map((ing) => ({ ingredient: ing, measure: '' })),
        dateModified: undefined,
      };
    }
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
    <View style={{ flex: 1 }}>
      {/* Fixed Back Button */}
      <Pressable style={styles.backButtonFixed} onPress={() => router.replace('/(tabs)/personal')}>
        <Ionicons name="arrow-back" size={22} color="#0f172a" />
      </Pressable>

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
    paddingTop: 80, // leave space for the fixed button
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },

  /* --- FIXED BACK BUTTON --- */
  backButtonFixed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 40, // safe for iOS notch
    left: 16,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  listWrapper: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    paddingVertical: 8,
    paddingTop: 80,
  },

  emptyCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 80,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
  },
});
