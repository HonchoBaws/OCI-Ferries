# OCI Ferry App MVP - Development Plan

## Project Overview
A ferry booking system with user authentication, booking functionality, payment integration, and admin dashboard using red-orange-white color scheme.

## Core Files to Create/Modify

### 1. Authentication & User Management
- `src/contexts/AuthContext.tsx` - Authentication context and state management
- `src/components/auth/LoginForm.tsx` - User login form
- `src/components/auth/SignupForm.tsx` - User registration form
- `src/pages/Auth.tsx` - Authentication page with login/signup toggle

### 2. User App Components
- `src/pages/Dashboard.tsx` - User dashboard with route selection
- `src/components/ferry/RouteCard.tsx` - Ferry route display component
- `src/components/ferry/BookingForm.tsx` - Booking form with date/seat selection
- `src/pages/BookingHistory.tsx` - User booking history page

### 3. Admin Dashboard
- `src/pages/AdminDashboard.tsx` - Admin main dashboard with stats
- `src/components/admin/RouteManager.tsx` - Add/edit/delete routes
- `src/components/admin/BookingManager.tsx` - View all bookings

### 4. Shared Components
- `src/components/layout/Navbar.tsx` - Navigation with role-based menu
- `src/components/ui/PaymentModal.tsx` - Payment processing modal

## Key Features Implementation
1. Role-based authentication (User/Admin)
2. Ferry route listing and booking
3. Payment simulation (Paystack integration placeholder)
4. Booking history and management
5. Admin route and fare management
6. Responsive design with OCI branding

## Color Scheme
- Primary: #C8102E (Red)
- Accent: #FFA500 (Orange) 
- Background: #FFFFFF (White)
- Gradients: Red to Orange

## Data Structure (localStorage simulation)
- Users: {id, email, password, role, name, phone}
- Routes: {id, origin, destination, fare, duration, schedule}
- Bookings: {id, userId, routeId, date, seats, status, paymentId}