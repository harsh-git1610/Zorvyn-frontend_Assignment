import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from '../ui/Toast';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 px-4 lg:px-6 py-4 lg:py-6">
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}
