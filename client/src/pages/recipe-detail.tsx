import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  ArrowLeft, 
  AlertCircle,
  ChefHat,
  DollarSign
} from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-64 rounded-lg" />
              <div className="mt-6 grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Recipe not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const getRecipeTypeColor = (types: string[]) => {
    if (types.includes('breakfast')) return 'bg-blue-100 text-blue-800';
    if (types.includes('lunch')) return 'bg-green-100 text-green-800';
    if (types.includes('dinner')) return 'bg-orange-100 text-orange-800';
    if (types.includes('dessert')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Recipe Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {recipe.dishTypes.length > 0 && (
                <Badge className={getRecipeTypeColor(recipe.dishTypes)}>
                  {recipe.dishTypes[0]}
                </Badge>
              )}
              
              {recipe.spoonacularScore && (
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {Math.round(recipe.spoonacularScore / 20 * 10) / 10}/5
                  </span>
                </div>
              )}

              {recipe.aggregateLikes && (
                <span className="text-sm text-gray-600">
                  {recipe.aggregateLikes} likes
                </span>
              )}
            </div>

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
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center text-gray-600 mb-2">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-gray-600 text-center">Ready in</div>
                      <div className="text-lg font-semibold text-center">
                        {recipe.readyInMinutes || 'N/A'} min
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center text-gray-600 mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-gray-600 text-center">Servings</div>
                      <div className="text-lg font-semibold text-center">
                        {recipe.servings || 'N/A'}
                      </div>
                    </CardContent>
                  </Card>

                  {recipe.healthScore && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center text-gray-600 mb-2">
                          <ChefHat className="w-5 h-5" />
                        </div>
                        <div className="text-sm text-gray-600 text-center">Health Score</div>
                        <div className="text-lg font-semibold text-center">
                          {Math.round(recipe.healthScore)}/100
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {recipe.pricePerServing && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center text-gray-600 mb-2">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div className="text-sm text-gray-600 text-center">Price per serving</div>
                        <div className="text-lg font-semibold text-center">
                          ${(recipe.pricePerServing / 100).toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Diets and Cuisines */}
                {(recipe.diets.length > 0 || recipe.cuisines.length > 0) && (
                  <div className="mt-6">
                    {recipe.diets.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900 mb-2">Diets</h4>
                        <div className="flex flex-wrap gap-2">
                          {recipe.diets.map((diet) => (
                            <Badge key={diet} variant="secondary">
                              {diet}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recipe.cuisines.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cuisines</h4>
                        <div className="flex flex-wrap gap-2">
                          {recipe.cuisines.map((cuisine) => (
                            <Badge key={cuisine} variant="outline">
                              {cuisine}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

                {/* Source Links */}
                {(recipe.sourceUrl || recipe.spoonacularSourceUrl) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Source</h4>
                    <div className="space-y-2">
                      {recipe.sourceUrl && (
                        <a 
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:text-primary/80 text-sm"
                        >
                          View Original Recipe
                        </a>
                      )}
                      {recipe.spoonacularSourceUrl && (
                        <a 
                          href={recipe.spoonacularSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:text-primary/80 text-sm"
                        >
                          View on Spoonacular
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
