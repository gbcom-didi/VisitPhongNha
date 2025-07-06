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
- **Provider**: Firebase Authentication with Google, Facebook, and email/password options
- **Backend Integration**: Firebase Admin SDK for server-side token verification
- **User Management**: Automatic user creation, role assignment, and profile management
- **Protected Routes**: Firebase token-based middleware protection
- **Role System**: Admin, business owner, and viewer roles with hierarchical permissions

### Frontend Features
- **Interactive Map**: Google Maps API integration for location visualization
- **Business Directory**: Searchable and filterable business listings
- **Favorites System**: User-specific business bookmarking
- **Responsive Design**: Mobile-first approach with desktop optimization
- **SEO Optimization**: Meta tags and structured data for search engines

### API Endpoints
- **Firebase Auth Routes**: User authentication, token verification, and profile sync
- **Firebase Config**: Secure configuration endpoint for client-side Firebase setup
- **Business Routes**: CRUD operations for business listings with role-based access
- **Category Routes**: Category management and filtering
- **Like Routes**: User favorites management with Firebase authentication

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
- **FIREBASE_API_KEY**: Firebase API key for server-side operations
- **FIREBASE_AUTH_DOMAIN**: Firebase authentication domain
- **FIREBASE_PROJECT_ID**: Firebase project identifier
- **FIREBASE_STORAGE_BUCKET**: Firebase storage bucket URL
- **FIREBASE_MESSAGING_SENDER_ID**: Firebase messaging sender ID
- **FIREBASE_APP_ID**: Firebase application ID
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
- June 25, 2025. Implemented Inspiration section with editorial articles
  - Created article database schema with coordinates, tags, and content
  - Built responsive article grid page with search and tag filtering
  - Implemented split-screen article detail view with interactive map
  - Added sample articles with authentic Phong Nha content and locations
  - Integrated Inspiration link into sidebar navigation with BookOpen icon
  - Updated pages to use consistent sidebar navigation (removing footer on Inspiration pages)
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
- June 25, 2025. Implemented Firebase authentication system
  - Replaced Replit Auth with Firebase Authentication
  - Added Google, Facebook, and email/password sign-in options
  - Created Firebase Admin SDK integration for server-side authentication
  - Built comprehensive authentication context with role-based permissions
  - Updated all navigation components and login links throughout the site
  - Implemented secure Firebase configuration endpoint for client access
  - Added user synchronization between Firebase and PostgreSQL database
  - Created sign-in modal with multiple authentication methods
  - Integrated Firebase tokens for authenticated API requests
- June 26, 2025. Enhanced navigation with saved places access
  - Added heart icon to sidebar navigation for authenticated users
  - Heart icon links directly to saved places page with visual feedback
  - Icon only visible when user is logged in with red styling and fill effect
  - Granted admin privileges to glenbowdencom@gmail.com for full system access
- June 26, 2025. Fixed Firebase authentication middleware chain for business updates
  - Resolved authentication issue where Firebase token verification wasn't properly chained
  - Added email-based user lookup fallback for existing database records
  - Fixed middleware ordering in PUT routes for business updates
  - Business update functionality now working correctly for admin users
  - Admin panel fully operational with proper role-based access control
- June 26, 2025. Enhanced inspiration article split screen layout
  - Fixed split screen layout with proper height and independent scrolling for article content
  - Updated article content to display full HTML with enhanced typography styling
  - Added map with correct location pin showing article coordinates
  - Removed unnecessary map overlay box for cleaner map display
  - Improved article content CSS with proper headings, paragraphs, lists, and code styling
  - Implemented responsive mobile layout with always-visible map below article content
  - Mobile shows complete article first followed by interactive map for optimal reading flow
- June 26, 2025. Improved mobile navigation and explore page UX
  - Made "Visit Phong Nha" text smaller on mobile screens while maintaining mango-yellow color
  - Removed "Saved" section from bottom of mobile explore page for cleaner interface
  - Added "Saved Places" option to hamburger menu for logged-in users
  - Reduced padding and height of mobile navigation bar for more screen space
  - Made logo and brand text clickable to link to homepage
  - Removed Featured button and grey +1 tag bubble from inspiration page
  - Removed blue outline highlight from featured article cards for cleaner design
- June 26, 2025. Implemented interactive map hover highlighting
  - Added visual highlighting for map markers when hovering over business cards
  - Map markers turn black and increase in size (36px to 48px) when corresponding business card is hovered
  - Map automatically pans and zooms to show hovered business location
  - All markers reset to normal color and size when hover ends
  - Enhanced user experience with smooth pan and zoom animations
- June 27, 2025. Fixed React console warnings and TypeScript errors
  - Added missing DialogDescription to BusinessModal for proper accessibility
  - Fixed TypeScript rating field errors with parseFloat conversions and null handling
  - Updated Map component render function to always return ReactElement instead of null
  - Applied consistent rating number formatting (toFixed(1)) across business cards, modals, and favorites page
  - Resolved all React warnings and TypeScript compilation errors for cleaner console output
- June 30, 2025. Implemented comprehensive guestbook system
  - Created complete guestbook database schema with entries, comments, and likes functionality
  - Added guestbook_entries table with author info, messages, nationality, location data, and business references
  - Added guestbook_comments table for threaded discussions under entries
  - Added guestbook_entry_likes and guestbook_comment_likes tables for user engagement
  - Built complete REST API backend with Firebase authentication integration
  - Created responsive frontend guestbook page with forms, comments, and like functionality
  - Added guestbook navigation links to both main navigation and sidebar with BookOpen icon
  - Integrated business listing references allowing travelers to tag experiences to specific places
  - Implemented optimistic updates for instant like feedback and comprehensive error handling
  - Added location support for both text descriptions and Google Maps URLs
  - Restored sample business and article data after database schema updates
  - Enhanced location field with "Google Maps URL" label and help tooltip with step-by-step instructions
  - Improved form usability with clear guidance on obtaining Google Maps sharing links
