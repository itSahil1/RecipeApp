export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  summary?: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  aggregateLikes: number;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  extendedIngredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[];
}

export interface SpoonacularSearchResponse {
  results: SpoonacularRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface SpoonacularInstruction {
  number: number;
  step: string;
}

export interface SpoonacularInstructionsResponse {
  steps: SpoonacularInstruction[];
}

const API_KEY ='bd29879d8ea4415b8655a1d1197b910d'

export class SpoonacularAPI {
  private baseUrl = 'https://api.spoonacular.com/recipes';

  async searchRecipes(params: {
    query?: string;
    cuisine?: string;
    diet?: string;
    type?: string;
    number?: number;
    offset?: number;
  }): Promise<SpoonacularSearchResponse> {
    const searchParams = new URLSearchParams({
      apiKey: API_KEY,
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      number: (params.number || 12).toString(),
      offset: (params.offset || 0).toString(),
    });

    if (params.query) searchParams.append('query', params.query);
    if (params.cuisine) searchParams.append('cuisine', params.cuisine);
    if (params.diet) searchParams.append('diet', params.diet);
    if (params.type) searchParams.append('type', params.type);

    const response = await fetch(`${this.baseUrl}/complexSearch?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRecipeInformation(id: number): Promise<SpoonacularRecipe> {
    const response = await fetch(
      `${this.baseUrl}/${id}/information?apiKey=${API_KEY}&includeNutrition=false`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRecipeInstructions(id: number): Promise<SpoonacularInstructionsResponse[]> {
    const response = await fetch(
      `${this.baseUrl}/${id}/analyzedInstructions?apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const spoonacularAPI = new SpoonacularAPI();
