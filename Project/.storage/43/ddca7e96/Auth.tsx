import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent mb-2">
            OCI Ferry
          </h1>
          <p className="text-muted-foreground">Your trusted ferry booking partner</p>
        </div>
        
        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <SignupForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
}