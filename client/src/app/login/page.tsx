import React, { Suspense } from 'react';
import Login from './login';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center min-h-screen w-screen bg-black text-green-400">
          <p className="text-lg animate-pulse">Loading your login...</p>
        </main>
      }
    >
      <Login />
    </Suspense>
  );
}
