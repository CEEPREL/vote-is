'use client';

import { AuthContextType, User } from '@/utils/types';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Load token from localStorage once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      setToken(savedToken);
    }
  }, []);

  // Fetch user profile only when token is available
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();

        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = async () => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      setToken(savedToken);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetch('/api/logout', { method: 'POST', credentials: 'include' }),
        fetch(`${API_URL}/auth/signout`, {
          method: 'POST',
          credentials: 'include',
        }),
      ]);

      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        login,
        logout,
        token,
        refreshUser: login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the AuthContext easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
