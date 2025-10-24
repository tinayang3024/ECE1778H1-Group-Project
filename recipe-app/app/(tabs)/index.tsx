import { StyleSheet, Button } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import RecipeDisplayList from '@/components/RecipeDisplayList';

import { MOCK_RECIPE_LIST } from '@/utils/mockData';
export default function TabDashboardScreen() {
  const router = useRouter();
  return (
    <View style={{ ...styles.container, width: '100%', padding: 0, margin: 0 }}>
      {/* <Text style={styles.title}>Dashboard</Text> */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
      <View style={{ flex: 1, overflow: 'scroll' }}>
        <RecipeDisplayList data={MOCK_RECIPE_LIST} />
      </View>
      {/* <View>
        <Button title="Go to Recipe Details" onPress={() => router.push('/(tabs)/recipeDetails')} />
      </View> */}
      <View>
        <Button title="Go to New Recipe" onPress={() => router.push('/(tabs)/newRecipe')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
