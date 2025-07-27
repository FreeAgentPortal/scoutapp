# Authentication Feature

## Overview

The authentication system provides secure access control for the FAP Scout application with token-based authentication and protected routes.

## Features

### User Authentication

- **Token-based Authentication**: Uses JWT tokens stored in localStorage
- **Automatic Token Refresh**: Handles token validation and refresh
- **Secure Logout**: Clears tokens and redirects appropriately

### Protected Routes

- **AuthGuard Layout**: Protects all application routes
- **Automatic Redirects**: Unauthenticated users see login screen
- **Loading States**: Smooth loading experience during authentication checks

### User Management

- **User Profile Data**: Fetches and caches user information
- **Role-based Access**: Supports different user roles (scout, admin, etc.)
- **Permission System**: Extensible permission framework

## Components

### Layout Components

#### AuthProvider (`/layout/authProvider/AuthProvider.layout.tsx`)

- Manages global authentication state
- Provides authentication context to the entire app
- Handles token storage and validation
- Manages user data fetching with React Query

#### AuthGuard (`/layout/authGuard/AuthGuard.layout.tsx`)

- Protects application routes
- Shows appropriate view based on authentication state
- Handles loading and error states

### View Components

#### LoginView (`/views/auth/LoginView.tsx`)

- Beautiful mobile-first login interface
- Animated UI with Framer Motion
- Handles authentication server redirects
- Token extraction from URL parameters

#### LoadingView (`/views/auth/LoadingView.tsx`)

- Animated loading screen during authentication
- Branded loading experience
- Mobile-optimized design

#### DashboardView (`/views/dashboard/DashboardView.tsx`)

- Main authenticated user interface
- Action cards for core scout functions
- User profile display
- Logout functionality

## State Management

### Authentication State

```typescript
interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}
```

### User Data

- Fetched using React Query with infinite stale time
- Cached for optimal performance
- Automatically refetches on token changes

## Authentication Flow

1. **App Load**: AuthProvider checks for stored token
2. **Token Validation**: Attempts to fetch user data with token
3. **Route Protection**: AuthGuard evaluates authentication state
4. **Login Process**: Redirects to external authentication server
5. **Token Receipt**: Extracts token from redirect URL
6. **User Data Fetch**: Retrieves user profile information
7. **Dashboard Access**: Shows authenticated user interface

## Mobile-First Design

### Responsive Layouts

- Touch-friendly button sizes (minimum 48px)
- Optimized for portrait orientation
- Flexible grid layouts

### Animations

- Smooth entrance animations
- Loading state feedback
- Interactive button animations
- Gesture-friendly interactions

### Performance

- Lazy loading of heavy components
- Optimized image and asset loading
- Minimal bundle size for mobile networks

## Security Features

### Token Management

- Secure localStorage storage
- Automatic token cleanup on errors
- Expiration handling

### Route Protection

- All routes protected by default
- No sensitive data exposure to unauthenticated users
- Secure logout process

### Error Handling

- Graceful authentication error handling
- Automatic token cleanup on 401 errors
- User-friendly error messages
