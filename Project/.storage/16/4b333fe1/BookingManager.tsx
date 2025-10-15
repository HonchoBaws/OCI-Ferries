import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, CreditCard, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  userId: string;
  routeId: string;
  route: {
    origin: string;
    destination: string;
    fare: number;
  };
  date: string;
  time: string;
  seats: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentId: string;
  createdAt: string;
}

export const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem('oci_ferry_bookings') || '[]');
    const sortedBookings = allBookings.sort((a: Booking, b: Booking) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setBookings(sortedBookings);
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    
    localStorage.setItem('oci_ferry_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalRevenue = () => {
    return filteredBookings
      .filter(booking => booking.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">View and manage all ferry bookings</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Revenue (Filtered)</p>
          <p className="text-2xl font-bold text-[#C8102E]">₦{getTotalRevenue().toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, route, or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No bookings have been made yet.'
              }
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-[#C8102E]" />
                      <span>{booking.route.origin} → {booking.route.destination}</span>
                    </CardTitle>
                    <CardDescription>
                      Booking ID: {booking.id} | Payment ID: {booking.paymentId}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.seats} seat{booking.seats > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">₦{booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                  <div className="flex space-x-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Mark Completed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'cancelled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};