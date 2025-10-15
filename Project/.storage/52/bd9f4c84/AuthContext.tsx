import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, userProfileService, UserProfile } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, retries = 2) => {
    try {
      let profile = await userProfileService.getById(userId);
      
      if (!profile && retries > 0) {
        // Wait a bit and retry - profile might be created by trigger
        await new Promise(resolve => setTimeout(resolve, 500));
        return await loadUserProfile(userId, retries - 1);
      }
      
      if (!profile) {
        // If still no profile exists after retries, create one manually
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
          const userRole = user.email === 'admin@ociferry.com' ? 'admin' : 'user';
          
          try {
            profile = await userProfileService.create({
              id: userId,
              name: userName,
              role: userRole
            });
          } catch (createError) {
            console.error('Error creating profile manually:', createError);
            // Create a temporary profile for the session without saving to DB
            profile = {
              id: userId,
              name: userName,
              role: userRole
            };
          }
        }
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Don't throw error, just log it
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Simple signup - let Supabase handle everything
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        toast.success('Account created successfully! Please check your email to verify your account.');
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long';
      } else if (error.message?.includes('Unable to validate email address')) {
        errorMessage = 'Please enter a valid email address';
      } else if (error.message?.includes('Signup is disabled')) {
        errorMessage = 'Account creation is currently disabled';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Failed to sign in';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  const value = {
    user,
    userProfile,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};