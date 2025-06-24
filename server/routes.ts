import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchRecipesSchema } from "@shared/schema";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || process.env.VITE_SPOONACULAR_API_KEY;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Search recipes endpoint
  app.get("/api/recipes/search", async (req, res) => {
    try {
      const params = searchRecipesSchema.parse(req.query);
      
      // First check local storage
      const localRecipes = await storage.searchRecipes(params.query);
      
      // If we have local recipes and no specific query, return them
      if (localRecipes.length > 0 && !params.query) {
        return res.json({
          results: localRecipes.slice(params.offset, params.offset + params.number),
          totalResults: localRecipes.length,
          offset: params.offset,
          number: params.number
        });
      }

      // Otherwise, fetch from Spoonacular API
      if (!SPOONACULAR_API_KEY) {
        return res.status(500).json({ 
          message: "Spoonacular API key not configured. Please set SPOONACULAR_API_KEY environment variable." 
        });
      }

      const searchParams = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        number: params.number.toString(),
        offset: params.offset.toString(),
        addRecipeInformation: 'true',
        fillIngredients: 'true',
      });

      if (params.query) searchParams.append('query', params.query);
      if (params.cuisine) searchParams.append('cuisine', params.cuisine);
      if (params.diet) searchParams.append('diet', params.diet);
      if (params.type) searchParams.append('type', params.type);

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform and save recipes to local storage
      const transformedRecipes = data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        summary: recipe.summary || '',
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        healthScore: recipe.healthScore,
        pricePerServing: recipe.pricePerServing,
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
        spoonacularScore: recipe.spoonacularScore,
        aggregateLikes: recipe.aggregateLikes,
        sourceUrl: recipe.sourceUrl,
        spoonacularSourceUrl: recipe.spoonacularSourceUrl,
      }));

      // Save recipes to local storage
      await storage.saveRecipes(transformedRecipes);

      res.json({
        results: transformedRecipes,
        totalResults: data.totalResults,
        offset: data.offset,
        number: data.number
      });

    } catch (error) {
      console.error('Error searching recipes:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to search recipes' 
      });
    }
  });

  // Get recipe details endpoint
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      // First check local storage
      let recipe = await storage.getRecipe(id);
      
      // If not found locally, fetch from Spoonacular API
      if (!recipe && SPOONACULAR_API_KEY) {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=false`
        );

        if (!response.ok) {
          if (response.status === 404) {
            return res.status(404).json({ message: "Recipe not found" });
          }
          throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Get instructions separately
        const instructionsResponse = await fetch(
          `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`
        );
        
        let instructions: any[] = [];
        if (instructionsResponse.ok) {
          const instructionsData = await instructionsResponse.json();
          if (instructionsData.length > 0) {
            instructions = instructionsData[0].steps.map((step: any) => ({
              number: step.number,
              step: step.step
            }));
          }
        }

        // Transform and save recipe
        const transformedRecipe = {
          id: data.id,
          title: data.title,
          summary: data.summary || '',
          image: data.image,
          readyInMinutes: data.readyInMinutes,
          servings: data.servings,
          healthScore: data.healthScore,
          pricePerServing: data.pricePerServing,
          cuisines: data.cuisines || [],
          dishTypes: data.dishTypes || [],
          diets: data.diets || [],
          ingredients: data.extendedIngredients?.map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            original: ing.original
          })) || [],
          instructions,
          spoonacularScore: data.spoonacularScore,
          aggregateLikes: data.aggregateLikes,
          sourceUrl: data.sourceUrl,
          spoonacularSourceUrl: data.spoonacularSourceUrl,
        };

        recipe = await storage.saveRecipe(transformedRecipe);
      }

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.json(recipe);

    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to fetch recipe details' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
