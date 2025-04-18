
# Real Estate Platform - Comprehensive Documentation

## System Architecture Overview

This platform is built as a full-stack web application with:
- React/TypeScript frontend
- Node.js/Express backend
- MongoDB database
- JWT authentication

## Setup Instructions

### Prerequisites
- Node.js v16+ and npm
- MongoDB running locally or a cloud instance
- Cloudinary account for image uploads

### Environment Setup

1. **Backend (.env in server directory)**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. **Frontend (.env in root directory)**
```
VITE_API_URL=http://localhost:5000/api
```

### Installation Steps

1. **Install backend dependencies**
```bash
cd server
npm install
```

2. **Install frontend dependencies**
```bash
cd ..
npm install
```

3. **Start the backend server**
```bash
cd server
npm start
```

4. **Start the frontend development server**
```bash
cd ..
npm run dev
```

## Common Issues and Solutions

### Authentication Issues

- **Problem**: JWT token issues
- **Solution**: Check token expiration, ensure localStorage has correct token

```javascript
// Verify token in localStorage
const token = localStorage.getItem('authToken');
console.log('Token exists:', !!token);
```

### Property Image Upload Issues

- **Problem**: Failed image uploads
- **Solution**: 
  1. Verify Cloudinary credentials
  2. Ensure FormData is properly structured
  3. Don't set Content-Type header manually for multipart/form-data
  
```javascript
// Correct way to upload images
const formData = new FormData();
images.forEach(image => {
  formData.append('images', image);
});

const options = {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
  body: formData
};

// Don't set Content-Type for multipart/form-data
```

### Admin Dashboard Not Loading

- **Problem**: Admin routes or authorization issues
- **Solution**: 
  1. Verify user role permissions
  2. Check API endpoint paths
  3. Ensure proper authorization middleware

```javascript
// Debug auth state
console.log('Current user:', localStorage.getItem('user'));
```

### React Form Context Errors

- **Problem**: "Cannot destructure property 'getFieldState' of 'useFormContext(...)'"
- **Solution**: 
  1. Ensure components using Form hooks are within Form provider
  2. For uncontrolled inputs, don't mix defaultValue and value props
  3. Replace complex form components with standard HTML inputs
  
```jsx
// Instead of FormField with useFormContext, use simple inputs:
<div className="space-y-2">
  <label htmlFor="field">Label</label>
  <Input 
    id="field"
    value={value || ""} 
    onChange={(e) => updateValue(e.target.value)} 
  />
</div>
```

### Route Protection Issues

- **Problem**: Unauthorized access or redirect loops
- **Solution**: 
  1. Check ProtectedRoute and AdminRoute components
  2. Verify localStorage token and user data persistence
  3. Ensure correct role checking logic

### API Connection Issues

- **Problem**: "Failed to fetch" errors
- **Solution**: 
  1. Check backend server status
  2. Verify API URL configuration
  3. Check for CORS issues
  4. Ensure proper token inclusion in requests

## System Architecture

### Frontend Structure
- `/src/components/` - Reusable UI components
- `/src/pages/` - Page components that use route parameters
- `/src/contexts/` - React context providers
- `/src/services/` - API service functions
- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Utility functions and helpers

### Backend Structure
- `/server/routes/` - API route definitions
- `/server/controllers/` - Business logic for routes
- `/server/models/` - Mongoose data models
- `/server/middlewares/` - Express middlewares (auth, etc.)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Properties
- `GET /properties` - Get all properties
- `POST /properties` - Create property
- `GET /properties/:id` - Get property by ID
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

### Dashboard
- `GET /properties/dashboard/stats` - Get dashboard statistics
- `GET /properties/dashboard/active-listings` - Get active listings
- `GET /properties/dashboard/today-leads` - Get today's leads

### Admin
- `GET /admin/users-with-properties` - Get all users with properties
- `PUT /admin/users/:userId/role` - Update user role
- `GET /admin/properties-with-owners` - Get all properties with owners

## Debugging Tips

1. **Check Console Logs**: Browser console provides valuable error information
2. **Use Network Tab**: Monitor API requests/responses in browser DevTools
3. **Verify Environment Variables**: Double check all configuration variables
4. **Authenticate Requests**: Ensure Bearer tokens are included with requests
5. **Check Component Props**: Verify all required props are passed correctly
6. **Validate Form Data**: Log form data before submission to verify structure

## User Roles and Permissions

- **Admin**: Full system access, manage users, properties
- **Agent**: Create/manage properties, contact owners/buyers
- **Owner**: List/manage own properties, receive inquiries
- **Buyer**: Browse properties, save favorites, contact owners/agents

## Notification System

The notification system is designed to:
1. Send realtime updates to users
2. Store notifications in the database
3. Mark as read/unread
4. Support various notification types (property inquiries, messages, etc.)

## Troubleshooting Form Context Errors

If you encounter React form context errors:

1. Check component hierarchy - form components must be within `<Form>` context
2. Don't mix controlled and uncontrolled inputs (avoid setting both `value` and `defaultValue`)
3. Use standard HTML form elements instead of form context when appropriate
4. Ensure proper dependencies are installed (`react-hook-form` and its dependencies)
