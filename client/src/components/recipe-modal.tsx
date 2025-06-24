import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Heart, X } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  const getRecipeTypeColor = (types: string[]) => {
    if (types.includes('breakfast')) return 'bg-blue-100 text-blue-800';
    if (types.includes('lunch')) return 'bg-green-100 text-green-800';
    if (types.includes('dinner')) return 'bg-orange-100 text-orange-800';
    if (types.includes('dessert')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-screen overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {recipe.title}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recipe Image and Info */}
            <div>
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full rounded-lg shadow-lg object-cover h-64"
                />
              )}
              
              {/* Recipe Meta Info */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Ready in</div>
                  <div className="text-lg font-semibold">
                    {recipe.readyInMinutes || 'N/A'} min
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Servings</div>
                  <div className="text-lg font-semibold">
                    {recipe.servings || 'N/A'}
                  </div>
                </div>
                {recipe.healthScore && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Health Score</div>
                    <div className="text-lg font-semibold">
                      {Math.round(recipe.healthScore)}/100
                    </div>
                  </div>
                )}
                {recipe.pricePerServing && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Price per serving</div>
                    <div className="text-lg font-semibold">
                      ${(recipe.pricePerServing / 100).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating and Actions */}
              <div className="mt-6 flex items-center justify-between">
                {recipe.spoonacularScore && (
                  <div className="flex items-center">
                    <div className="flex text-yellow-500 text-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.round(recipe.spoonacularScore! / 20) 
                              ? 'fill-current' 
                              : ''
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {Math.round(recipe.spoonacularScore / 20 * 10) / 10} 
                      {recipe.aggregateLikes && ` (${recipe.aggregateLikes} likes)`}
                    </span>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Ingredients and Instructions */}
            <div>
              {/* Summary */}
              {recipe.summary && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                  <div 
                    className="text-gray-600 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                  />
                </div>
              )}

              {/* Ingredients */}
              {recipe.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {recipe.instructions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction) => (
                      <li key={instruction.number} className="flex">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                          {instruction.number}
                        </span>
                        <span className="text-gray-700">{instruction.step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
