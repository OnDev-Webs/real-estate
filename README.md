
# Jugyah - Mumbai Real Estate Platform

Jugyah is a comprehensive real estate platform designed specifically for the Mumbai market, allowing users to buy, sell, and rent properties across Mumbai and surrounding areas.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Data Structure](#data-structure)
- [Authentication](#authentication)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)

## Overview

Jugyah provides a complete real estate solution with features tailored for the Indian market, specifically Mumbai. The platform serves different user roles including buyers, property owners, real estate agents, and administrators.

## Features

### For Property Seekers
- Browse property listings with detailed information
- Search for properties with advanced filters
- View property details including floor plans
- Filter by BHK configuration, location, and price
- Save favorite properties
- Contact property agents directly

### For Property Owners
- List properties for sale or rent
- Manage property listings
- Track property views and inquiries
- Connect with potential buyers

### For Agents
- Manage client portfolios
- List properties for clients
- Track leads and inquiries
- Communicate with potential buyers

### For Administrators
- Full system oversight
- User management
- Property approval workflow
- Analytics and reporting

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI-based components)
- **Icons**: Lucide React
- **Routing**: React Router Dom 6.26.2
- **State Management**: React Context API, Tanstack Query
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications

### Authentication
- **Method**: JWT (JSON Web Token)
- **User Roles**: Buyer, Owner, Agent, Admin

### Messaging
- **Backend**: Firebase

### Database
- **Type**: MongoDB

## Project Structure

The project follows a component-based architecture with the following main directories:

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Base UI components from shadcn
│   └── dashboard/    # Dashboard-specific components
├── contexts/         # React contexts for state management
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and data
├── pages/            # Page components
├── services/         # API and service integrations
└── assets/           # Static assets
```

## Design System

### Color Scheme
The website uses a clean, black and white color scheme:

- **Primary**: Black (#000000)
- **Primary Foreground**: White (#FFFFFF)
- **Secondary**: Light Gray (#F1F1F1)
- **Secondary Foreground**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Foreground**: Black (#000000)
- **Accent**: Light Gray (#F1F1F1)
- **Border**: Light Gray (#E5E7EB)

### Typography
- **Primary Font**: Figtree (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Base Size**: 16px
- **Heading Sizes**:
  - H1: 3rem (48px)
  - H2: 2.25rem (36px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)

### Components
The UI is built using shadcn/ui components, which provide a consistent design system. Key components include:

- **Buttons**: Primary (black background, white text), Secondary (light gray background, black text), and Outline variants
- **Cards**: Used for property listings and information panels
- **Forms**: Consistent styling with labels, validation, and error states
- **Navigation**: Header with dropdown menus, mobile-responsive sidebar
- **Property Cards**: Standardized display of property information

## Data Structure

### Property Model
Properties are structured with the following key attributes:

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  features: {
    bedrooms: number; // BHK
    bathrooms: number;
    area: number; // square feet
    yearBuilt: number;
    propertyType: 'apartment' | 'house' | 'villa' | 'plot' | 'penthouse';
    status: 'for-sale' | 'for-rent' | 'sold' | 'pending';
    floorPlan?: string; // URL to floor plan image
  };
  amenities: string[];
  images: string[];
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  featured: boolean;
  createdAt: string;
}
```

### User Roles
- **Buyer**: Can browse, favorite, and make inquiries on properties
- **Owner**: Can list and manage their properties
- **Agent**: Can list properties and manage client relationships
- **Admin**: Full system access and management

## Authentication

Authentication is handled through JWT tokens with different permission levels based on user roles. The authentication flow includes:

1. Registration
2. Login
3. Token validation
4. Protected routes
5. Role-based access control

## Installation

To set up the project locally:

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd jugyah

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Development

### Adding New Properties
Properties can be added through the "Add Property" page, accessible from the dashboard. The form includes fields for:

- Property details (title, description, price)
- Location information
- Features (BHK, bathrooms, area)
- Amenities
- Images and floor plans

### Customization
The UI can be customized through:

- Tailwind configuration (`tailwind.config.ts`)
- Component styling (individual component files)
- Global styles (`src/index.css`)

## Deployment

The application can be deployed to various hosting platforms:

1. **Vercel** (recommended)
2. **Netlify**
3. **GitHub Pages**

For production builds:

```sh
npm run build
```

## Future Roadmap

1. **Phase 1: Core Functionality** ✅
   - Setup project structure
   - Create basic UI components
   - Implement routing
   - Create mock data

2. **Phase 2: Authentication and User Roles** ✅
   - Implement JWT authentication
   - Set up user roles and permissions
   - Create login and registration pages
   - Build protected routes

3. **Phase 3: Property Listings** ✅
   - Implement property listing pages
   - Create property details view
   - Add property search functionality
   - Build property cards and gallery

4. **Phase 4: User Dashboard** ✅
   - Create role-specific dashboards
   - Implement property management
   - Build analytics and statistics
   - Add saved properties for buyers

5. **Phase 5: Backend Integration** (In Progress)
   - Connect to MongoDB for data storage
   - Implement Firebase for messaging
   - Set up real API endpoints
   - Replace mock data with real data

6. **Phase 6: Advanced Features** (Planned)
   - Implement real-time notifications
   - Add payment processing
   - Create advanced search filters
   - Build appointment scheduling
   - Add map integration for property locations

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.
