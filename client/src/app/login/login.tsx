'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
// import { getCookie, setCookie } from 'cookies-next/client';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({ identifier: '', password: '' });
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
      const res = await fetch(`/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await res.json();
      const token = data.token;
      localStorage.setItem('token', token);
      login();

      // console.log('gotten token', getCookie('token'));
      // Redirect after successful login

      const redirectParam = searchParams.get('redirect');
      const redirect =
        redirectParam && redirectParam.startsWith('/')
          ? redirectParam
          : '/dashboard';

      router.push(redirect);
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex justify-center px-4">
      <div className="w-full max-w-md bg-black shadow-gray-500  py-16 px-6 shadow-[inset_12px_0_24px_-12px_rgba(0,0,0,0.1),inset_-12px_0_24px_-12px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-4 text-green-700">Login</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="space-y-4 w-full max-w-sm" onSubmit={handleSubmit}>
            <input
              name="identifier"
              type="text"
              placeholder="Email or Username"
              onChange={handleChange}
              value={form.identifier}
              className="w-full px-3 py-2 text-green-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="w-full px-3 py-2 border text-green-700 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <Link
              href="/register"
              className="text-green-600 mb-2 hover:underline"
            >
              New here?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
