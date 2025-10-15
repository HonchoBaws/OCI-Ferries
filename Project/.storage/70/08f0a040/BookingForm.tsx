import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, Users, CreditCard, X } from 'lucide-react';
import { toast } from 'sonner';

interface Route {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  duration: string;
  schedule: string[];
  capacity: number;
}

interface BookingFormProps {
  route: Route;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ route, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    travelDate: '',
    travelTime: '',
    seats: 1,
    passengerName: '',
    passengerPhone: '',
    passengerEmail: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const totalAmount = route.fare * formData.seats;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to make a booking');
      return;
    }

    if (!formData.travelDate || !formData.travelTime || !formData.passengerName || !formData.passengerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create booking object
      const booking = {
        id: `booking_${Date.now()}`,
        user_id: user.id,
        route_id: route.id,
        travel_date: formData.travelDate,
        travel_time: formData.travelTime,
        seats: formData.seats,
        total_amount: totalAmount,
        status: 'confirmed',
        payment_status: 'successful',
        payment_id: `pay_${Date.now()}`,
        payment_reference: `REF_${Date.now()}`,
        passenger_name: formData.passengerName,
        passenger_phone: formData.passengerPhone,
        passenger_email: formData.passengerEmail,
        created_at: new Date().toISOString(),
        route: route
      };

      // Save to localStorage (for demo purposes)
      const existingBookings = JSON.parse(localStorage.getItem('oci_ferry_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('oci_ferry_bookings', JSON.stringify(existingBookings));

      // Try to save to Supabase as well
      try {
        const { bookingService } = await import('@/lib/supabase');
        await bookingService.create({
          user_id: user.id,
          route_id: route.id,
          travel_date: formData.travelDate,
          travel_time: formData.travelTime,
          seats: formData.seats,
          total_amount: totalAmount,
          status: 'confirmed',
          payment_status: 'successful',
          payment_id: booking.payment_id,
          payment_reference: booking.payment_reference
        });
      } catch (supabaseError) {
        console.log('Supabase booking failed, using localStorage only');
      }

      toast.success('Booking confirmed successfully!');
      onSuccess();

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#C8102E]" />
                <span>Book Ferry Ticket</span>
              </CardTitle>
              <CardDescription>
                {route.origin} → {route.destination}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Route Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Route Fare</span>
                <span className="text-[#C8102E] font-bold">₦{route.fare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Duration: {route.duration}</span>
                <span>Capacity: {route.capacity} seats</span>
              </div>
            </div>

            {/* Travel Date */}
            <div className="space-y-2">
              <Label htmlFor="travelDate">Travel Date *</Label>
              <Input
                id="travelDate"
                type="date"
                min={getTomorrowDate()}
                value={formData.travelDate}
                onChange={(e) => handleInputChange('travelDate', e.target.value)}
                required
              />
            </div>

            {/* Travel Time */}
            <div className="space-y-2">
              <Label htmlFor="travelTime">Departure Time *</Label>
              <Select onValueChange={(value) => handleInputChange('travelTime', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select departure time" />
                </SelectTrigger>
                <SelectContent>
                  {route.schedule.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Seats */}
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats *</Label>
              <Select onValueChange={(value) => handleInputChange('seats', parseInt(value))} defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{num} seat{num > 1 ? 's' : ''}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Passenger Details */}
            <div className="space-y-4">
              <h4 className="font-medium">Passenger Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="passengerName">Full Name *</Label>
                <Input
                  id="passengerName"
                  type="text"
                  placeholder="Enter passenger full name"
                  value={formData.passengerName}
                  onChange={(e) => handleInputChange('passengerName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerPhone">Phone Number *</Label>
                <Input
                  id="passengerPhone"
                  type="tel"
                  placeholder="e.g., +234 801 234 5678"
                  value={formData.passengerPhone}
                  onChange={(e) => handleInputChange('passengerPhone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerEmail">Email Address</Label>
                <Input
                  id="passengerEmail"
                  type="email"
                  placeholder="passenger@example.com"
                  value={formData.passengerEmail}
                  onChange={(e) => handleInputChange('passengerEmail', e.target.value)}
                />
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-[#C8102E] bg-opacity-10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#C8102E]">
                    ₦{totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.seats} seat{formData.seats > 1 ? 's' : ''} × ₦{route.fare.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Confirm Booking</span>
                  </div>
                )}
              </Button>
            </div>

            <div className="text-xs text-center text-gray-500 mt-2">
              <p>Demo mode: Booking will be confirmed without payment</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};