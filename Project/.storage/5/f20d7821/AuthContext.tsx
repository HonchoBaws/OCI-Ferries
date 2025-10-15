import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('oci_ferry_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Initialize admin user if not exists
    const users = JSON.parse(localStorage.getItem('oci_ferry_users') || '[]');
    if (users.length === 0) {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@oci.com',
        password: 'admin123',
        name: 'OCI Admin',
        phone: '+234-800-000-0000',
        role: 'admin'
      };
      localStorage.setItem('oci_ferry_users', JSON.stringify([adminUser]));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('oci_ferry_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('oci_ferry_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('oci_ferry_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      phone,
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('oci_ferry_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('oci_ferry_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oci_ferry_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};