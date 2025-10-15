import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RouteCard } from '@/components/ferry/RouteCard';
import { BookingForm } from '@/components/ferry/BookingForm';
import { useAuth } from '@/contexts/AuthContext';
import { routeService, Route } from '@/lib/supabase';
import { Ship, User, LogOut, History, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, userProfile, isAdmin, signOut } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const fetchedRoutes = await routeService.getAll();
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
      toast.error('Failed to load ferry routes');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (route: Route) => {
    setSelectedRoute(route);
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
    setSelectedRoute(null);
    toast.success('Booking completed successfully!');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigateToBookingHistory = () => {
    window.location.href = '/booking-history';
  };

  const navigateToAdminDashboard = () => {
    window.location.href = '/admin';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-8 w-8 animate-spin mx-auto mb-4 text-[#C8102E]" />
          <p>Loading ferry routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Ship className="h-8 w-8 text-[#C8102E]" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent">
                OCI Ferry
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile Info */}
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{userProfile?.name || user?.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-xs">
                      {isAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateToBookingHistory}
                className="flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>My Bookings</span>
              </Button>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToAdminDashboard}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBookingForm && selectedRoute ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Ferry Ticket</CardTitle>
                <CardDescription>
                  Complete your booking for {selectedRoute.origin} to {selectedRoute.destination}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingForm
                  route={selectedRoute}
                  onBookingComplete={handleBookingComplete}
                  onCancel={() => setShowBookingForm(false)}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to OCI Ferry Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Book your ferry tickets for comfortable and safe water transportation across Lagos waterways.
              </p>
            </div>

            {routes.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-8">
                  <Ship className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Available</h3>
                  <p className="text-gray-600">
                    Ferry routes will appear here once they are added by the administrator.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}