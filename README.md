# USOPC Athlete Dashboard

This project is a React-based web application for the United States Olympic & Paralympic Committee (USOPC) to monitor and analyze athlete performance and wellness. It's built using React, TypeScript, and Vite, with additional features for routing, state management, and UI components.

Live website: [https://usopc.kaplan-project.com](https://usopc.kaplan-project.com)

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
-   Python for data pre-processing and API

## Project Structure

The main application logic is in `src/App.tsx`, which sets up the routing and main layout. Key components include:

-   `Athlete`: Displays individual athlete data
-   `AthleteComparison`: Allows comparison between athletes
-   `Header`: Navigation and app header
-   Custom UI components using a theme provider

## Data Pre-processing and API

The project includes two Python scripts for data handling:

1. Data Pre-processing (`manual-data-processing/main.py`):

    - Reads the raw CSV file (`Results.csv`)
    - Computes Time Delta columns for Best, Heat 1, and Heat 2
    - Calculates Percentage Time Delta columns
    - Generates a computed Competition ID column
    - Saves the processed data to a new CSV file (`ResultsWithFeatures.csv`)

2. Lightweight REST API (`backend/main.py`):
    - Uses the Bottle framework (as specified in `backend/requirements.txt`)
    - Loads the pre-processed data
    - Provides endpoints for data analysis, including correlation calculations
    - Generates scatter plots for performance metrics vs. wellness factors
    - Serves the processed data to the frontend

This approach allows for efficient data processing and analysis without the need for a full-fledged Django backend. The Bottle-based API provides a simple yet effective way to serve the required data to the frontend application.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. To run the backend API:
    - Install Python dependencies: `pip install -r backend/requirements.txt`
    - Run the API: `python backend/main.py`

## Building for Production

The project uses a multi-stage Dockerfile for building and serving the application:

1. Build stage: Uses Node.js to build the React application
2. Production stage: Uses NGINX to serve the static files

To build and run the Docker container:
