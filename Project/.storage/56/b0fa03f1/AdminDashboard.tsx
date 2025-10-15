import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RouteManager } from '@/components/admin/RouteManager';
import { BookingManager } from '@/components/admin/BookingManager';
import { Ship, Users, CreditCard, TrendingUp, Calendar, MapPin } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalRoutes: number;
  todayBookings: number;
  monthlyRevenue: number;
}

interface StoredUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
}

interface StoredBooking {
  id: string;
  userId: string;
  totalAmount: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalRoutes: 0,
    todayBookings: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const users = JSON.parse(localStorage.getItem('oci_ferry_users') || '[]') as StoredUser[];
    const bookings = JSON.parse(localStorage.getItem('oci_ferry_bookings') || '[]') as StoredBooking[];
    const routes = JSON.parse(localStorage.getItem('oci_ferry_routes') || '[]');

    const totalUsers = users.filter((user: StoredUser) => user.role === 'user').length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum: number, booking: StoredBooking) => sum + booking.totalAmount, 0);
    const totalRoutes = routes.length;

    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter((booking: StoredBooking) => 
      booking.createdAt.split('T')[0] === today
    ).length;

    // This month's revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = bookings
      .filter((booking: StoredBooking) => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, booking: StoredBooking) => sum + booking.totalAmount, 0);

    setStats({
      totalUsers,
      totalBookings,
      totalRevenue,
      totalRoutes,
      todayBookings,
      monthlyRevenue
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage routes, bookings, and monitor performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-[#C8102E] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-[#FFA500] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <CreditCard className="h-8 w-8 text-[#C8102E] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Ship className="h-8 w-8 text-[#FFA500] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Routes</p>
              <p className="text-2xl font-bold">{stats.totalRoutes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-[#C8102E] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
              <p className="text-2xl font-bold">{stats.todayBookings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <MapPin className="h-8 w-8 text-[#FFA500] mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">₦{stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="routes">Route Management</TabsTrigger>
          <TabsTrigger value="bookings">Booking Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="routes" className="space-y-4">
          <RouteManager onUpdate={calculateStats} />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}