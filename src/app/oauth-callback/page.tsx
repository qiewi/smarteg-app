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
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`OAuth Error: ${error}`);
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
          setMessage('Authentication successful! Redirecting to dashboard...');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            router.push('/home');
          }, 2000);
          
        } catch (tokenError) {
          console.error('Failed to get JWT token:', tokenError);
          setStatus('error');
          setMessage('Failed to retrieve authentication token');
        }

      } catch (err) {
        setStatus('error');
        setMessage('Failed to process authentication');
        console.error('OAuth callback error:', err);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  const handleRetry = () => {
    router.push('/login');
  };

  const handleManualRedirect = () => {
    router.push('/home');
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
            {status === 'success' && 'Selamat datang di SmartEG'}
            {status === 'error' && 'Terjadi kesalahan saat login'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-6xl">✅</div>
              <p className="text-sm text-gray-600">
                Anda akan dialihkan ke dashboard dalam beberapa detik...
              </p>
              <Button onClick={handleManualRedirect} className="w-full">
                Lanjut ke Dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="text-6xl">❌</div>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {message}
              </p>
              <Button onClick={handleRetry} className="w-full">
                Coba Login Lagi
              </Button>
              <Button 
                variant="outline" 
                onClick={handleManualRedirect} 
                className="w-full"
              >
                Lanjut ke Dashboard (Demo)
              </Button>
            </div>
          )}
          
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>OAuth implementation akan diselesaikan di Task 2</p>
            <p>Halaman ini adalah placeholder untuk demonstrasi flow</p>
          </div>
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