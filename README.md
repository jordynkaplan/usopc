# USOPC Athlete Dashboard

This project is a React-based web application for the United States Olympic & Paralympic Committee (USOPC) to monitor and analyze athlete performance and wellness. It's built using React, TypeScript, and Vite, with additional features for routing, state management, and UI components.

## Key Features

-   Athlete performance tracking
-   Wellness monitoring
-   Athlete comparison tools
-   Responsive design for various devices

## Technology Stack

-   React 18+
-   TypeScript
-   Vite (for fast development and building)
-   React Router for navigation
-   React Query for state management and data fetching
-   Elastic APM for performance monitoring
-   NGINX for serving the static files

## Project Structure

The main application logic is in `src/App.tsx`, which sets up the routing and main layout. Key components include:

-   `Athlete`: Displays individual athlete data
-   `AthleteComparison`: Allows comparison between athletes
-   `Header`: Navigation and app header
-   Custom UI components using a theme provider

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Building for Production

The project uses a multi-stage Dockerfile for building and serving the application:

1. Build stage: Uses Node.js to build the React application
2. Production stage: Uses NGINX to serve the static files

To build and run the Docker container:
