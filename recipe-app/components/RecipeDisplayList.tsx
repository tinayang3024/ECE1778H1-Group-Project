import React from 'react';
import { FlatList, View, Text, StyleSheet, ViewStyle } from 'react-native';
import RecipeDisplayItem from './RecipeDisplayItem';
import { RecipeData } from '../utils/types';

type ListProps = {
  data: RecipeData[];
  style?: ViewStyle;
  loadingState: boolean;
};

export default function RecipeDisplayList({ data, style, loadingState }: ListProps) {
  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeDisplayItem recipe={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            {!loadingState && <Text style={styles.emptyText}>No recipes to display.</Text>}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#666' },
});