- June 30, 2025. Enhanced guestbook user experience and navigation
  - Removed all like functionality from guestbook entries and comments for simplified interface
  - Added "Add Comment" button for signed-out users that prompts sign-in with helpful toast message
  - Fixed "Sign In to Continue" button to properly open Firebase authentication modal
  - Added Guestbook option to mobile navigation menu on explore page for complete mobile access
  - Streamlined guestbook focus on experience sharing and threaded commenting without distractions
- July 1, 2025. Complete home page redesign with intelligent travel companion focus
  - Redesigned entire home page layout emphasizing Visit Phong Nha as intelligent travel companion
  - Added "What is Visit Phong Nha?" section explaining platform's purpose and local expertise
  - Created beautiful features highlight section with side-by-side layout and cave exploration imagery
  - Implemented premium business carousel showcasing featured places with smooth navigation
  - Updated all headings to smaller sizes with brand color themes (mango-yellow, chili-red, tropical-aqua, jade-green)
  - Reduced body text sizes for better typography hierarchy and readability
  - Fixed icon visibility issues by properly configuring Tailwind CSS brand colors
  - Changed icons to themed versions: Map (mango-yellow), Heart (chili-red), Lightbulb (tropical-aqua), Book (jade-green)
  - Updated "Featured Premium Places" to "Featured Places" for cleaner messaging
  - Enhanced mobile responsiveness and visual polish throughout entire home page experience
- July 3, 2025. Fixed homepage authentication inconsistency
  - Resolved issue where signed-in and signed-out users saw different homepage versions
  - All users now see the same beautiful "Your Gateway to Adventure" landing page
  - Removed conditional routing that showed different components based on authentication status
  - Maintained consistent user experience with Interactive Explorer and Personal Collection features
- July 3, 2025. Fixed business modal Google Maps URL integration
  - Updated "View on Google Maps" button to use Google Maps URL field from admin form
  - Business modal now prioritizes stored Google Maps URL over coordinate-generated URLs
  - Falls back to coordinate-based URL generation when Google Maps URL field is empty
  - Provides direct access to specific Google Maps place pages when configured
- July 3, 2025. Imported comprehensive Google Maps business directory from CSV data
  - Added 40 new authentic businesses from Google Maps API search results  
  - Imported complete business data including ratings, reviews, photos, and contact information
  - Enhanced database with restaurants, accommodations, adventure tours, attractions, cafes, and lodges
  - Businesses now include authentic Google Maps URLs, galleries, and verified location data
  - Total business count increased from 49 to 89 verified local establishments
  - Comprehensive coverage of Phong Nha region including Đồng Hới, Bố Trạch, and Minh Hóa areas
  - Automatic category assignment based on business type and services offered
- July 4, 2025. Fixed Chrome browser compatibility for business modal links
  - Replaced all window.open() calls with proper anchor tags using target="_blank"
  - Fixed booking buttons (Booking.com, Agoda, Affiliate) to work consistently across browsers
  - Updated "Visit Website" button to use native link behavior instead of JavaScript
  - Fixed "View on Google Maps" and "Get Directions" links for cross-browser compatibility
  - Added proper rel="noopener noreferrer" attributes for security and performance
  - Removed unused handler functions and cleaned up code structure
- July 5, 2025. Fixed business category filtering and removed unwanted filter categories
  - Removed "Attraction", "Restaurant", and "Recreation" categories from business filters
  - Reassigned 5 Recreation businesses to appropriate categories (Adventure, Attractions, Caves)
  - Fixed category filtering logic to check multiple categories per business instead of just primary category
  - Cleaned up duplicate category assignments in database for improved data integrity
  - All Cave businesses now display correctly when filtering by Caves category
  - Business filters now show only 6 relevant categories: Accommodation, Adventure, Attractions, Caves, Food & Drink, Street Food
- July 6, 2025. Updated map pin colors to match brand theme colors
  - Updated all category colors in database to use brand theme colors (Mango Yellow, Coral Sunset, Tropical Aqua, Jade Green)
  - Updated Google Maps marker icon colors to match business categories with brand theme
  - Accommodation pins now display in Mango Yellow (#F4B942), Adventure in Coral Sunset (#F87D51)
  - Attractions pins use Tropical Aqua (#00BCD4), Caves use Jade Green (#6DBFB3)
  - Food & Drink pins use Coral Sunset (#F87D51), Street Food uses Mango Yellow (#F4B942)
  - Map pins now provide consistent visual branding that matches category filter colors throughout the site
- July 6, 2025. Implemented interactive map pin tooltips with business names
  - Added custom black tooltip overlay with white text displaying business names
  - Tooltips appear when hovering over map pins directly showing business name above the pin
  - Tooltips also appear on map when hovering over business cards in the directory listing
  - Tooltip positioning automatically adjusts to stay above the map pin with proper spacing
  - Enhanced user experience with immediate visual feedback for both map and card interactions
- July 6, 2025. Added consistent hover effects for map pins and business cards
  - Map pins now turn black and enlarge (36px to 48px) when hovered directly, matching business card hover behavior
  - Clean black tooltip displays business name without Google Maps default styling (no white box or arrow)
  - Consistent visual feedback between hovering over business cards and map pins
  - Enhanced interactive experience with immediate visual response on both map and directory elements
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```