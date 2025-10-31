import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Pressable, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPE } from '@/utils/mockData';
import * as Linking from 'expo-linking';

// TODO: later accept recipe id via route params and fetch real recipe data.
const SAMPLE_RECIPE = {
  id: 'sample-1',
  title: 'Sample Tomato Pasta',
  author: 'Demo Chef',
  duration: '20 mins',
  servings: 2,
  description: 'A simple tomato pasta perfect for a quick dinner.',
  ingredients: ['200g pasta', '2 tomatoes', '1 clove garlic', 'Olive oil', 'Salt', 'Pepper'],
  steps: ['Boil pasta', 'Make sauce', 'Combine and serve'],
};

export default function RecipeDetails() {
  const router = useRouter();
  const { toggleLike, isCollected } = useAuth();

  const collected = isCollected(SAMPLE_RECIPE.id);

  function toggleLikeHandler() {
    toggleLike({
      id: SAMPLE_RECIPE.id,
      title: SAMPLE_RECIPE.title,
      duration: SAMPLE_RECIPE.duration,
    });
  }

  const handleShare = async () => {
    try {
      const deepLink = Linking.createURL(`/recipe/${MOCK_RECIPE.id}`, {
        scheme: 'recipeapp',
      });

      const message = `Check out this recipe 🍝: ${MOCK_RECIPE.title}\n\n${deepLink}`;

      await Share.share({
        message,
        title: `Share recipe: ${MOCK_RECIPE.title}`,
      });
    } catch (err) {
      console.log('share error', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)')} // unchanged
        android_ripple={{ color: '#ccc', borderless: true }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>

      <Text style={styles.title}>{SAMPLE_RECIPE.title}</Text>
      <Text style={styles.meta}>
        {SAMPLE_RECIPE.author} • {SAMPLE_RECIPE.duration} • Serves {SAMPLE_RECIPE.servings}
      </Text>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.paragraph}>{SAMPLE_RECIPE.description}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {SAMPLE_RECIPE.ingredients.map((ing, idx) => (
        <Text key={idx} style={styles.listItem}>
          • {ing}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Steps</Text>
      {SAMPLE_RECIPE.steps.map((s, idx) => (
        <Text key={idx} style={styles.listItem}>
          {idx + 1}. {s}
        </Text>
      ))}

      <View style={styles.buttonRow}>
        <Button title={collected ? 'Unlike Recipe' : 'Like Recipe'} onPress={toggleLikeHandler} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Share Recipe Link" onPress={handleShare} />
      </View>

      <Text style={styles.note}>TODO: wire real recipes and route params (recipe id)</Text>
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
  buttonRow: { marginTop: 12 },
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
});
