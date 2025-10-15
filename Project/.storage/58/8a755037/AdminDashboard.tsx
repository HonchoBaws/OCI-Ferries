import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RouteManager } from '@/components/admin/RouteManager';
import { useAuth } from '@/contexts/AuthContext';
import { routeService, bookingService, Route, Booking } from '@/lib/supabase';
import { Ship, User, LogOut, BarChart3, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, userProfile, isAdmin, signOut } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'bookings'>('overview');

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      window.location.href = '/';
      return;
    }
    
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [fetchedRoutes, fetchedBookings] = await Promise.all([
        routeService.getAll(),
        bookingService.getAll()
      ]);
      setRoutes(fetchedRoutes);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigateToUserDashboard = () => {
    window.location.href = '/';
  };

  const handleRouteUpdate = () => {
    loadData(); // Reload data when routes are updated
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button onClick={navigateToUserDashboard}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-8 w-8 animate-spin mx-auto mb-4 text-[#C8102E]" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter(booking => booking.payment_status === 'successful')
    .reduce((sum, booking) => sum + booking.total_amount, 0);

  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Ship className="h-8 w-8 text-[#C8102E]" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent">
                OCI Ferry Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile Info */}
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{userProfile?.name || user?.email}</p>
                  <Badge variant="destructive" className="text-xs">
                    Admin
                  </Badge>
                </div>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateToUserDashboard}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>User View</span>
              </Button>

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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'routes'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Routes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Bookings</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Routes</p>
                      <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
                    </div>
                    <MapPin className="h-8 w-8 text-[#C8102E]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-[#FFA500]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</p>
                    </div>
                    <Ship className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest ferry bookings from customers</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.route?.origin} → {booking.route?.destination}</p>
                          <p className="text-sm text-gray-600">{booking.travel_date} at {booking.travel_time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{booking.total_amount.toLocaleString()}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'routes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Route Management</h2>
            <RouteManager routes={routes} onRouteUpdate={handleRouteUpdate} />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Bookings</h2>
            <Card>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookings found</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{booking.route?.origin} → {booking.route?.destination}</p>
                          <p className="text-sm text-gray-600">
                            {booking.travel_date} at {booking.travel_time} • {booking.seats} seat(s)
                          </p>
                          <p className="text-xs text-gray-500">Booking ID: {booking.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{booking.total_amount.toLocaleString()}</p>
                          <div className="flex space-x-2 mt-1">
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                            <Badge variant={booking.payment_status === 'successful' ? 'default' : 'destructive'}>
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}