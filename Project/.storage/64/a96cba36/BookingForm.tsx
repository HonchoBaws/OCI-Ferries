import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [formData, setFormData] = useState({
    travelDate: '',
    travelTime: '',
    seats: 1,
    passengerName: '',
    passengerEmail: '',
    passengerPhone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = route.fare * formData.seats;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.travelDate || !formData.travelTime || !formData.passengerName || !formData.passengerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store booking in localStorage for now
      const booking = {
        id: Date.now().toString(),
        routeId: route.id,
        route: route,
        ...formData,
        totalAmount,
        status: 'confirmed',
        paymentStatus: 'successful',
        createdAt: new Date().toISOString()
      };

      const existingBookings = JSON.parse(localStorage.getItem('oci_ferry_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('oci_ferry_bookings', JSON.stringify(existingBookings));

      toast.success('Booking confirmed successfully!');
      onSuccess();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-[#C8102E]" />
            <span>Book Ferry Ticket</span>
          </CardTitle>
          <CardDescription>
            {route.origin} → {route.destination}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Route Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{route.duration}</p>
              </div>
              <div>
                <p className="text-gray-600">Fare per seat</p>
                <p className="font-medium">₦{route.fare.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Travel Date */}
            <div className="space-y-2">
              <Label htmlFor="travelDate">Travel Date *</Label>
              <Input
                id="travelDate"
                type="date"
                min={minDate}
                value={formData.travelDate}
                onChange={(e) => handleInputChange('travelDate', e.target.value)}
                required
              />
            </div>

            {/* Travel Time */}
            <div className="space-y-2">
              <Label htmlFor="travelTime">Departure Time *</Label>
              <Select 
                value={formData.travelTime} 
                onValueChange={(value) => handleInputChange('travelTime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select departure time" />
                </SelectTrigger>
                <SelectContent>
                  {route.schedule.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Seats */}
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats *</Label>
              <Select 
                value={formData.seats.toString()} 
                onValueChange={(value) => handleInputChange('seats', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} seat{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Passenger Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Passenger Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="passengerName">Full Name *</Label>
                <Input
                  id="passengerName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.passengerName}
                  onChange={(e) => handleInputChange('passengerName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerEmail">Email Address *</Label>
                <Input
                  id="passengerEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.passengerEmail}
                  onChange={(e) => handleInputChange('passengerEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerPhone">Phone Number</Label>
                <Input
                  id="passengerPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.passengerPhone}
                  onChange={(e) => handleInputChange('passengerPhone', e.target.value)}
                />
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-[#C8102E] bg-opacity-10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-[#C8102E]">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.seats} seat{formData.seats > 1 ? 's' : ''} × ₦{route.fare.toLocaleString()}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Book Now</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};