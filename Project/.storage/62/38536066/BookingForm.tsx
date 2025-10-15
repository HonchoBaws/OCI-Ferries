import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { initializePaystackPayment, generatePaymentReference, type PaystackResponse } from '@/lib/paystack';

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
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const totalAmount = route.fare * seats;
  const totalAmountInKobo = totalAmount * 100; // Convert to kobo for Paystack

  const handlePaystackSuccess = (response: PaystackResponse) => {
    console.log('Payment successful:', response);
    
    // Create booking record
    const booking = {
      id: `booking-${Date.now()}`,
      userId: user?.id,
      routeId: route.id,
      route: route,
      date: format(date!, 'yyyy-MM-dd'),
      time: time,
      seats: seats,
      totalAmount: totalAmount,
      status: 'confirmed',
      paymentId: response.reference,
      paymentStatus: 'successful',
      transactionId: response.transaction,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('oci_ferry_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('oci_ferry_bookings', JSON.stringify(bookings));

    setIsProcessing(false);
    toast.success('Payment successful! Your booking has been confirmed.');
    onSuccess();
  };

  const handlePaystackClose = () => {
    setIsProcessing(false);
    toast.info('Payment cancelled');
  };

  const handleBooking = async () => {
    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentReference = generatePaymentReference();
      
      const paymentData = {
        email: user.email,
        amount: totalAmountInKobo,
        reference: paymentReference,
        metadata: {
          bookingId: `booking-${Date.now()}`,
          userId: user.id,
          routeId: route.id,
          seats: seats,
          customerName: user.name
        }
      };

      // Initialize Paystack payment
      initializePaystackPayment(
        paymentData,
        handlePaystackSuccess,
        handlePaystackClose
      );

    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Payment initialization failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Book Ferry Ticket</span>
        </CardTitle>
        <CardDescription>
          {route.origin} → {route.destination}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Travel Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Departure Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {route.schedule.map((scheduleTime) => (
                <SelectItem key={scheduleTime} value={scheduleTime}>
                  {scheduleTime}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Number of Seats</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-[#C8102E]">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleBooking}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing ? 'Processing Payment...' : 'Pay with Paystack'}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          <div className="mt-4 text-xs text-center text-gray-500">
            <p>Secure payment powered by Paystack</p>
            <p>We accept cards, bank transfers, and mobile money</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};