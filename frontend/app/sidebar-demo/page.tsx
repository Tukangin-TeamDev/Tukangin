'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { NavbarGuest } from '@/components/navbar-guest';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function SidebarDemo() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar - Only visible when toggled */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 md:hidden ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
        <Sidebar className="relative z-50" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1">
        <NavbarGuest />

        <main className="container mx-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">Sidebar Demo</h1>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="font-semibold mb-4">Features:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Collapsible sidebar that can be toggled between expanded and collapsed states</li>
              <li>Responsive design that adapts to different screen sizes</li>
              <li>Mobile-friendly with off-canvas sidebar on small screens</li>
              <li>Dropdown submenu for "Pesanan Saya" menu item</li>
              <li>Help card that appears only when sidebar is expanded</li>
              <li>Guest navbar with responsive search and authentication buttons</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-semibold mb-2">Sidebar Component</h2>
              <p className="text-gray-600 mb-4">
                The sidebar can be collapsed to show only icons, saving space while maintaining
                navigation functionality. On mobile devices, it becomes an off-canvas menu that can
                be toggled with a button.
              </p>
              <p className="text-gray-600">
                Try clicking the toggle button on the sidebar to collapse/expand it.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-semibold mb-2">Navbar Guest Component</h2>
              <p className="text-gray-600 mb-4">
                The navbar for guest users includes navigation links, a search bar, and
                authentication buttons. On mobile devices, the search bar moves below the main
                navbar to ensure it has enough space.
              </p>
              <p className="text-gray-600">
                Try resizing your browser to see how both components adapt to different screen
                sizes.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
