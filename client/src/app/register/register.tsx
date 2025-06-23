'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/auth/signup`, form, {
        withCredentials: true,
      });
      alert('Registration successful!, please login');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('err.response?.data?', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex justify-center px-4">
      <div className="w-full max-w-md bg-black shadow-gray-500  py-16 px-6 shadow-[inset_12px_0_24px_-12px_rgba(0,0,0,0.1),inset_-12px_0_24px_-12px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-4 text-green-700">Register</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={form.username}
              className="w-full px-3 py-2 text-green-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              className="w-full px-3 py-2 text-green-700  border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="w-full px-3 py-2 text-green-700  border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <Link href="/login" className="text-green-600 mb-2 hover:underline">
              Already have an account?
            </Link>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
