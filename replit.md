# Overview

Smart Garden is a full-stack web application that provides AI-powered plant identification and health analysis. Users can upload photos of their plants to receive instant species identification, health assessments, and personalized care recommendations. The application features a modern React frontend with comprehensive plant care tracking capabilities and real-time weather integration for location-based care tips.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **File Upload**: Multer middleware for handling image uploads with memory storage
- **Image Processing**: Sharp library for image optimization and resizing
- **Storage**: In-memory storage with interface-based design for easy database migration

## Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **Schema**: Drizzle with Zod validation for type-safe database operations
- **Tables**: Users table for authentication, plant_analyses table for storing analysis results
- **Connection**: Neon Database serverless PostgreSQL connection

## Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not fully implemented
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Security**: Password hashing and session-based authentication architecture prepared

## External Service Integrations
- **Plant Identification**: Plant.id API integration for plant species identification and health analysis
- **Weather Data**: OpenWeatherMap API for location-based weather information and care recommendations
- **Geolocation**: Browser geolocation API for automatic location detection
- **Image Optimization**: Client-side image processing with automatic resizing and compression

## Development Tools and Configuration
- **Package Management**: npm with lockfile for consistent dependencies
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development Server**: Vite dev server with HMR and error overlay
- **Build Process**: Separate client and server builds with esbuild for server bundling
- **Environment**: Environment variable configuration for API keys and database connections