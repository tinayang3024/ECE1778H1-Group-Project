import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewRecipe() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 New Recipe</Text>
      <Text style={styles.description}>
        placeholder for creating a new recipe. You can later add a form here to input recipe
        details.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
