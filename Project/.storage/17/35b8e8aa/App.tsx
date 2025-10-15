import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/layout/Navbar';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <Auth />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <BookingHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={isAdmin ? 'admin' : currentPage} onNavigate={handleNavigate} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;