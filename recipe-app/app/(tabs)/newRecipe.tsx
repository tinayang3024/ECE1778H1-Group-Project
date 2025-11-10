import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image as RNImage } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES, addMockRecipe, type Recipe } from './_mockRecipes';
import { useCollected } from '@/context/CollectedContext';
// Use a local asset as the default image. Make sure the file exists at the path below.
const DEFAULT_IMAGE_ASSET = require('../../assets/images/kitchen.jpg');
const DEFAULT_IMAGE_URL = RNImage.resolveAssetSource(DEFAULT_IMAGE_ASSET).uri;

// Simple in-memory form for creating a recipe. This is intentionally lightweight and
// uses local component state. Integrate with backend / context once available.
// TODO: replace with form validation, image upload, and API persistence.
export default function NewRecipe() {
  const router = useRouter();
  const { toggleLike } = useCollected();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [duration, setDuration] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState(''); // newline-separated
  const [steps, setSteps] = useState(''); // newline-separated
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  // errors for required fields (description allowed empty)
  const [errors, setErrors] = useState<{
    title?: string | null;
    author?: string | null;
    duration?: string | null;
    servings?: string | null;
    ingredients?: string | null;
    steps?: string | null;
  }>({});

  // validate servings: must be a positive integer (e.g. "1", "2", ...)
  function validateServingsValue(value: string) {
    if (!value) return 'Servings is required';
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      return 'Servings must be a whole positive number';
    }
    const n = parseInt(trimmed, 10);
    if (Number.isNaN(n) || n <= 0) {
      return 'Servings must be greater than zero';
    }
    return null;
  }

  function validateAll() {
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'Title is missing';
    if (!author.trim()) next.author = 'Author is missing';
    if (!duration.trim()) next.duration = 'Duration is missing';
    const srvErr = validateServingsValue(servings);
    if (srvErr) next.servings = srvErr;
    const ingList = ingredients.split('\n').map((s) => s.trim()).filter(Boolean);
    if (ingList.length === 0) next.ingredients = 'Don\'t forget to add ingredients!';
    const stepList = steps.split('\n').map((s) => s.trim()).filter(Boolean);
    if (stepList.length === 0) next.steps = 'Don\'t forget to add steps!';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSave() {
    const ok = validateAll();
    if (!ok) {
      // don't proceed if validation fails
      return;
    }

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
      author: author || 'Anonymous user',
      image: DEFAULT_IMAGE_URL,
      duration: duration || undefined,
      servings: servings ? parseInt(servings, 10) : undefined,
      description: description || undefined,
      ingredients: ingredientList.length > 0 ? ingredientList : [],
      steps: stepList.length > 0 ? stepList : [],
    };

    // Insert at the front and persist user-created recipes to AsyncStorage
    addMockRecipe(newRecipe).catch(() => {
      // best-effort: if persistence fails, still keep in-memory
      MOCK_RECIPES.unshift(newRecipe);
    });

    // Add to user's collected items by default (mark as liked)
    try {
      toggleLike({
        id: newRecipe.id,
        title: newRecipe.title,
        imageUrl: newRecipe.image,
        description: newRecipe.description,
        instructions: newRecipe.steps.join('\n'),
        ingredients: newRecipe.ingredients,
      });
    } catch (e) {
      // ignore if provider not ready
    }
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
    setErrors({});
  }

  // helper to compute form validity for disabling Save button
  const isFormValid = () => {
    if (saved) return false;
    if (!title.trim()) return false;
    if (!author.trim()) return false;
    if (!duration.trim()) return false;
    if (!servings.trim()) return false;
    if (!ingredients.split('\n').map((s) => s.trim()).filter(Boolean).length) return false;
    if (!steps.split('\n').map((s) => s.trim()).filter(Boolean).length) return false;
    if (validateServingsValue(servings)) return false;
    return true;
  };

  return saved ? (
    <View style={styles.successContainer}>
      <Pressable style={styles.backButtonTop} onPress={resetForm} android_ripple={{ color: '#eee' }}>
        <Ionicons name="arrow-back" size={22} color="#333" />
      </Pressable>
      <Ionicons name="checkmark-circle" size={140} color="#10b981" />
      <Text style={styles.successTitle}>Recipe saved!</Text>
      <Text style={styles.successSub}>Your recipe has been added to your collection.</Text>
      <Text style={{ marginTop: 8, color: '#666', textAlign: 'center' }}>
        You can now view the recipe in your personal collection!
      </Text>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)')}
        android_ripple={{ color: '#ccc', borderless: true }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>
      <Text style={styles.title}>Create a New Recipe</Text>

      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={(val) => { setTitle(val); setErrors((e) => ({ ...e, title: val.trim() ? null : 'Title is required' })); }} />
      {errors.title ? <Text style={styles.errText}>{errors.title}</Text> : null}

      <TextInput
        placeholder="Short description (optional)"
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput placeholder="Author" style={styles.input} value={author} onChangeText={(val) => { setAuthor(val); setErrors((e) => ({ ...e, author: val.trim() ? null : 'Author is required' })); }} />
      {errors.author ? <Text style={styles.errText}>{errors.author}</Text> : null}

      <TextInput placeholder="Duration (e.g. 20 mins)" style={styles.input} value={duration} onChangeText={(val) => { setDuration(val); setErrors((e) => ({ ...e, duration: val.trim() ? null : 'Duration is required' })); }} />
      {errors.duration ? <Text style={styles.errText}>{errors.duration}</Text> : null}

      <TextInput
        placeholder="Servings (number)"
        style={styles.input}
        value={servings}
        onChangeText={(val) => {
          setServings(val);
          const srvErr = validateServingsValue(val) as string | null;
          setErrors((e) => ({ ...e, servings: srvErr }));
        }}
        keyboardType="numeric"
      />
      {errors.servings ? <Text style={styles.errText}>{errors.servings}</Text> : null}

      <Text style={{ marginTop: 8, marginBottom: 6, fontWeight: '600' }}>Ingredients</Text>
      <TextInput
        placeholder="e.g. 200g spaghetti"
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        value={ingredients}
        onChangeText={(val) => {
          setIngredients(val);
          const lst = val.split('\n').map((s) => s.trim()).filter(Boolean);
          setErrors((e) => ({ ...e, ingredients: lst.length ? null : 'Please provide at least one ingredient' }));
        }}
        multiline
      />
      {errors.ingredients ? <Text style={styles.errText}>{errors.ingredients}</Text> : null}

      <Text style={{ marginTop: 8, marginBottom: 6, fontWeight: '600' }}>Steps</Text>
      <TextInput
        placeholder="e.g. Mix the ingredients..."
        style={[styles.input, { height: 140, textAlignVertical: 'top' }]}
        value={steps}
        onChangeText={(val) => {
          setSteps(val);
          const lst = val.split('\n').map((s) => s.trim()).filter(Boolean);
          setErrors((e) => ({ ...e, steps: lst.length ? null : 'Please provide at least one step' }));
        }}
        multiline
      />
      {errors.steps ? <Text style={styles.errText}>{errors.steps}</Text> : null}

      <View style={styles.buttonRow}>
        <Pressable
          onPress={onSave}
          disabled={!isFormValid()}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            !isFormValid() && styles.saveButtonDisabled,
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
  errText: {
    color: 'red',
    marginBottom: 8,
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
