import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
  Share,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useCollected } from '@/context/CollectedContext';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES } from '../_mockRecipes';
import { mapMealToDetail } from '../../../utils/mealMapper';
import * as Linking from 'expo-linking';

export default function RecipeDetailsId() {
  const router = useRouter();
  const navigation = useNavigation();
  const { toggleLike, isCollected } = useCollected();

  const params = useLocalSearchParams();
  const openedFrom = (params as any)?.from;
  const id = typeof params.id === 'string' ? params.id : String(params.id ?? '');

  const [recipe, setRecipe] = useState<any | null>(() => {
    if (!id) return null;
    // if it's a locally authored/mock recipe, keep it as-is
    const local = MOCK_RECIPES.find((r) => r.id === id);
    return local ?? null;
  });
  const [loading, setLoading] = useState<boolean>(!recipe && !!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // set a friendly header title
    (navigation as any).setOptions?.({ title: 'Recipe Details' });

    let cancelled = false;

    async function fetchById(mealId: string) {
      console.log('[RecipeDetails:id] fetchById start', mealId);
      console.log('openedFrom this page', openedFrom);
      setLoading(true);
      setError(null);
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`;
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
        console.log('[RecipeDetails:id] fetch error', e);
        if (!cancelled) setError('Failed to load recipe');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // react to id changes: if id corresponds to a local mock, use it; otherwise fetch remote
    console.log('[RecipeDetails:id] effect id=', id, 'currentRecipeId=', recipe?.id);
    if (!id) {
      setLoading(false);
    } else if (recipe && recipe.id === id) {
      setLoading(false);
    } else {
      // try local mock first
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

  function toggleLikeHandler() {
    if (!recipe) return;
    const full = {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.image,
      instructions: recipe.instructions,
    };
    toggleLike(full);
  }

  const handleShare = async () => {
    if (!recipe) return;
    try {
      const deepLink = Linking.createURL(`/recipe/${recipe.id}`, { scheme: 'recipeapp' });
      const message = `Check out this recipe 🍝: ${recipe.title}\n\n${deepLink}`;
      await Share.share({ message, title: `Share recipe: ${recipe.title}` });
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
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          // If we know the details screen was opened from Personal Collection, return there.
          if (openedFrom === 'personal') {
            router.replace('/(tabs)/personalCollection');
            return;
          }

          // Otherwise try to go back in the navigation stack, then fallback to dashboard.
          if (navigation && (navigation as any).canGoBack && (navigation as any).canGoBack()) {
            (navigation as any).goBack();
            return;
          }

          router.replace('/(tabs)');
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>

      {loading ? (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator />
        </View>
      ) : error || !recipe ? (
        // Fallback UI when loading failed or recipe is missing
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>
            Oops, looks like this recipe is under investigation.
          </Text>
          <Text style={styles.fallbackSub}>Please check back later :)</Text>
        </View>
      ) : (
        <>
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
          ) : null}

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

          {recipe.description || recipe.instructions ? (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.paragraph}>{recipe.description ?? recipe.instructions}</Text>
            </>
          ) : null}

          {recipe.ingredients && (recipe.ingredients as any[]).length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {(recipe.ingredients as string[]).map((ing: string, idx: number) => (
                <Text key={idx} style={styles.listItem}>
                  • {ing}
                </Text>
              ))}
            </>
          ) : null}

          {recipe.steps && (recipe.steps as any[]).length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Steps</Text>
              {((recipe.steps ?? []) as string[]).map((s: string, idx: number) => (
                <Text key={idx} style={styles.listItem}>
                  {s}
                </Text>
              ))}
            </>
          ) : null}
        </>
      )}

      <View style={styles.actionRow}>
        <Pressable
          onPress={handleToggleLike}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel={collected ? 'Unlike recipe' : 'Like recipe'}
          testID={`like-button-${recipe?.id ?? 'noid'}`}
        >
          <Ionicons
            name={collected ? 'heart' : 'heart-outline'}
            size={20}
            color={collected ? '#e02424' : '#333'}
          />
          <Text style={styles.iconButtonText}>{collected ? 'Unlike' : 'Like'}</Text>
        </Pressable>

        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Share recipe link"
          testID={`share-button-${recipe?.id ?? 'noid'}`}
        >
          <Ionicons name="share-outline" size={20} color="#333" />
          <Text style={styles.iconButtonText}>Share</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>TODO: centralize mapping & persist collections</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  meta: { color: '#666', marginBottom: 12 },
  sectionTitle: { marginTop: 12, fontWeight: '600' },
  paragraph: { marginTop: 6, color: '#333' },
  listItem: { marginTop: 6, color: '#333' },
  note: { marginTop: 16, color: '#666', fontSize: 12 },
  small: { color: '#888', fontSize: 12, marginBottom: 8 },
  buttonRow: { marginTop: 12 },
  backButton: { padding: 6, borderRadius: 20, backgroundColor: '#f3f4f6' },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12 },
  fallbackContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fallbackTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  fallbackSub: { color: '#666', textAlign: 'center' },
  actionRow: { flexDirection: 'row', marginTop: 12 },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  iconButtonPressed: { opacity: 0.85 },
  iconButtonText: { marginLeft: 8, fontWeight: '600' },
});
