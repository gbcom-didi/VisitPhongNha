# Visit Phong Nha - Phong Nha Travel Hub Replit.md

## Overview

Visit Phong Nha is a comprehensive travel platform designed to showcase Phong Nha region in Vietnam, particularly focusing on its cave exploration opportunities and Vietnamese culture. The application serves as an interactive guide for travelers to discover accommodations, restaurants, attractions, and adventure activities in the region.

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
- June 19, 2025. Updated site branding and location references
  - Changed site branding to "ĐiĐi VUi" (with space and specific capitalization) in tropical aqua color with "Phan Rang Travel Hub" subtitle
  - Updated all location references from "Ninh Thuan" to "Phan Rang" throughout the site
  - Applied consistent branding across navigation, footer, about page, and HTML meta tags
  - Maintained aqua color scheme for all brand elements
- June 25, 2025. Complete rebranding from ĐiĐi VUi to Visit Phong Nha
  - Changed all site branding from "ĐiĐi VUi" to "Visit Phong Nha" 
  - Updated subtitle from "Phan Rang Travel Hub" to "Phong Nha Travel Hub"
  - Changed location references from "Phan Rang" to "Phong Nha" throughout
  - Updated province references from "Ninh Thuan" to "Quang Binh Province"
  - Modified content focus from kitesurfing to cave exploration
  - Updated transportation information for Phong Nha region
- June 19, 2025. Implemented comprehensive business listing schema
  - Added comprehensive business schema with 27 fields including gallery, tags, amenities, booking options
  - Created admin interface at /admin for managing business listings with all schema fields
  - Added database fields: gallery (array), tags (array), price_range, amenities (array), booking_type, affiliate_link, direct_booking_contact, enquiry_form_enabled, featured_text, is_verified, is_recommended
  - Updated storage interface to handle enhanced business data structure
  - Created admin page with tabbed interface for adding and managing businesses
  - Added admin navigation link for authenticated users
  - System now ready for real business data population with complete listing information
- June 20, 2025. Implemented role-based access control (RBAC) system
  - Added user roles: admin, business_owner, viewer with hierarchical permissions
  - Created RBAC middleware and permission system for API endpoints
  - Added owner_id field to businesses table for business ownership tracking
  - Implemented role-based navigation and UI component visibility
  - Created admin routes for user management and role assignment
  - Business owners can only manage their own businesses unless they're admin
  - Added frontend RBAC hook for permission checking and role-based UI
- June 20, 2025. Enhanced rating and reviews system with admin management
  - Added rating and reviewCount fields to business schema for Google Places data
  - Integrated authentic Google Places ratings and reviews in business cards and modals
  - Fixed category filtering issues in frontend query handling
  - Added comprehensive Rating & Reviews section to admin pages for manual management
  - Admins can now manually add/edit ratings, review counts, and review JSON data
  - System displays Google Places imported data alongside manually managed reviews
- June 20, 2025. Fixed admin permission and form persistence issues
  - Resolved role-based access control blocking admin operations
  - Added missing PUT route for business updates with proper category relationship handling
  - Enhanced authentication middleware to dynamically fetch user roles from database
  - Fixed admin form persistence so category assignments and business updates now save properly
  - Admin users can now create and edit any business without permission restrictions
- June 22, 2025. Completed saved places system with optimized user experience
  - Fixed saved places/like system authentication errors and API route issues
  - Created comprehensive saved places page with beautiful grid layout and empty states
  - Implemented optimistic updates for instant heart icon color changes on like/unlike
  - Added proper navigation from heart icon in explore sidebar to saved places page
  - Connected like functionality across business cards, modals, and explore page
  - Added error handling and authentication checks for all like operations
  - Updated heart icon colors to consistent red theme for better visual feedback
  - Renamed "favorites" to "saved places" throughout entire application with /saved URL
- June 22, 2025. Added "Street Food" category with comprehensive integration
  - Added Street Food category to database with orange color scheme (#FF6B35)
  - Created custom map icon for Street Food category (food cart/stand design)
  - Integrated category throughout UI components (filters, business cards, modal)
  - Added Street Food emoji (🍜) to filter dialogs and category displays
  - Updated business card image fallbacks to include Street Food imagery
  - Category now available in admin pages and forms for business management
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```