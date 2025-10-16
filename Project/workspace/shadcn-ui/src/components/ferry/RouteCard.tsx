import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';

interface Route {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  duration: string;
  schedule: string[];
  capacity: number;
}

interface RouteCardProps {
  route: Route;
  onBook: (route: Route) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onBook }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#C8102E]" />
              <span>{route.origin} → {route.destination}</span>
            </div>
          </CardTitle>
          <Badge className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] text-white">
            ₦{route.fare.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Duration: {route.duration}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Capacity: {route.capacity} passengers</span>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Available Times:</p>
            <div className="flex flex-wrap gap-2">
              {route.schedule.map((time, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {time}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={() => onBook(route)}
            className="w-full bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
          >
            Book This Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};