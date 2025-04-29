import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Wallet } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8">
        <Wallet className="h-10 w-10 text-teal-700" />
        <h1 className="ml-2 text-3xl font-bold text-teal-800">Smart Spend</h1>
      </div>
      <RegisterForm />
    </div>
  );
};