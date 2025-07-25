'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Define public routes as a constant outside the component to avoid dependency issues
const PUBLIC_ROUTES = ['/', '/login', '/oauth-callback', '/offline'];

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      // Check if the current path is a public route
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
      );

      // If it's a public route, allow access without checking auth
      if (isPublicRoute) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // For protected routes, check for auth token in localStorage
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        // If no auth token, redirect to login with return URL
        const loginUrl = `/login?returnUrl=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
        return;
      }

      // Set auth token in cookies for server-side middleware
      // This ensures consistency between client and server
      document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Handle auth state changes (like logout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        // If auth token is removed, clear cookie and redirect to login
        if (!e.newValue) {
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          const isPublicRoute = PUBLIC_ROUTES.some(route => 
            pathname === route || pathname.startsWith(route + '/')
          );
          if (!isPublicRoute) {
            router.replace('/login');
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
} 