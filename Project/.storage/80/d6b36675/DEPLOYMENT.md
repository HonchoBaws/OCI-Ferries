# OCI Ferry - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub account
- Vercel account (free tier available)
- This project code

### 2. Deploy to Vercel

#### Option A: Direct Vercel Deployment
1. **Visit Vercel**: Go to [vercel.com](https://vercel.com)
2. **Sign up/Login**: Use your GitHub account
3. **Import Project**: Click "New Project" → "Import Git Repository"
4. **Connect Repository**: 
   - Upload this project folder as a new GitHub repository
   - Or connect your existing GitHub repository
5. **Configure Build**:
   - Framework Preset: **Vite**
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`
6. **Deploy**: Click "Deploy" button

#### Option B: Vercel CLI (Advanced)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel --prod
```

### 3. Environment Variables (Optional)
If you want to use production Supabase:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 4. Custom Domain (Optional)
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 🔧 Current App Status

### ✅ Ready for Deployment
- ✅ Build configuration complete
- ✅ Vite optimized bundle
- ✅ React Router configured
- ✅ Responsive design
- ✅ Authentication system
- ✅ Database integration (Supabase)

### 📊 Technical Details
- **Framework**: React + Vite + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (with localStorage fallback)
- **Authentication**: Supabase Auth
- **Build Size**: ~544KB optimized

### 🎯 Post-Deployment Tasks
1. **Test all features** on live URL
2. **Update Supabase settings** with production domain
3. **Configure custom domain** (optional)
4. **Set up analytics** (optional)

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm run build
```

### Routing Issues
- Vercel automatically handles SPA routing with the `vercel.json` config

### Environment Issues
- Check environment variables in Vercel dashboard
- Ensure all variables start with `VITE_` for client-side access

## 📱 Features Available After Deployment
- ✅ User registration/login
- ✅ Ferry route browsing
- ✅ Ticket booking system
- ✅ Booking history
- ✅ Admin dashboard
- ✅ Responsive mobile design
- ✅ Demo payment processing

## 🔗 Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)