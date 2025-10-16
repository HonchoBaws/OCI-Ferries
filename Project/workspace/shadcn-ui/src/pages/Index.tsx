import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Ship, MapPin, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const { user, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      // Redirect will happen automatically via useEffect
    } catch (error) {
      // Error is handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(signupForm.email, signupForm.password, signupForm.name);
      setSignupForm({ name: '', email: '', password: '' });
    } catch (error) {
      // Error is handled in the signUp function
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminAccount = async () => {
    setIsLoading(true);
    try {
      await signUp('admin@ociferry.com', 'admin123', 'Admin User');
    } catch (error) {
      // Error is handled in the signUp function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Ship className="h-8 w-8 text-[#C8102E]" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent">
                OCI Ferry
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Gateway to
                <span className="bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent">
                  {' '}Lagos Waters
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience comfortable and reliable ferry transportation across Lagos. 
                Book your tickets online and enjoy scenic waterway journeys.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-[#C8102E] bg-opacity-10 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Multiple Routes</h3>
                  <p className="text-gray-600">Connect major Lagos destinations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#FFA500] bg-opacity-10 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-[#FFA500]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Regular Schedule</h3>
                  <p className="text-gray-600">Frequent daily departures</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#C8102E] bg-opacity-10 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-[#C8102E]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Comfortable Seating</h3>
                  <p className="text-gray-600">Modern ferry facilities</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#FFA500] bg-opacity-10 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-[#FFA500]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Booking</h3>
                  <p className="text-gray-600">Simple online reservations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome to OCI Ferry</CardTitle>
                <CardDescription>
                  Sign in to book your ferry tickets or create a new account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password (min. 6 characters)"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#C8102E] to-[#FFA500] hover:from-[#A00D26] hover:to-[#E6940A]"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Admin Account Creation */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Need admin access?</p>
                    <Button
                      onClick={createAdminAccount}
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      className="text-[#C8102E] border-[#C8102E] hover:bg-[#C8102E] hover:text-white"
                    >
                      Create Admin Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}