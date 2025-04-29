import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Wallet, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Budget', path: '/budget' },
    { name: 'Savings', path: '/savings' },
  ];

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <Wallet className="h-8 w-8 text-teal-700" />
              <span className="ml-2 text-xl font-semibold text-teal-800">Smart Spend</span>
            </NavLink>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'px-3 py-2 text-sm font-medium text-teal-700 border-b-2 border-teal-700'
                    : 'px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-700'
                }
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={handleSignOut}
              className="ml-4 flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-teal-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'block px-3 py-2 rounded-md text-base font-medium text-teal-700 bg-gray-50'
                    : 'block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-700 hover:bg-gray-50'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};