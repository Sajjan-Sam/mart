# HostelMart - Student Marketplace

## Overview

HostelMart is a web application designed as a marketplace for hostel students to buy and sell items. The application features a modern, responsive design built with React on the frontend and Express.js on the backend. Key functionality includes product listings, item requests, user suggestions, and an admin dashboard for managing the marketplace.

The application supports core marketplace features like product browsing with search and filtering, direct seller contact via WhatsApp integration, item request submissions, suggestion feedback system, and comprehensive admin management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod for validation and type safety
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Data Storage**: In-memory storage with interface design for easy database migration
- **Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Ready for connect-pg-simple integration with PostgreSQL

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Schema**: Comprehensive data model including:
  - Users table for authentication
  - Products table with detailed item information (price, condition, images, seller details)
  - Requests table for item requests with approval workflow
  - Suggestions table for user feedback with categorization and priority

### API Architecture
- **Pattern**: RESTful API design with consistent response formats
- **Routes**: Organized by resource type (products, requests, suggestions, admin)
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Validation**: Input validation using shared Zod schemas

### Authentication & Authorization
- **Admin Access**: Simple password-based admin authentication
- **Security**: Prepared for session-based authentication with PostgreSQL session store
- **Access Control**: Admin-only routes for management functions

### Key Features Implementation
- **Product Management**: Full CRUD operations with image support and seller contact
- **Request System**: Users can request items with approval workflow
- **Suggestion System**: Categorized feedback collection with priority levels
- **Search & Filter**: Real-time product filtering by name, description, and category
- **WhatsApp Integration**: Direct seller contact with pre-filled messages
- **Responsive Design**: Mobile-first design with comprehensive component library

### Development & Deployment
- **Development**: Hot reload with Vite, TypeScript checking, and error overlay
- **Build Process**: Separate client and server builds with ESM support
- **Code Organization**: Monorepo structure with shared types and schemas
- **Testing Ready**: Component architecture suitable for testing frameworks

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for production
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with @hookform/resolvers for validation
- **wouter**: Lightweight React router

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework with custom design system
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development features

### Validation and Utilities
- **zod**: Schema validation shared between client and server
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation
- **date-fns**: Date manipulation utilities

### Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for production
- **drizzle-kit**: Database migration and management tools

The application is architected for scalability with clear separation between client and server code, shared type definitions, and a database-agnostic storage interface that currently uses in-memory storage but is designed for easy PostgreSQL integration.