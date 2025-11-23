import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image as RNImage,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_RECIPES, addMockRecipe, type Recipe } from './_mockRecipes';
import { useCollected } from '@/context/CollectedContext';

const DEFAULT_IMAGE_ASSET = require('../../assets/images/kitchen.jpg');
const DEFAULT_IMAGE_URL = RNImage.resolveAssetSource(DEFAULT_IMAGE_ASSET).uri;

export default function NewRecipe() {
  const router = useRouter();
  const { toggleLike } = useCollected();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [duration, setDuration] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  const [errors, setErrors] = useState({} as any);

  function validateServingsValue(value: string) {
    if (!value) return 'Servings is required';
    if (!/^\d+$/.test(value.trim())) return 'Servings must be a whole number';
    return null;
  }

  function validateAll() {
    const next: any = {};
    if (!title.trim()) next.title = 'Title is required';
    if (!author.trim()) next.author = 'Author is required';
    if (!duration.trim()) next.duration = 'Duration is required';
    const srvErr = validateServingsValue(servings);
    if (srvErr) next.servings = srvErr;

    const ingList = ingredients
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const stepList = steps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (ingList.length === 0) next.ingredients = 'Add at least one ingredient';
    if (stepList.length === 0) next.steps = 'Add at least one step';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetFormAndExit() {
    setTitle('');
    setDescription('');
    setAuthor('');
    setDuration('');
    setServings('');
    setIngredients('');
    setSteps('');
    setErrors({});
    router.replace('/(tabs)');
  }

  async function onSave() {
    if (!validateAll()) return;

    const newId = String(Date.now());

    const newRecipe: Recipe = {
      id: newId,
      title: title.trim(),
      author: author.trim(),
      image: DEFAULT_IMAGE_URL,
      duration: duration.trim(),
      servings: servings ? parseInt(servings, 10) : undefined,
      description: description || undefined,
      ingredients: ingredients
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      steps: steps
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await addMockRecipe(newRecipe);
    } catch {
      MOCK_RECIPES.unshift(newRecipe);
    }

    try {
      toggleLike({
        id: newRecipe.id,
        title: newRecipe.title,
        imageUrl: newRecipe.image,
        description: newRecipe.description,
        instructions: newRecipe.steps.join('\n'),
        ingredients: newRecipe.ingredients,
      });
    } catch {}

    resetFormAndExit();
  }

  const isFormValid = () => {
    if (!title.trim()) return false;
    if (!author.trim()) return false;
    if (!duration.trim()) return false;
    if (!servings.trim() || validateServingsValue(servings)) return false;
    if (!ingredients.split('\n').map((s) => s.trim()).filter(Boolean).length) return false;
    if (!steps.split('\n').map((s) => s.trim()).filter(Boolean).length) return false;
    return true;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Create a New Recipe</Text>

      {/* FORM CARD */}
      <View style={styles.card}>
        <TextInput
          placeholder="Recipe Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errText}>{errors.title}</Text>}

        <TextInput
          placeholder="Short Description (optional)"
          style={[styles.input, { height: 80 }]}
          value={description}
          multiline
          onChangeText={setDescription}
        />

        <TextInput
          placeholder="Author"
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        {errors.author && <Text style={styles.errText}>{errors.author}</Text>}

        <TextInput
          placeholder="Duration (e.g. 20 mins)"
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
        />
        {errors.duration && <Text style={styles.errText}>{errors.duration}</Text>}

        <TextInput
          placeholder="Servings (e.g. 2)"
          style={styles.input}
          value={servings}
          onChangeText={setServings}
          keyboardType="numeric"
        />
        {errors.servings && <Text style={styles.errText}>{errors.servings}</Text>}

        <Text style={styles.sectionLabel}>Ingredients</Text>
        <TextInput
          placeholder="One per line..."
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />
        {errors.ingredients && <Text style={styles.errText}>{errors.ingredients}</Text>}

        <Text style={styles.sectionLabel}>Steps</Text>
        <TextInput
          placeholder="Step-by-step instructions..."
          style={[styles.input, styles.textArea]}
          value={steps}
          onChangeText={setSteps}
          multiline
        />
        {errors.steps && <Text style={styles.errText}>{errors.steps}</Text>}
      </View>

      {/* SAVE BUTTON */}
      <Pressable
        onPress={onSave}
        disabled={!isFormValid()}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && { opacity: 0.9 },
          !isFormValid() && styles.saveButtonDisabled,
        ]}
      >
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </Pressable>

      {/* CANCEL BUTTON */}
      <Pressable
        onPress={resetFormAndExit}
        style={({ pressed }) => [
          styles.cancelButton,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 50,
    backgroundColor: '#f8fafc',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0f172a',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  sectionLabel: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
    color: '#334155',
  },

  errText: {
    color: '#e11d48',
    marginBottom: 8,
    fontSize: 13,
  },

  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },

  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  cancelButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
});
