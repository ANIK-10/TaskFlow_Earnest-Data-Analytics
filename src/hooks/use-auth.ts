
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getTokens = useCallback(() => {
    if (typeof window === 'undefined') return { access: null, refresh: null };
    return {
      access: localStorage.getItem('tf_access_token'),
      refresh: localStorage.getItem('tf_refresh_token'),
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tf_access_token');
    localStorage.removeItem('tf_refresh_token');
    localStorage.removeItem('tf_user');
    setUser(null);
    router.push('/login');
  }, [router]);

  const refreshAccessToken = useCallback(async () => {
    const { refresh } = getTokens();
    if (!refresh) {
      logout();
      return null;
    }

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });

      if (!res.ok) throw new Error('Refresh failed');

      const data = await res.json();
      localStorage.setItem('tf_access_token', data.accessToken);
      return data.accessToken;
    } catch (err) {
      logout();
      return null;
    }
  }, [getTokens, logout]);

  const authorizedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    let { access } = getTokens();
    if (!access) {
      access = await refreshAccessToken();
    }

    if (!access) throw new Error('Unauthorized');

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${access}`,
      },
    });

    if (response.status === 401) {
      access = await refreshAccessToken();
      if (access) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${access}`,
          },
        });
      }
    }

    return response;
  }, [getTokens, refreshAccessToken]);

  useEffect(() => {
    const storedUser = localStorage.getItem('tf_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return { user, loading, logout, authorizedFetch, setUser };
}
