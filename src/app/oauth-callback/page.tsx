"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { authAPI } from '@/lib/api';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          return;
        }

        // Get JWT token from URL parameters or call refresh-token
        console.log('Processing OAuth callback...');
        
        try {
          const token = searchParams.get('token');
          
          if (token) {
            // Token provided in URL parameter
            localStorage.setItem('auth_token', token);
            console.log('JWT token saved from URL parameter');
          } else {
            // Get token from refresh-token API
            const tokenResponse = await authAPI.refreshToken();
            const responseData = tokenResponse as any;
            
            if (responseData?.token) {
              localStorage.setItem('auth_token', responseData.token);
              console.log('JWT token saved from refresh-token API');
            } else {
              throw new Error('No JWT token received');
            }
          }
          
          setStatus('success');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            router.push('/home');
          }, 2000);
          
        } catch (tokenError) {
          console.error('Failed to get JWT token:', tokenError);
          setStatus('error');
        }

      } catch (err) {
        setStatus('error');
        console.error('OAuth callback error:', err);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  const handleRetry = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Memproses Login...'}
            {status === 'success' && 'Login Berhasil!'}
            {status === 'error' && 'Login Gagal'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Sedang memvalidasi akun Google Anda'}
            {status === 'success' && 'Selamat datang di Smarteg'}
            {status === 'error' && 'Terjadi kesalahan saat login'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="space-y-3">
              <Skeleton className="bg-primary-500 h-4 w-full" />
              <Skeleton className="bg-primary-400 h-4 w-3/4" />
              <Skeleton className="bg-primary-300 h-4 w-1/2" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-6xl">✅</div>
              <p className="text-sm text-gray-600">
                Login Berhasil
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center space-y-8">
              <div className="text-6xl">❌</div>
              <Button onClick={handleRetry} className="w-full text-white">
                Coba Login Lagi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            <CardDescription>Please wait</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
} 