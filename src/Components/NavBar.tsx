'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiBars3 } from 'react-icons/hi2';
import { FiLogOut, FiUser, FiPlusCircle, FiSettings } from 'react-icons/fi';
import { FaCompass } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { useSession, signOut } from '@/lib/auth-client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const sessionUser = session?.user;

  const role = (sessionUser as { role?: 'user' | 'admin' })?.role ?? 'user';

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  // 1. Logged Out: Public Base Links
  const publicRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'About Us', path: '/about' },
  ];

  // 2. Logged In: Standard Customer View
  const customerRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'My Bookings', path: '/bookings' },
    { name: 'Profile', path: '/profile' },
    { name: 'Help Support', path: '/support' },
  ];

  // 3. Logged In: Travel Platform Administrator
  const adminRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Add Tour', path: '/items/add', icon: <FiPlusCircle size={16} /> },
    { name: 'Manage Tours', path: '/items/manage', icon: <FiSettings size={16} /> },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  // Dynamically assign routes based on session presence and role
  const activeRoutes = !sessionUser
    ? publicRoutes
    : role === 'admin'
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
            {isPending ? (
              <div className="h-8 w-24 rounded-full bg-slate-100 animate-pulse" />
            ) : sessionUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                  <FiUser size={14} className="text-slate-500" />
                  {sessionUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl text-slate-600 hover:text-red-600 p-2 text-sm font-medium transition-colors"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
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

          {/* Mobile Hamburger Toggle Button */}
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
              {sessionUser ? (
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
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