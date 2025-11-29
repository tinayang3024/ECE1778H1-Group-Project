import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useCollected } from '@/context/CollectedContext';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES } from '../../../utils/recipes';
import { mapMealToDetail } from '../../../utils/mealMapper';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export default function RecipeDetailsId() {
  const router = useRouter();
  const navigation = useNavigation();
  const { toggleLike, isCollected } = useCollected();

  const params = useLocalSearchParams();
  const openedFrom = (params as any)?.from;
  const id = typeof params.id === 'string' ? params.id : String(params.id ?? '');

  const [recipe, setRecipe] = useState<any | null>(() => {
    if (!id) return null;
    const local = MOCK_RECIPES.find((r) => r.id === id);
    return local ?? null;
  });
  const [loading, setLoading] = useState<boolean>(!recipe && !!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (navigation as any).setOptions?.({ title: 'Recipe Details' });

    let cancelled = false;

    async function fetchById(mealId: string) {
      setLoading(true);
      setError(null);
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
          mealId,
        )}`;
        const res = await fetch(url);
        const json = await res.json();
        const meal = json?.meals?.[0];
        if (!meal) {
          if (!cancelled) setError('Recipe not found');
          return;
        }

        const mapped = mapMealToDetail(meal);
        if (!cancelled) setRecipe(mapped);
      } catch (e: any) {
        if (!cancelled) setError('Failed to load recipe');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!id) {
      setLoading(false);
    } else if (recipe && recipe.id === id) {
      setLoading(false);
    } else {
      const local = MOCK_RECIPES.find((r) => r.id === id);
      if (local) {
        setRecipe(local);
        setLoading(false);
      } else {
        setRecipe(null);
        fetchById(id);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const collected = recipe ? isCollected(recipe.id) : false;

  const handleShare = async () => {
    if (!recipe) return;

    try {
      const deepLink = Linking.createURL(`/recipe/${recipe.id}`, { scheme: 'recipeapp' });
      const message = `Check out this recipe 🍝: ${recipe.title}\n\n${deepLink}`;

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        console.warn('expo-sharing not available on this device.');
        return;
      }

      const fileUri = FileSystem.cacheDirectory + `recipe-${recipe.id}.txt`;

      await FileSystem.writeAsStringAsync(fileUri, message);

      await Sharing.shareAsync(fileUri, {
        dialogTitle: `Share recipe: ${recipe.title}`,
        mimeType: 'text/plain',
        UTI: 'public.text',
      });

      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    } catch (err) {
      console.log('[RecipeDetails:id] share error', err);
    }
  };

  const handleToggleLike = () => {
    if (!recipe) return;
    toggleLike({
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.image,
      description: recipe.description,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients ?? [],
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Back Button */}
      <Pressable
        style={styles.backButtonFixed}
        onPress={() => {
          if (openedFrom === 'personal') {
            router.replace('/(tabs)/personalCollection');
            return;
          }

          if (navigation && (navigation as any).canGoBack && (navigation as any).canGoBack()) {
            (navigation as any).goBack();
            return;
          }

          router.replace('/(tabs)');
        }}
      >
        <Ionicons name="arrow-back" size={22} color="#0f172a" />
      </Pressable>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator />
          </View>
        ) : error || !recipe ? (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>
              Oops, looks like this recipe is under investigation.
            </Text>
            <Text style={styles.fallbackSub}>Please check back later :)</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {recipe.image ? (
              <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
            ) : null}

            <View style={styles.headerSection}>
              <Text style={styles.title}>{recipe.title}</Text>

              {(() => {
                const parts: string[] = [];
                if (recipe.author) parts.push(recipe.author);
                if (recipe.duration) parts.push(recipe.duration);
                if (typeof recipe.servings !== 'undefined' && recipe.servings !== null)
                  parts.push(`Serves ${recipe.servings}`);
                if (parts.length > 0) return <Text style={styles.meta}>{parts.join(' • ')}</Text>;
                return null;
              })()}

              {recipe.id ? <Text style={styles.small}>ID: {recipe.id}</Text> : null}
            </View>

            {recipe.description || recipe.instructions ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.paragraph}>{recipe.description ?? recipe.instructions}</Text>
              </View>
            ) : null}

            {recipe.ingredients && (recipe.ingredients as any[]).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {(recipe.ingredients as string[]).map((ing: string, idx: number) => (
                  <Text key={idx} style={styles.listItem}>
                    • {ing}
                  </Text>
                ))}
              </View>
            ) : null}

            {recipe.steps && (recipe.steps as any[]).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Steps</Text>
                {((recipe.steps ?? []) as string[]).map((s: string, idx: number) => (
                  <Text key={idx} style={styles.listItem}>
                    {idx + 1}. {s}
                  </Text>
                ))}
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <Pressable
                onPress={handleToggleLike}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
              >
                <Ionicons
                  name={collected ? 'heart' : 'heart-outline'}
                  size={20}
                  color={collected ? '#e02424' : '#0f172a'}
                />
                <Text style={styles.iconButtonText}>{collected ? 'Unlike' : 'Like'}</Text>
              </Pressable>

              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
              >
                <Ionicons name="share-outline" size={20} color="#0f172a" />
                <Text style={styles.iconButtonText}>Share</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f1f5f9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 220,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
    color: '#0f172a',
  },
  meta: {
    color: '#64748b',
    marginBottom: 6,
  },
  small: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 10,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#0f172a',
  },
  paragraph: {
    color: '#1e293b',
    lineHeight: 20,
  },
  listItem: {
    color: '#1e293b',
    marginBottom: 4,
    paddingLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  iconButtonPressed: {
    opacity: 0.85,
  },
  iconButtonText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#0f172a',
  },

  backButtonFixed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 40,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  loadingBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  fallbackContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  fallbackSub: { color: '#64748b', textAlign: 'center' },
});
