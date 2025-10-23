// Local mock data for recipes used by the example pages under (tabs)
// Purpose: provide in-memory sample recipes so pages render meaningful content
// TODO: replace with API calls / persistent storage when backend is ready
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

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    author: 'Chef Mock',
    image: 'https://images.unsplash.com/photo-1604908177522-6e9f0a2d6a1a?w=800&q=80',
    duration: '25 mins',
    servings: 2,
    description: 'A quick and creamy carbonara with pancetta and parmesan.',
    ingredients: ['200g spaghetti', '100g pancetta', '2 large eggs', '50g parmesan', 'Salt', 'Pepper'],
    steps: [
      'Boil the pasta in salted water until al dente.',
      'Fry pancetta until crispy.',
      'Whisk eggs and parmesan together.',
      'Drain pasta and combine quickly with egg mixture and pancetta off the heat.',
      'Serve immediately with extra parmesan and pepper.',
    ],
  },
  {
    id: '2',
    title: 'Avocado Toast',
    author: 'Simple Eats',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
    duration: '10 mins',
    servings: 1,
    description: 'Healthy and fast breakfast with smashed avocado and lemon.',
    ingredients: ['1 slice sourdough', '1/2 avocado', '1/2 lemon', 'Salt', 'Chili flakes'],
    steps: ['Toast bread.', 'Smash avocado with lemon and salt.', 'Spread on toast and sprinkle chili flakes.'],
  },
];
