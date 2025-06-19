# ĐiĐiVui - Phan Rang Travel Hub Replit.md

## Overview

ĐiĐiVui is a comprehensive travel platform designed to showcase Phan Rang province in Vietnam, particularly focusing on its kitesurfing opportunities and Vietnamese culture. The application serves as an interactive guide for travelers to discover accommodations, restaurants, attractions, and adventure activities in the region.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and data fetching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom brand colors and responsive design
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Database Schema
The application uses several core tables:
- **users**: User profiles (required for Replit Auth)
- **sessions**: Session storage (required for Replit Auth)
- **categories**: Business categories with colors and icons
- **businesses**: Business listings with location data
- **userLikes**: User favorites/likes system

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Protected Routes**: Middleware-based route protection

### Frontend Features
- **Interactive Map**: Google Maps API integration for location visualization
- **Business Directory**: Searchable and filterable business listings
- **Favorites System**: User-specific business bookmarking
- **Responsive Design**: Mobile-first approach with desktop optimization
- **SEO Optimization**: Meta tags and structured data for search engines

### API Endpoints
- **Auth Routes**: User authentication and profile management
- **Business Routes**: CRUD operations for business listings
- **Category Routes**: Category management and filtering
- **Like Routes**: User favorites management

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating sessions stored in PostgreSQL
2. **Data Fetching**: Frontend uses TanStack Query to fetch data from Express API endpoints
3. **Business Display**: Businesses are displayed on both map and directory views with real-time filtering
4. **User Interactions**: Likes/favorites are stored in the database and reflected in the UI
5. **Search & Filter**: Client-side search with server-side category filtering

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@googlemaps/react-wrapper**: Google Maps React integration
- **@types/google.maps**: TypeScript definitions for Google Maps
- **@radix-ui/***: Accessible UI components
- **@tanstack/react-query**: Server state management

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Production build optimization
- **vite**: Development server and build tool

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` using tsx for TypeScript execution
- **Port**: 5000 (mapped to external port 80)
- **Hot Reload**: Vite development server with HMR

### Production Build
- **Frontend Build**: Vite builds React app to `dist/public`
- **Backend Build**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Replit Autoscale deployment target

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **REPLIT_DOMAINS**: Allowed domains for Replit Auth
- **SESSION_SECRET**: Session encryption secret
- **ISSUER_URL**: OpenID Connect issuer URL
- **VITE_GOOGLE_MAPS_API_KEY**: Google Maps JavaScript API key (required for maps)
- **VITE_GOOGLE_MAPS_MAP_ID**: Google Maps Map ID for custom styling (optional)

## Changelog
```
Changelog:
- June 17, 2025. Initial setup
- June 17, 2025. Migrated from Mapbox GL JS to Google Maps API integration
  - Removed mapbox-gl dependency
  - Added @googlemaps/react-wrapper and @types/google.maps
  - Replaced Map component with Google Maps implementation
  - Updated configuration and environment variables
- June 18, 2025. Enhanced business listings with main images
  - Added comprehensive image support for all 75 business listings
  - Business cards and modals now display high-quality category-appropriate images
  - Database schema already included imageUrl field with proper fallback handling
  - Images sourced from Unsplash for authentic, professional appearance
- June 19, 2025. Updated map icons and color theme
  - Redesigned map pin icons to match category types (surf=waves, recreation=hiking, kiting=kitesurfing)
  - Changed primary color theme from Chilli Red to Tropical Aqua throughout entire site
  - Updated 'Stay' category to 'Accommodation' in database
  - Modified all buttons, links, and UI elements to use tropical aqua color scheme
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```