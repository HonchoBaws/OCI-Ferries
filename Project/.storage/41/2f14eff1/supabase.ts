import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwurqvbxpkysmpocajoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dXJxdmJ4cGt5c21wb2Nham9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTg5NTgsImV4cCI6MjA3NjAzNDk1OH0.u5I5FG2bsHvFPjMP28AUuWu7DWAqNmu9uVcri-OITSM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  ROUTES: 'app_407984ad48_ferry_routes',
  BOOKINGS: 'app_407984ad48_bookings',
  USER_PROFILES: 'app_407984ad48_user_profiles'
} as const;

// Types for database entities
export interface Route {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  duration: string;
  schedule: string[];
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  route_id: string;
  travel_date: string;
  travel_time: string;
  seats: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_id?: string;
  payment_reference?: string;
  payment_status: 'pending' | 'successful' | 'failed';
  created_at?: string;
  updated_at?: string;
  // Joined data
  route?: Route;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

// Route operations
export const routeService = {
  async getAll(): Promise<Route[]> {
    const { data, error } = await supabase
      .from(TABLES.ROUTES)
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>): Promise<Route> {
    const { data, error } = await supabase
      .from(TABLES.ROUTES)
      .insert(route)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, route: Partial<Route>): Promise<Route> {
    const { data, error } = await supabase
      .from(TABLES.ROUTES)
      .update({ ...route, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.ROUTES)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Booking operations
export const bookingService = {
  async getByUserId(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .select(`
        *,
        route:${TABLES.ROUTES}(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .select(`
        *,
        route:${TABLES.ROUTES}(*),
        user_profile:${TABLES.USER_PROFILES}(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: Booking['status'], paymentData?: { payment_id?: string; payment_status?: Booking['payment_status'] }): Promise<Booking> {
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      ...paymentData
    };

    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// User profile operations
export const userProfileService = {
  async getById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Auth helpers
export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      await userProfileService.create({
        id: data.user.id,
        name,
        role: 'user'
      });
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};