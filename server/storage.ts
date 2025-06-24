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
    this.initSampleData();
  }

  private initSampleData() {
    const sampleRecipes: Recipe[] = [
      {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        summary: "A traditional Italian pasta dish with eggs, cheese, and pancetta. Simple yet delicious comfort food that's ready in under 30 minutes.",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop",
        readyInMinutes: 25,
        servings: 4,
        healthScore: 72,
        pricePerServing: 350,
        cuisines: ["Italian"],
        dishTypes: ["dinner", "main course"],
        diets: [],
        ingredients: [
          { id: 1, name: "spaghetti", amount: 400, unit: "g", original: "400g spaghetti pasta" },
          { id: 2, name: "pancetta", amount: 150, unit: "g", original: "150g pancetta, diced" },
          { id: 3, name: "eggs", amount: 3, unit: "large", original: "3 large eggs" },
          { id: 4, name: "parmesan cheese", amount: 100, unit: "g", original: "100g grated Parmesan cheese" },
          { id: 5, name: "black pepper", amount: 1, unit: "tsp", original: "1 tsp freshly ground black pepper" }
        ],
        instructions: [
          { number: 1, step: "Cook spaghetti in salted boiling water until al dente according to package instructions." },
          { number: 2, step: "Meanwhile, cook pancetta in a large skillet until crispy, about 5-7 minutes." },
          { number: 3, step: "In a bowl, whisk together eggs, grated Parmesan, and black pepper." },
          { number: 4, step: "Drain pasta, reserving 1 cup of pasta water. Add hot pasta to the skillet with pancetta." },
          { number: 5, step: "Remove from heat and quickly toss with egg mixture, adding pasta water as needed to create a creamy sauce." }
        ],
        spoonacularScore: 85,
        aggregateLikes: 1247,
        sourceUrl: null,
        spoonacularSourceUrl: null
      },
      {
        id: 2,
        title: "Avocado Toast with Poached Egg",
        summary: "A healthy and trendy breakfast featuring creamy avocado on toasted sourdough topped with a perfectly poached egg.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=300&fit=crop",
        readyInMinutes: 15,
        servings: 2,
        healthScore: 89,
        pricePerServing: 280,
        cuisines: ["American"],
        dishTypes: ["breakfast", "brunch"],
        diets: ["vegetarian"],
        ingredients: [
          { id: 6, name: "sourdough bread", amount: 2, unit: "slices", original: "2 slices sourdough bread" },
          { id: 7, name: "avocado", amount: 1, unit: "large", original: "1 large ripe avocado" },
          { id: 8, name: "eggs", amount: 2, unit: "large", original: "2 large eggs" },
          { id: 9, name: "lemon juice", amount: 1, unit: "tbsp", original: "1 tbsp fresh lemon juice" },
          { id: 10, name: "salt", amount: 0.5, unit: "tsp", original: "Salt and pepper to taste" }
        ],
        instructions: [
          { number: 1, step: "Toast sourdough bread slices until golden brown." },
          { number: 2, step: "Mash avocado with lemon juice, salt, and pepper in a bowl." },
          { number: 3, step: "Bring water to boil in a pot, create a whirlpool and gently drop in eggs for poaching." },
          { number: 4, step: "Poach eggs for 3-4 minutes until whites are set but yolks remain runny." },
          { number: 5, step: "Spread avocado mixture on toast and top with poached eggs." }
        ],
        spoonacularScore: 92,
        aggregateLikes: 856,
        sourceUrl: null,
        spoonacularSourceUrl: null
      },
      {
        id: 3,
        title: "Chocolate Chip Cookies",
        summary: "Classic homemade chocolate chip cookies that are crispy on the outside and chewy on the inside. Perfect for any occasion!",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=300&fit=crop",
        readyInMinutes: 45,
        servings: 24,
        healthScore: 45,
        pricePerServing: 65,
        cuisines: ["American"],
        dishTypes: ["dessert"],
        diets: ["vegetarian"],
        ingredients: [
          { id: 11, name: "flour", amount: 300, unit: "g", original: "300g all-purpose flour" },
          { id: 12, name: "butter", amount: 200, unit: "g", original: "200g unsalted butter, softened" },
          { id: 13, name: "brown sugar", amount: 150, unit: "g", original: "150g brown sugar" },
          { id: 14, name: "white sugar", amount: 100, unit: "g", original: "100g white sugar" },
          { id: 15, name: "chocolate chips", amount: 200, unit: "g", original: "200g chocolate chips" }
        ],
        instructions: [
          { number: 1, step: "Preheat oven to 180°C (350°F) and line baking sheets with parchment paper." },
          { number: 2, step: "Cream together softened butter and both sugars until light and fluffy." },
          { number: 3, step: "Beat in eggs one at a time, then add vanilla extract." },
          { number: 4, step: "Gradually mix in flour until just combined, then fold in chocolate chips." },
          { number: 5, step: "Drop rounded tablespoons of dough onto baking sheets and bake for 10-12 minutes." }
        ],
        spoonacularScore: 78,
        aggregateLikes: 2103,
        sourceUrl: null,
        spoonacularSourceUrl: null
      }
    ];

    sampleRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });
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
      summary: insertRecipe.summary ?? null,
      image: insertRecipe.image ?? null,
      readyInMinutes: insertRecipe.readyInMinutes ?? null,
      servings: insertRecipe.servings ?? null,
      healthScore: insertRecipe.healthScore ?? null,
      pricePerServing: insertRecipe.pricePerServing ?? null,
      cuisines: (insertRecipe.cuisines as string[]) || [],
      dishTypes: (insertRecipe.dishTypes as string[]) || [],
      diets: (insertRecipe.diets as string[]) || [],
      ingredients: (insertRecipe.ingredients as any[]) || [],
      instructions: (insertRecipe.instructions as any[]) || [],
      spoonacularScore: insertRecipe.spoonacularScore ?? null,
      aggregateLikes: insertRecipe.aggregateLikes ?? null,
      sourceUrl: insertRecipe.sourceUrl ?? null,
      spoonacularSourceUrl: insertRecipe.spoonacularSourceUrl ?? null,
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
      (recipe.cuisines || []).some(cuisine => cuisine.toLowerCase().includes(searchTerm)) ||
      (recipe.dishTypes || []).some(type => type.toLowerCase().includes(searchTerm))
    );
  }
}

export const storage = new MemStorage();
