// hooks/CurrentUser.ts
'use client';


import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

type User = {
  id: string;
  clerkUserId: string;
  name: string | null;
  createdAt: Date;
};

export function useCurrentUser() {
  const { isLoaded, userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!isLoaded || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [isLoaded, userId]);

  return { user, loading, isAuthenticated: !!userId };
}