import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MapPin, CreditCard, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  user_id: string;
  route_id: string;
  travel_date: string;
  travel_time: string;
  seats: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_reference?: string;
  created_at: string;
  route?: {
    origin: string;
    destination: string;
    fare: number;
  };
}

export default function BookingHistory() {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // Load from localStorage first (for demo)
      const savedBookings = localStorage.getItem('oci_ferry_bookings');
      let userBookings: Booking[] = [];
      
      if (savedBookings) {
        const allBookings = JSON.parse(savedBookings);
        userBookings = allBookings.filter((booking: any) => booking.user_id === user.id);
      }

      // Try to load from Supabase as well
      try {
        const { bookingService } = await import('@/lib/supabase');
        const supabaseBookings = await bookingService.getByUserId(user.id);
        
        // Merge with localStorage bookings (remove duplicates)
        const combinedBookings = [...userBookings];
        supabaseBookings.forEach((sbBooking: any) => {
          if (!combinedBookings.find(b => b.id === sbBooking.id)) {
            combinedBookings.push(sbBooking);
          }
        });
        
        userBookings = combinedBookings;
      } catch (supabaseError) {
        console.log('Supabase not available, using localStorage only');
      }

      // Sort by creation date (newest first)
      userBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setBookings(userBookings);
      
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8102E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={loadBookings}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Booking History
          </h1>
          <p className="text-gray-600">
            View and manage your ferry ticket bookings
          </p>
        </div>

        {/* User Info */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-[#C8102E] text-white rounded-full p-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {userProfile?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't made any ferry bookings. Start by booking your first trip!
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
              >
                Book Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-[#C8102E]" />
                        <span>
                          {booking.route?.origin || 'Unknown'} → {booking.route?.destination || 'Unknown'}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Booking ID: {booking.id}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Travel Date</p>
                        <p className="text-sm text-gray-600">{booking.travel_date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Departure Time</p>
                        <p className="text-sm text-gray-600">{booking.travel_time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                        <p className="text-sm text-gray-600">₦{booking.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          {booking.seats} seat{booking.seats !== 1 ? 's' : ''} • 
                          Booked on {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {booking.payment_reference && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Payment Reference</p>
                          <p className="text-xs font-mono text-gray-700">{booking.payment_reference}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}