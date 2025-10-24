// components/RecipeDisplayItem.tsx
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipeData } from '../utils/types';

type Props = {
  recipe: RecipeData;
};

// const FALLBACK_IMG =
//   "https://via.placeholder.com/80x80.png?text=Recipe"; // optional placeholder

export default function RecipeDisplayItem({ recipe }: Props) {
  const router = useRouter();

  const onPress = () => {
    // Navigate to your details screen; pass id (and optionally serialize minimal data)
    router.push({
      pathname: '/(tabs)/recipeDetails',
      params: { id: recipe.id },
    });
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.85, transform: [{ scale: 0.995 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open recipe ${recipe.title}`}
      testID={`recipe-item-${recipe.id}`}
    >
      <Image source={{ uri: recipe.imageUrl }} style={styles.thumb} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {recipe.category}
        </Text>

        <Text style={styles.instructions} numberOfLines={3} ellipsizeMode="tail">
          {recipe.instructions}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 6,
    marginHorizontal: 12,
    gap: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
  },
  instructions: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
  },
});
