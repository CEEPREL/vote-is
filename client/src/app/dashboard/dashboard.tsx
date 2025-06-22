'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Room } from '@/utils/types';
import { useAuth } from '@/context/auth';

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const newRoomSlug = searchParams.get('new');
  const { user, logout, token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    console.log('user', user);

    async function fetchUserData() {
      try {
        if (!user) return;

        const response = await fetch(`${API_URL}/rooms`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error('Fetch rooms error:', err);
        router.push('/login?redirect=/dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, router, API_URL, token]);

  const handleJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    if (newRoomSlug) {
      alert(`Room "${newRoomSlug}" created successfully!`);
      router.replace('/dashboard');
    }
  }, [newRoomSlug, router]);

  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen w-screen bg-black text-green-400">
        <p className="text-lg animate-pulse">Loading your dashboard...</p>
      </main>
    );

  return (
    <main className="flex items-center justify-center min-h-screen w-screen bg-black text-green-400 px-4">
      <div className="max-w-4xl w-full shadow-gray-500  bg-black p-8 rounded-lg shadow-lg flex flex-col">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-wide mb-1">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-green-300 text-sm italic">
            Ready to manage your rooms?
          </p>
        </header>
        <button
          onClick={() => logout()}
          className="mb-8 inline-block bg-red-600 hover:bg-red-700 text-black font-semibold py-3 rounded-lg text-center shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500"
        >
          Logout
        </button>

        <Link
          href="/create-room"
          className="mb-8 inline-block bg-green-600 hover:bg-green-700 text-black font-semibold py-3 rounded-lg text-center shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500"
        >
          + Create New Room
        </Link>

        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b border-green-600 pb-2 text-center">
            Your Rooms
          </h2>

          {rooms.length === 0 ? (
            <p className="italic text-green-300 text-center">
              No rooms created or joined yet.
            </p>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  onClick={() => handleJoinRoom(room.id)}
                  className="p-4 border border-green-600 rounded-lg hover:bg-green-900 transition cursor-pointer shadow-inner"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-green-600 rounded-md mb-3 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <p className="text-xl font-semibold mb-2 sm:mb-0">
                      {room.title}
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                        Join
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition">
                        Delete
                      </button>
                    </div>
                  </div>

                  {room.description && (
                    <p className="text-green-300 mt-1 text-sm line-clamp-2">
                      {room.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
