// mealMapper.ts
// Helpers to map TheMealDB meal objects into the app's recipe shapes and normalize instructions.

import { Image as RNImage } from 'react-native';

const DEFAULT_IMAGE_ASSET = require('../assets/images/kitchen.jpg');
const DEFAULT_IMAGE_URL = RNImage.resolveAssetSource(DEFAULT_IMAGE_ASSET).uri;

export type MappedRecipe = {
  id: string;
  title: string;
  image?: string;
  author?: string;
  duration?: string | undefined;
  servings?: number | undefined;
  description?: string | undefined;
  ingredients: string[];
  steps: string[];
  instructions?: string;
};

function normalizeSteps(raw: string | undefined): string[] {
  // Per user's request: do not strip prefixes — just split by newline and return non-empty trimmed lines.
  if (!raw) return [];
  return raw
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mealToRecipeData(meal: any) {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const mea = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== '') {
      ingredients.push({ ingredient: ing, measure: mea || '' });
    }
  }

  const tags =
    typeof meal.strTags === 'string' && meal.strTags.length > 0
      ? meal.strTags.split(',').map((t: string) => t.trim())
      : [];

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory ?? '',
    area: meal.strArea ?? '',
    instructions: meal.strInstructions ?? '',
    tags,
    imageUrl: meal.strMealThumb ?? undefined,
    youtubeUrl: meal.strYoutube ?? undefined,
    ingredients,
    dateModified: meal.dateModified ?? undefined,
  } as any;
}

export function mealFromFilterToRecipeData(meal: any) {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: '',
    area: '',
    instructions: '',
    tags: [],
    imageUrl: meal.strMealThumb ?? undefined,
    youtubeUrl: undefined,
    ingredients: [],
    dateModified: undefined,
  } as any;
}

export function mapMealToDetail(meal: any): MappedRecipe {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const mea = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(mea && mea.trim() ? `${ing.trim()} — ${mea.trim()}` : ing.trim());
    }
  }

  const steps = normalizeSteps(meal.strInstructions ?? '');

  const mapped: MappedRecipe = {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb ?? DEFAULT_IMAGE_URL,
    author: meal.strSource ?? meal.strArea ?? meal.strCategory ?? undefined,
    duration: undefined,
    servings: undefined,
    description: meal.strTags
      ? `${meal.strCategory ?? ''} • ${meal.strArea ?? ''}`
      : (meal.strCategory ?? meal.strArea ?? ''),
    ingredients,
    steps,
    instructions: meal.strInstructions ?? '',
  };

  return mapped;
}
