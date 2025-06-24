import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const getRecipeTypeColor = (types: string[]) => {
    if (types.includes('breakfast')) return 'bg-blue-100 text-blue-800';
    if (types.includes('lunch')) return 'bg-green-100 text-green-800';
    if (types.includes('dinner')) return 'bg-orange-100 text-orange-800';
    if (types.includes('dessert')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Strip HTML tags from summary for display
  const cleanSummary = recipe.summary?.replace(/<[^>]*>/g, '') || '';

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <Card className="recipe-card-hover cursor-pointer">
        <div className="relative">
          {recipe.image && (
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          {!recipe.image && (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            {recipe.dishTypes.length > 0 && (
              <Badge className={getRecipeTypeColor(recipe.dishTypes)}>
                {recipe.dishTypes[0]}
              </Badge>
            )}
            
            {recipe.spoonacularScore && (
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {Math.round(recipe.spoonacularScore / 20 * 10) / 10}
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncateText(cleanSummary, 100)}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{recipe.readyInMinutes || 'N/A'} min</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{recipe.servings || 'N/A'} servings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
