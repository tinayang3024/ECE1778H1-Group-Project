import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecipeDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 Recipe Details</Text>
      <Text style={styles.description}>
        This is where your recipe details will appear. You can later fetch and display content
        dynamically.
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
