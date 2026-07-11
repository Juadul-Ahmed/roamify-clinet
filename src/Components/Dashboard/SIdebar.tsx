'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TbLayoutDashboard,
  TbMap2,
  TbPlus,
  TbCalendarEvent,
  TbStar,
  TbCreditCard,
  TbSettings,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from 'react-icons/tb';

const sidebarLinks = [
  { name: 'Overview', path: '/organizer/dashboard', icon: TbLayoutDashboard },
  { name: 'My Tours', path: '/organizer/tours', icon: TbMap2 },
  { name: 'Add Tour', path: '/organizer/tours/add', icon: TbPlus },
  { name: 'Bookings', path: '/organizer/bookings', icon: TbCalendarEvent },
  { name: 'Reviews', path: '/organizer/reviews', icon: TbStar },
  { name: 'Payouts', path: '/organizer/payouts', icon: TbCreditCard },
  { name: 'Settings', path: '/organizer/settings', icon: TbSettings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Dashboard Sub-header — visible only on small devices, sits below the main Navbar */}
      <div className="sticky top-16 z-30 flex h-12 items-center border-b border-slate-100 bg-white px-4 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
        >
          <span className="sr-only">Open Sidebar</span>
          <TbLayoutSidebarLeftExpand size={20} />
        </button>
       
      </div>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 border-r border-slate-100 bg-white transition-transform duration-200 ease-in-out
          md:static md:z-auto md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <span className="text-lg font-bold text-slate-900">Dashboard</span>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 md:hidden"
          >
            <span className="sr-only">Close Sidebar</span>
            <TbLayoutSidebarLeftCollapse size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}