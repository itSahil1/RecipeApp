import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import SearchBar from "@/components/search-bar";
import CategoryFilter from "@/components/category-filter";
import RecipeCard from "@/components/recipe-card";
import LoadingSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { recipeAPI } from "@/lib/api";
import type { Recipe } from "@/types/recipe";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["recipes/search", searchQuery, selectedCategory, offset],
    queryFn: async () => {
      return recipeAPI.searchRecipes({
        query: searchQuery.trim() || undefined,
        type: selectedCategory || undefined,
        number: 12,
        offset: offset,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update allRecipes when new data arrives
  if (data && data.results) {
    if (offset === 0) {
      // New search, replace all recipes
      if (allRecipes.length === 0 || allRecipes[0]?.id !== data.results[0]?.id) {
        setAllRecipes(data.results);
      }
    } else {
      // Load more, append to existing
      const newRecipeIds = new Set(allRecipes.map(r => r.id));
      const newRecipes = data.results.filter((r: Recipe) => !newRecipeIds.has(r.id));
      if (newRecipes.length > 0) {
        setAllRecipes(prev => [...prev, ...newRecipes]);
      }
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setOffset(0);
    setAllRecipes([]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setOffset(0);
    setAllRecipes([]);
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + 12);
  };

  const displayRecipes = allRecipes;
  const hasMore = data?.totalResults > displayRecipes.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Recipes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              From quick weeknight dinners to impressive weekend projects
            </p>
            
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Recipes"}
            </h2>
            <p className="text-gray-600">
              {data ? `Showing ${displayRecipes.length} of ${data.totalResults} recipes` : "Loading..."}
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load recipes. Please try again."}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="ml-4"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && offset === 0 && <LoadingSkeleton />}

        {/* Recipe Grid */}
        {displayRecipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && displayRecipes.length === 0 && !error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && displayRecipes.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              onClick={handleLoadMore}
              disabled={isLoading}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Load More Recipes
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
