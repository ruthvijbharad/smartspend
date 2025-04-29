import React from 'react';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:px-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Smart Spend. All rights reserved.</p>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};