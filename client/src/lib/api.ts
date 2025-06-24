import type { Recipe } from "@/types/recipe";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export interface SearchRecipeParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  type?: string;
  number?: number;
  offset?: number;
}

export interface SearchRecipeResponse {
  results: Recipe[];
  totalResults: number;
  offset: number;
  number: number;
}

export class RecipeAPI {
  private async makeRequest(url: string): Promise<any> {
    if (!SPOONACULAR_API_KEY) {
      throw new Error('Spoonacular API key not configured. Please set VITE_SPOONACULAR_API_KEY environment variable.');
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Spoonacular API key.');
      }
      if (response.status === 402) {
        throw new Error('API quota exceeded. Please check your Spoonacular plan.');
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchRecipes(params: SearchRecipeParams): Promise<SearchRecipeResponse> {
    const searchParams = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY || '',
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      number: (params.number || 12).toString(),
      offset: (params.offset || 0).toString(),
    });

    if (params.query) searchParams.append('query', params.query);
    if (params.cuisine) searchParams.append('cuisine', params.cuisine);
    if (params.diet) searchParams.append('diet', params.diet);
    if (params.type) searchParams.append('type', params.type);

    const url = `${BASE_URL}/complexSearch?${searchParams.toString()}`;
    const data = await this.makeRequest(url);

    // Transform Spoonacular data to our Recipe format
    const transformedRecipes: Recipe[] = data.results.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary || null,
      image: recipe.image || null,
      readyInMinutes: recipe.readyInMinutes || null,
      servings: recipe.servings || null,
      healthScore: recipe.healthScore || null,
      pricePerServing: recipe.pricePerServing || null,
      cuisines: recipe.cuisines || [],
      dishTypes: recipe.dishTypes || [],
      diets: recipe.diets || [],
      ingredients: recipe.extendedIngredients?.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original
      })) || [],
      instructions: [],
      spoonacularScore: recipe.spoonacularScore || null,
      aggregateLikes: recipe.aggregateLikes || null,
      sourceUrl: recipe.sourceUrl || null,
      spoonacularSourceUrl: recipe.spoonacularSourceUrl || null,
    }));

    return {
      results: transformedRecipes,
      totalResults: data.totalResults,
      offset: data.offset,
      number: data.number
    };
  }

  async getRecipeDetails(id: number): Promise<Recipe> {
    const infoUrl = `${BASE_URL}/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=false`;
    const instructionsUrl = `${BASE_URL}/${id}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`;

    const [recipeData, instructionsData] = await Promise.all([
      this.makeRequest(infoUrl),
      this.makeRequest(instructionsUrl)
    ]);

    // Extract instructions
    let instructions: { number: number; step: string; }[] = [];
    if (instructionsData.length > 0 && instructionsData[0].steps) {
      instructions = instructionsData[0].steps.map((step: any) => ({
        number: step.number,
        step: step.step
      }));
    }

    return {
      id: recipeData.id,
      title: recipeData.title,
      summary: recipeData.summary || null,
      image: recipeData.image || null,
      readyInMinutes: recipeData.readyInMinutes || null,
      servings: recipeData.servings || null,
      healthScore: recipeData.healthScore || null,
      pricePerServing: recipeData.pricePerServing || null,
      cuisines: recipeData.cuisines || [],
      dishTypes: recipeData.dishTypes || [],
      diets: recipeData.diets || [],
      ingredients: recipeData.extendedIngredients?.map((ing: any) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original
      })) || [],
      instructions,
      spoonacularScore: recipeData.spoonacularScore || null,
      aggregateLikes: recipeData.aggregateLikes || null,
      sourceUrl: recipeData.sourceUrl || null,
      spoonacularSourceUrl: recipeData.spoonacularSourceUrl || null,
    };
  }
}

export const recipeAPI = new RecipeAPI();