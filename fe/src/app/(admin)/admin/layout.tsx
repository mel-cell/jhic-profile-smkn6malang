"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '@/components/admin/SideBar';
import ButtonAi from '@/components/chatbot/ButtonAi';
import { Menu } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const userRole = localStorage.getItem('userRole');

            if (!token || userRole !== 'ADMIN') {
                // Redirect to login if not authenticated or wrong role
                router.replace('/admin/login');
                return;
            }

            setIsAuthorized(true);
            setIsChecking(false);
        };

        checkAuth();
    }, [router]);

    // Show loading while checking auth
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    // If auth check passes, render children
    if (isAuthorized) {
        return (
            <>
                <SideBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>

                <main className="md:ml-64 transition-all duration-300 ease-in-out">
                    <div className="p-4 md:p-6 lg:p-8 pt-16 md:pt-6">
                        {children}
                    </div>
                </main>

                {/* AI Chatbot Button - Fixed position bottom right */}
                <ButtonAi />
            </>
        );
    }

    // This should not be reached, but just in case
    return null;
}
