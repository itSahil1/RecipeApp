import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Utensils className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-gray-900">Recipe Book</span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className={`font-medium transition-colors duration-200 ${
                location === "/" 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              }`}>
                Home
              </a>
            </Link>
            <a 
              href="#" 
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-200"
            >
              Favorites
            </a>
            <Button className="bg-primary text-white hover:bg-primary/90">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
