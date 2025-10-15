import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, CreditCard, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem('oci_ferry_bookings') || '[]');
    const userBookings = allBookings.filter((booking: Booking) => booking.userId === user?.id);
    setBookings(userBookings.sort((a: Booking, b: Booking) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, [user?.id]);

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

  const handleDownloadTicket = (booking: Booking) => {
    // Simulate ticket download
    const ticketData = `
OCI Ferry Ticket
================
Booking ID: ${booking.id}
From: ${booking.route.origin}
To: ${booking.route.destination}
Date: ${booking.date}
Time: ${booking.time}
Seats: ${booking.seats}
Total: ₦${booking.totalAmount.toLocaleString()}
Status: ${booking.status}
Payment ID: ${booking.paymentId}
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oci-ferry-ticket-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't made any ferry bookings. Start by booking your first trip!
          </p>
          <Button className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]">
            Book Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent mb-2">
          Booking History
        </h1>
        <p className="text-muted-foreground">View and manage your ferry bookings</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-[#C8102E]" />
                    <span>{booking.route.origin} → {booking.route.destination}</span>
                  </CardTitle>
                  <CardDescription>
                    Booking ID: {booking.id}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
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
                {booking.status === 'confirmed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadTicket(booking)}
                    className="text-[#C8102E] border-[#C8102E] hover:bg-[#C8102E] hover:text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}