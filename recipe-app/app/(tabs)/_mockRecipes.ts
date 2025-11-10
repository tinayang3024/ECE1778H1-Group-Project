import AsyncStorage from '@react-native-async-storage/async-storage';

export type Recipe = {
  id: string;
  title: string;
  image?: string;
  author?: string;
  duration?: string;
  servings?: number;
  description?: string;
  ingredients: string[];
  steps: string[];
};

const STORAGE_KEY = '@user_created_recipes_v1';

// in-memory array exported for existing code to consume
export const MOCK_RECIPES: Recipe[] = [];

// load persisted user-created recipes on module init
(async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // prepend loaded recipes so they appear first (preserve previous behavior)
        MOCK_RECIPES.unshift(...parsed);
      }
    }
  } catch (e) {
    // ignore load errors in dev
  }
})();

// helper to persist current MOCK_RECIPES (only user-created items are stored here)
async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_RECIPES));
  } catch (e) {
    // ignore persistence errors for now
  }
}

// exported helper to add a recipe and persist immediately
export async function addMockRecipe(r: Recipe) {
  MOCK_RECIPES.unshift(r);
  await persist();
}

// exported helper to clear persisted user recipes (dev)
export async function clearMockRecipes() {
  MOCK_RECIPES.length = 0;
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}
