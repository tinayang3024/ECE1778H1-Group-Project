import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image as RNImage } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES, type Recipe } from './_mockRecipes';
// Use a local asset as the default image. Make sure the file exists at the path below.
const DEFAULT_IMAGE_ASSET = require('../../assets/images/kitchen.jpg');
const DEFAULT_IMAGE_URL = RNImage.resolveAssetSource(DEFAULT_IMAGE_ASSET).uri;

// Simple in-memory form for creating a recipe. This is intentionally lightweight and
// uses local component state. Integrate with backend / context once available.
// TODO: replace with form validation, image upload, and API persistence.
export default function NewRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // keep a local image state as a harmless fallback in case old bundles reference it
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [duration, setDuration] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState(''); // newline-separated
  const [steps, setSteps] = useState(''); // newline-separated
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  function onSave() {
    // Build a Recipe object from form values and append to in-memory MOCK_RECIPES.
    const newId = String(Date.now());

    const ingredientList = ingredients
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const stepList = steps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newRecipe: Recipe = {
      id: newId,
      title: title || 'Untitled Recipe',
      author: author || 'You',
      image: DEFAULT_IMAGE_URL,
      duration: duration || undefined,
      servings: servings ? parseInt(servings, 10) : undefined,
      description: description || undefined,
      ingredients: ingredientList.length > 0 ? ingredientList : [],
      steps: stepList.length > 0 ? stepList : [],
    };

    // Insert at the front so it's immediately visible in lists
    MOCK_RECIPES.unshift(newRecipe);
    console.log('Saved mock recipe:', newRecipe);
    // mark saved and show success UI (we keep recipe in MOCK_RECIPES)
    setSaved(true);
    setSavedId(newId);
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setImage('');
    setAuthor('');
    setDuration('');
    setServings('');
    setIngredients('');
    setSteps('');
    setSaved(false);
    setSavedId(null);
  }

  return saved ? (
    <View style={styles.successContainer}>
      <Pressable style={styles.backButtonTop} onPress={resetForm} android_ripple={{ color: '#eee' }}>
        <Ionicons name="arrow-back" size={22} color="#333" />
      </Pressable>
      <Ionicons name="checkmark-circle" size={140} color="#10b981" />
      <Text style={styles.successTitle}>Recipe saved!</Text>
      <Text style={styles.successSub}>Your recipe has been added to your collection.</Text>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)')} // fix this line
        android_ripple={{ color: '#ccc', borderless: true }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>
      <Text style={styles.title}>Create a New Recipe</Text>
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Short description"
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
  <TextInput placeholder="Author (optional)" style={styles.input} value={author} onChangeText={setAuthor} />
      <TextInput placeholder="Duration (e.g. 20 mins)" style={styles.input} value={duration} onChangeText={setDuration} />
      <TextInput placeholder="Servings (number)" style={styles.input} value={servings} onChangeText={setServings} keyboardType="numeric" />

      <Text style={{ marginTop: 8, marginBottom: 6, fontWeight: '600' }}>Ingredients (one per line)</Text>
      <TextInput
        placeholder="e.g. 200g spaghetti"
        style={[styles.input, { height: 120 }]}
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      <Text style={{ marginTop: 8, marginBottom: 6, fontWeight: '600' }}>Steps (one per line)</Text>
      <TextInput
        placeholder="Step 1\nStep 2\nStep 3"
        style={[styles.input, { height: 140 }]}
        value={steps}
        onChangeText={setSteps}
        multiline
      />
      <View style={styles.buttonRow}>
        <Pressable
          onPress={onSave}
          disabled={!title.trim()}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            !title.trim() && styles.saveButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save recipe"
        >
          <Text style={styles.saveButtonText}>{'Save Recipe'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonRow: {
    marginTop: 8,
    marginBottom: 12,
  },
  help: {
    color: '#666',
    fontSize: 12,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#FF7A59',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonDisabled: {
    backgroundColor: '#ddd',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonTop: {
    position: 'absolute',
    left: 18,
    top: 18,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  successTitle: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: '700',
  },
  successSub: {
    marginTop: 6,
    color: '#666',
    textAlign: 'center',
  },
});
