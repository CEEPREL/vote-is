import React, { Suspense } from 'react';
import Dashboard from './dashboard';

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center min-h-screen w-screen bg-black text-green-400">
          <p className="text-lg animate-pulse">Loading your dashboard...</p>
        </main>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
