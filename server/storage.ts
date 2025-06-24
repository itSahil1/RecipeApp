import { recipes, type Recipe, type InsertRecipe } from "@shared/schema";

export interface IStorage {
  getRecipe(id: number): Promise<Recipe | undefined>;
  getRecipes(): Promise<Recipe[]>;
  saveRecipe(recipe: InsertRecipe): Promise<Recipe>;
  saveRecipes(recipes: InsertRecipe[]): Promise<Recipe[]>;
  searchRecipes(query?: string): Promise<Recipe[]>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, Recipe>;

  constructor() {
    this.recipes = new Map();
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async saveRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const recipe: Recipe = {
      ...insertRecipe,
      id: insertRecipe.id!,
    };
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async saveRecipes(insertRecipes: InsertRecipe[]): Promise<Recipe[]> {
    const savedRecipes: Recipe[] = [];
    for (const insertRecipe of insertRecipes) {
      const recipe = await this.saveRecipe(insertRecipe);
      savedRecipes.push(recipe);
    }
    return savedRecipes;
  }

  async searchRecipes(query?: string): Promise<Recipe[]> {
    const allRecipes = Array.from(this.recipes.values());
    if (!query) {
      return allRecipes;
    }
    
    const searchTerm = query.toLowerCase();
    return allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.summary?.toLowerCase().includes(searchTerm) ||
      recipe.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchTerm)) ||
      recipe.dishTypes.some(type => type.toLowerCase().includes(searchTerm))
    );
  }
}

export const storage = new MemStorage();
