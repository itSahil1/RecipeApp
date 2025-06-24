# Recipe Book Application

## Overview

This is a full-stack recipe management application built with React (frontend) and Express.js (backend). The application allows users to search, browse, and view detailed information about recipes. It integrates with the Spoonacular API for recipe data and uses a modern tech stack with TypeScript, PostgreSQL, and shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Integration**: Spoonacular API for external recipe data
- **Storage**: In-memory storage (MemStorage) with database schema ready for PostgreSQL integration
- **Development**: TSX for TypeScript execution in development

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Comprehensive recipe schema with support for ingredients, instructions, nutritional data, and metadata
- **Migrations**: Drizzle-kit for database migrations
- **Validation**: Zod schemas for type-safe data validation

## Key Components

### Database Schema
The application uses a single `recipes` table with the following structure:
- Basic recipe information (title, summary, image, timing)
- Nutritional data (health score, price per serving)
- Categorization (cuisines, dish types, diets)
- Complex data structures stored as JSON (ingredients, instructions)
- External API metadata (Spoonacular URLs and scores)

### API Endpoints
- `GET /api/recipes/search` - Search recipes with query parameters for filtering
- Recipe data fetching with fallback to local storage
- Spoonacular API integration for external recipe data

### Frontend Pages
- **Home Page**: Recipe search and browsing with category filters
- **Recipe Detail Page**: Detailed view of individual recipes
- **Navigation**: Consistent navigation with responsive design

### UI Components
- Recipe cards with hover effects and metadata display
- Search functionality with real-time filtering
- Category-based filtering system
- Loading states and error handling
- Responsive design for mobile and desktop

## Data Flow

1. **Recipe Search**: Users search via the frontend search component
2. **API Request**: Frontend sends search parameters to backend API
3. **Data Resolution**: Backend checks local storage first, then queries Spoonacular API if needed
4. **Data Processing**: External API data is transformed to match internal schema
5. **Response**: Processed recipe data is returned to frontend
6. **UI Update**: React Query manages cache and updates UI components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant handling
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety and enhanced development experience
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server for frontend with HMR
- **Backend Server**: Express server with TypeScript execution via TSX
- **Database**: PostgreSQL 16 (configured in .replit)
- **Port Configuration**: Application runs on port 5000

### Production Build
- **Frontend Build**: Vite builds optimized static assets to `dist/public`
- **Backend Build**: esbuild compiles TypeScript server code to `dist/index.js`
- **Deployment**: Replit autoscale deployment with npm scripts
- **Environment**: Production environment uses compiled JavaScript

### Configuration
- Database connection via `DATABASE_URL` environment variable
- Spoonacular API key via `SPOONACULAR_API_KEY` environment variable
- Replit-specific configuration for deployment and port mapping

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.