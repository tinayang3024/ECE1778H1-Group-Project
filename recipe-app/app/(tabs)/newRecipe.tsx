import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Simple in-memory form for creating a recipe. This is intentionally lightweight and
// uses local component state. Integrate with backend / context once available.
// TODO: replace with form validation, image upload, and API persistence.
export default function NewRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function onSave() {
    // Currently we just navigate back to the personal tab. In the future this should
    // POST the new recipe to a backend and update local/global state.
    // TODO: implement save to API and optimistic UI update
    console.log('Saving (mock):', { title, description });
    router.push('/(tabs)/personal');
  }

  return (
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
      <View style={styles.buttonRow}>
        <Button title="Save (mock)" onPress={onSave} disabled={!title.trim()} />
      </View>
      <Text style={styles.help}>Note: this is a local mock form. See TODOs in code.</Text>
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
});
