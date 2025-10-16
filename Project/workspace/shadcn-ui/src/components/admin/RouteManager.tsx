import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin, Clock, Users } from 'lucide-react';
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

interface RouteManagerProps {
  onUpdate: () => void;
}

export const RouteManager: React.FC<RouteManagerProps> = ({ onUpdate }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    fare: '',
    duration: '',
    schedule: '',
    capacity: ''
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = () => {
    const savedRoutes = JSON.parse(localStorage.getItem('oci_ferry_routes') || '[]');
    setRoutes(savedRoutes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.origin || !formData.destination || !formData.fare || !formData.duration || !formData.schedule || !formData.capacity) {
      toast.error('Please fill in all fields');
      return;
    }

    const scheduleArray = formData.schedule.split(',').map(time => time.trim());
    
    const routeData = {
      id: editingRoute ? editingRoute.id : `route-${Date.now()}`,
      origin: formData.origin,
      destination: formData.destination,
      fare: parseInt(formData.fare),
      duration: formData.duration,
      schedule: scheduleArray,
      capacity: parseInt(formData.capacity)
    };

    let updatedRoutes;
    if (editingRoute) {
      updatedRoutes = routes.map(route => route.id === editingRoute.id ? routeData : route);
      toast.success('Route updated successfully');
    } else {
      updatedRoutes = [...routes, routeData];
      toast.success('Route added successfully');
    }

    localStorage.setItem('oci_ferry_routes', JSON.stringify(updatedRoutes));
    setRoutes(updatedRoutes);
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('routesUpdated'));
    
    resetForm();
    setIsDialogOpen(false);
    onUpdate();
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      origin: route.origin,
      destination: route.destination,
      fare: route.fare.toString(),
      duration: route.duration,
      schedule: route.schedule.join(', '),
      capacity: route.capacity.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (routeId: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      const updatedRoutes = routes.filter(route => route.id !== routeId);
      localStorage.setItem('oci_ferry_routes', JSON.stringify(updatedRoutes));
      setRoutes(updatedRoutes);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('routesUpdated'));
      
      toast.success('Route deleted successfully');
      onUpdate();
    }
  };

  const resetForm = () => {
    setFormData({
      origin: '',
      destination: '',
      fare: '',
      duration: '',
      schedule: '',
      capacity: ''
    });
    setEditingRoute(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Route Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage ferry routes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]">
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
              <DialogDescription>
                {editingRoute ? 'Update the route details below.' : 'Fill in the details to create a new ferry route.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    placeholder="e.g., Lagos Island"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g., Victoria Island"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fare">Fare (₦)</Label>
                  <Input
                    id="fare"
                    type="number"
                    value={formData.fare}
                    onChange={(e) => setFormData(prev => ({ ...prev, fare: e.target.value }))}
                    placeholder="2500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="150"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="45 minutes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (comma-separated times)</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                  placeholder="06:00, 08:00, 10:00, 12:00"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
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
                  <span>{route.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{route.capacity} passengers</span>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Schedule:</p>
                  <div className="flex flex-wrap gap-1">
                    {route.schedule.map((time, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(route)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(route.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No routes available</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first ferry route.</p>
        </div>
      )}
    </div>
  );
};