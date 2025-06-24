export interface Recipe {
  id: number;
  title: string;
  summary: string | null;
  image: string | null;
  readyInMinutes: number | null;
  servings: number | null;
  healthScore: number | null;
  pricePerServing: number | null;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  ingredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[];
  instructions: {
    number: number;
    step: string;
  }[];
  spoonacularScore: number | null;
  aggregateLikes: number | null;
  sourceUrl: string | null;
  spoonacularSourceUrl: string | null;
}