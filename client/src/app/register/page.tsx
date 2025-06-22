import React, { Suspense } from 'react';
import Register from './register';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center min-h-screen w-screen bg-black text-green-400">
          <p className="text-lg animate-pulse">Loading your Register...</p>
        </main>
      }
    >
      <Register />
    </Suspense>
  );
}
