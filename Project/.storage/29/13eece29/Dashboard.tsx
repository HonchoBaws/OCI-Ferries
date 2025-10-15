import React, { useState, useEffect } from 'react';
import { RouteCard } from '@/components/ferry/RouteCard';
import { BookingForm } from '@/components/ferry/BookingForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Users, Clock, MapPin } from 'lucide-react';

interface Route {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  duration: string;
  schedule: string[];
  capacity: number;
}

export default function Dashboard() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    loadRoutes();
    
    // Listen for route updates from admin panel
    const handleRoutesUpdated = () => {
      loadRoutes();
    };
    
    window.addEventListener('routesUpdated', handleRoutesUpdated);
    
    return () => {
      window.removeEventListener('routesUpdated', handleRoutesUpdated);
    };
  }, []);

  const loadRoutes = () => {
    // Initialize sample routes if not exists
    const savedRoutes = localStorage.getItem('oci_ferry_routes');
    if (!savedRoutes) {
      const sampleRoutes: Route[] = [
        {
          id: 'route-1',
          origin: 'Lagos Island',
          destination: 'Victoria Island',
          fare: 2500,
          duration: '45 minutes',
          schedule: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
          capacity: 150
        },
        {
          id: 'route-2',
          origin: 'Marina',
          destination: 'Ikoyi',
          fare: 2000,
          duration: '30 minutes',
          schedule: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'],
          capacity: 120
        },
        {
          id: 'route-3',
          origin: 'Apapa',
          destination: 'Tin Can Island',
          fare: 1800,
          duration: '25 minutes',
          schedule: ['06:30', '08:30', '10:30', '12:30', '14:30', '16:30'],
          capacity: 100
        },
        {
          id: 'route-4',
          origin: 'Lekki Phase 1',
          destination: 'Banana Island',
          fare: 3500,
          duration: '20 minutes',
          schedule: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
          capacity: 80
        }
      ];
      localStorage.setItem('oci_ferry_routes', JSON.stringify(sampleRoutes));
      setRoutes(sampleRoutes);
    } else {
      setRoutes(JSON.parse(savedRoutes));
    }
  };

  const handleBookRoute = (route: Route) => {
    setSelectedRoute(route);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingOpen(false);
    setSelectedRoute(null);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedRoute(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent mb-2">
          Ferry Routes
        </h1>
        <p className="text-muted-foreground">Choose your preferred route and book your ferry ticket</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-4">
            <Ship className="h-8 w-8 text-[#C8102E] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Routes</p>
              <p className="text-2xl font-bold">{routes.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <MapPin className="h-8 w-8 text-[#FFA500] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Destinations</p>
              <p className="text-2xl font-bold">{new Set(routes.map(r => r.destination)).size}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-[#C8102E] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
              <p className="text-2xl font-bold">{routes.reduce((sum, r) => sum + r.capacity, 0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-[#FFA500] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Daily Trips</p>
              <p className="text-2xl font-bold">{routes.reduce((sum, r) => sum + r.schedule.length, 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onBook={handleBookRoute}
          />
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No routes available</h3>
          <p className="text-muted-foreground mb-4">Please contact admin to add ferry routes.</p>
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          {selectedRoute && (
            <BookingForm
              route={selectedRoute}
              onClose={handleCloseBooking}
              onSuccess={handleBookingSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}