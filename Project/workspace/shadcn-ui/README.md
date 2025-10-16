# OCI Ferry - Lagos Ferry Booking System

A modern web application for booking ferry tickets across Lagos waterways. Built with React, TypeScript, and Supabase.

## 🚢 Features

### For Passengers
- **Browse Ferry Routes** - View available routes with schedules and pricing
- **Book Tickets** - Complete booking flow with passenger details
- **Booking History** - Track all your ferry reservations
- **User Authentication** - Secure login and registration

### For Administrators
- **Route Management** - Add, edit, and manage ferry routes
- **Booking Overview** - View all passenger bookings
- **Dashboard Analytics** - Track bookings and revenue

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **State Management**: React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd oci-ferry

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Environment Setup
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Available Scripts

```bash
# Development
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint

# Deployment
vercel --prod         # Deploy to Vercel
```

## 🗺️ Ferry Routes

### Current Routes
1. **Lagos Island ↔ Victoria Island** - ₦2,500 (45 min)
2. **Marina ↔ Ikoyi** - ₦2,000 (30 min)  
3. **Apapa ↔ Tin Can Island** - ₦1,800 (25 min)
4. **Lekki Phase 1 ↔ Banana Island** - ₦3,500 (20 min)

### Schedule
- Multiple daily departures from 6:00 AM to 6:00 PM
- Total capacity: 450+ passengers across all routes
- 25+ daily trips

## 👥 User Roles

### Regular Users
- Browse and book ferry tickets
- View booking history
- Manage profile

### Admin Users
- All user permissions
- Manage ferry routes
- View all bookings
- Access analytics dashboard

**Admin Account**: `admin@ociferry.com` / `admin123`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ferry/          # Ferry-specific components
├── contexts/           # React Context providers
├── lib/               # Utility functions and configs
├── pages/             # Application pages
└── hooks/             # Custom React hooks
```

## 🔐 Authentication

- **Supabase Auth** for secure user management
- **Row Level Security** for data protection
- **Admin role** for administrative access
- **Email verification** for new accounts

## 💾 Database Schema

### Key Tables
- `app_407984ad48_user_profiles` - User profile information
- `app_407984ad48_routes` - Ferry route definitions
- `app_407984ad48_bookings` - Ticket bookings

## 🎨 Design System

- **Colors**: Red (#C8102E) and Orange (#FFA500) gradient theme
- **Typography**: Modern, clean fonts
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first design approach

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected for Vite)
3. Add environment variables
4. Deploy with one click

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL migrations (provided in `/sql` folder)
3. Configure authentication settings
4. Add environment variables

### Payment Integration
Currently using demo payment processing. To integrate real payments:
1. Set up Paystack account
2. Add Paystack keys to environment
3. Update payment components

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Progressive Web App ready
- Optimized for mobile booking flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for Lagos Ferry Transportation**