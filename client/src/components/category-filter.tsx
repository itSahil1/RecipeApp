import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Coffee, 
  Sandwich, 
  UtensilsCrossed, 
  Cookie 
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "", label: "All Recipes", icon: Utensils },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "lunch", label: "Lunch", icon: Sandwich },
  { id: "dinner", label: "Dinner", icon: UtensilsCrossed },
  { id: "dessert", label: "Desserts", icon: Cookie },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            variant="ghost"
            onClick={() => onCategoryChange(category.id)}
            className={`
              backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-200
              ${selectedCategory === category.id 
                ? 'bg-white/30' 
                : 'bg-white/20 hover:bg-white/30'
              }
            `}
          >
            <Icon className="w-4 h-4 mr-2" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
