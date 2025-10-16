import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Clock, Shield, CreditCard, MapPin, Users, Star, ArrowRight, Waves } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Ship className="h-8 w-8 text-[#C8102E]" />,
      title: "Modern Fleet",
      description: "State-of-the-art ferries with comfortable seating and safety equipment"
    },
    {
      icon: <Clock className="h-8 w-8 text-[#FFA500]" />,
      title: "Reliable Schedule",
      description: "Punctual departures with multiple daily trips across Lagos waterways"
    },
    {
      icon: <Shield className="h-8 w-8 text-[#C8102E]" />,
      title: "Safety First",
      description: "Certified crew and regular safety inspections for your peace of mind"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-[#FFA500]" />,
      title: "Easy Booking",
      description: "Simple online booking with secure payment and instant confirmation"
    }
  ];

  const routes = [
    { from: "Lagos Island", to: "Victoria Island", fare: "₦2,500", duration: "45 min" },
    { from: "Marina", to: "Ikoyi", fare: "₦2,000", duration: "30 min" },
    { from: "Apapa", to: "Tin Can Island", fare: "₦1,800", duration: "25 min" },
    { from: "Lekki Phase 1", to: "Banana Island", fare: "₦3,500", duration: "20 min" }
  ];

  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Daily Commuter",
      content: "OCI Ferry has transformed my daily commute. Fast, reliable, and comfortable!",
      rating: 5
    },
    {
      name: "Sarah Okafor",
      role: "Business Executive",
      content: "Professional service and always on time. Perfect for business meetings in VI.",
      rating: 5
    },
    {
      name: "Michael Eze",
      role: "Tourist",
      content: "Amazing way to see Lagos from the water. Great service and beautiful views!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8102E' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Ship className="h-16 w-16 text-[#C8102E]" />
                  <Waves className="h-8 w-8 text-[#FFA500] absolute -bottom-2 -right-2" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent">
                OCI Ferry
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Your Trusted Ferry Booking Partner
            </p>
            
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Experience the fastest and most comfortable way to travel across Lagos waterways. 
              Book your ferry tickets online and enjoy reliable, safe, and affordable transportation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A] text-white px-8 py-4 text-lg"
              >
                Book Your Trip Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white px-8 py-4 text-lg"
              >
                View Routes & Schedules
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose OCI Ferry?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best ferry experience in Lagos with modern amenities and exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-lg text-gray-600">
              Connecting major destinations across Lagos waterways
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-6 w-6 text-[#C8102E]" />
                      <div>
                        <p className="font-semibold text-lg">
                          {route.from} → {route.to}
                        </p>
                        <p className="text-gray-500">Duration: {route.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#C8102E]">{route.fare}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Passengers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied passengers who trust OCI Ferry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#C8102E] to-[#FFA500]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Best Ferry Service?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of passengers who choose OCI Ferry for their daily commute and special trips.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-[#C8102E] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ship className="h-8 w-8 text-[#FFA500]" />
                <span className="text-xl font-bold">OCI Ferry</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for safe and comfortable ferry transportation across Lagos.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Book a Trip</a></li>
                <li><a href="#" className="hover:text-white">Routes & Schedules</a></li>
                <li><a href="#" className="hover:text-white">Safety Information</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Regular Routes</a></li>
                <li><a href="#" className="hover:text-white">Charter Services</a></li>
                <li><a href="#" className="hover:text-white">Corporate Packages</a></li>
                <li><a href="#" className="hover:text-white">Group Bookings</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +234-800-OCI-FERRY</li>
                <li>✉️ info@ociferry.com</li>
                <li>📍 Marina Terminal, Lagos Island</li>
                <li>🕒 24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OCI Ferry. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}