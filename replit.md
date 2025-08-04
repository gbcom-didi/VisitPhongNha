# Visit Phong Nha - Phong Nha Travel Hub

## Overview
Visit Phong Nha is a comprehensive travel platform showcasing Vietnam's Phong Nha region, focusing on cave exploration and Vietnamese culture. It functions as an interactive guide for travelers, helping them discover accommodations, restaurants, attractions, and adventure activities. The project aims to be an intelligent travel companion, providing local expertise and detailed information to enhance the visitor experience.

## Production Readiness Status ✅
- **Cleanup Complete**: All development/import files removed
- **TypeScript**: Most type errors resolved (6 remaining non-critical)
- **Firebase Auth**: Using secure environment variables  
- **Database**: PostgreSQL with proper schema and migrations
- **Dependencies**: All production dependencies verified
- **Build Process**: Configured for Replit deployment

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and data fetching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom brand colors and responsive design
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Authentication**: Firebase Authentication (Google, Facebook, email/password)
- **Session Management**: Express sessions with PostgreSQL storage
- **Role System**: Admin, business owner, and viewer roles with hierarchical permissions

### Database
- **Primary Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM
- **Schema Management**: Drizzle Kit

### Key Features
- **Interactive Map**: Google Maps API integration with custom markers and hover highlighting.
- **Business Directory**: Searchable, filterable listings with comprehensive details (images, ratings, reviews, amenities, booking options).
- **Favorites System**: User-specific business bookmarking ("Saved Places").
- **Guestbook System**: User entries, comments, and likes with business tagging and location support.
- **Inspiration Section**: Editorial articles with interactive map integration.
- **Getting Here/Around**: Detailed travel information with tabbed interface for transport options and activity types.
- **Contact Form**: Email service integration via Resend for inquiries.
- **Admin Portal**: Comprehensive interface for managing users, businesses, articles, and guestbook entries with CSV export.

### UI/UX Decisions
- **Color Scheme**: Uses brand colors (Mango Yellow, Coral Sunset, Tropical Aqua, Jade Green) for consistent visual branding across UI elements, map pins, and typography.
- **Responsive Design**: Mobile-first approach for optimal viewing on various devices.
- **Interactive Elements**: Typewriter animations, rotating prompts in hero section, and smooth CTA button animations.
- **Accessibility**: Focus on proper accessibility attributes for UI components.

## External Dependencies

### Core
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@googlemaps/react-wrapper**: Google Maps React integration
- **@radix-ui/***: Accessible UI components
- **@tanstack/react-query**: Server state management
- **Firebase Authentication**: User authentication and management
- **Resend**: Email service for contact forms

### Development
- **tsx**: TypeScript execution
- **esbuild**: Production build optimization
- **vite**: Development server and build tool

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling