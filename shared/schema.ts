import { pgTable, text, serial, integer, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  image: text("image"),
  readyInMinutes: integer("ready_in_minutes"),
  servings: integer("servings"),
  healthScore: real("health_score"),
  pricePerServing: real("price_per_serving"),
  cuisines: json("cuisines").$type<string[]>().default([]),
  dishTypes: json("dish_types").$type<string[]>().default([]),
  diets: json("diets").$type<string[]>().default([]),
  ingredients: json("ingredients").$type<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[]>().default([]),
  instructions: json("instructions").$type<{
    number: number;
    step: string;
  }[]>().default([]),
  spoonacularScore: real("spoonacular_score"),
  aggregateLikes: integer("aggregate_likes"),
  sourceUrl: text("source_url"),
  spoonacularSourceUrl: text("spoonacular_source_url"),
});

export const insertRecipeSchema = createInsertSchema(recipes);

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Search and filter types
export const searchRecipesSchema = z.object({
  query: z.string().optional(),
  cuisine: z.string().optional(),
  diet: z.string().optional(),
  type: z.string().optional(),
  number: z.number().min(1).max(100).default(12),
  offset: z.number().min(0).default(0),
});

export type SearchRecipesParams = z.infer<typeof searchRecipesSchema>;
