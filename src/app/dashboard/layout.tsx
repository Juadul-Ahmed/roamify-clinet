import Sidebar from '@/Components/Dashboard/SIdebar';
import React from 'react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>

      <main className="flex-1 md:ml-0 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}