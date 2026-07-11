'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiBars3 } from 'react-icons/hi2';
import { FiLogOut, FiUser, FiPlusCircle, FiSettings, FiCompass } from 'react-icons/fi';
import { FaCompass } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

// Define clear TypeScript shapes for your future authentication integrations
interface NavbarProps {
  user?: {
    name: string;
    role: 'user' | 'admin';
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user = null, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 1. Logged Out: Public Base Links (3 routes minimum)
  const publicRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'About Us', path: '/about' },
  ];

  // 2. Logged In: Standard Customer View (5 routes minimum)
  const customerRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'My Bookings', path: '/bookings' },
    { name: 'Profile', path: '/profile' },
    { name: 'Help Support', path: '/support' },
  ];

  // 3. Logged In: Travel Platform Administrator (5 routes minimum)
  const adminRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Add Tour', path: '/items/add', icon: <FiPlusCircle size={16} /> },
    { name: 'Manage Tours', path: '/items/manage', icon: <FiSettings size={16} /> },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  // Dynamically assign mapping route based on actual user presence and role values
  const activeRoutes = !user 
    ? publicRoutes 
    : user.role === 'admin' 
      ? adminRoutes 
      : customerRoutes;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo Identity */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white">
              <FaCompass size={22} />
            </div>
            <span>Roamify</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {activeRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(route.path)
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {route.icon && route.icon}
                {route.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Controls Container */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                  <FiUser size={14} className="text-slate-500" />
                  {user.name}
                </span>
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-1.5 rounded-xl text-slate-600 hover:text-red-600 p-2 text-sm font-medium transition-colors"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
            >
              <span className="sr-only">Open Menu</span>
              {isOpen ? <HiX size={24} /> : <HiBars3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu Overlay */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {activeRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium ${
                  isActive(route.path)
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {route.icon && route.icon}
                {route.name}
              </Link>
            ))}
            
            {/* Mobile Auth Execution Links */}
            <div className="mt-4 pt-4 border-t border-slate-100 px-4">
              {user ? (
                <button
                  onClick={() => { setIsOpen(false); onLogout?.(); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FiLogOut size={18} />
                  Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-sky-600"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}