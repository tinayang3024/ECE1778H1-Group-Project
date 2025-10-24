export interface RecipeData {
  id: string;
  title: string;
  category: string;
  area: string;
  instructions: string;
  tags: string[];
  imageUrl?: string;
  youtubeUrl?: string;
  ingredients?: { ingredient: string; measure: string }[];
  dateModified?: string;
}
