"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '@/components/admin/SideBar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
                <SideBar />
                <main className="top-0 relative ml-64">{children}</main>
            </>
        );
    }

    // This should not be reached, but just in case
    return null;
}
