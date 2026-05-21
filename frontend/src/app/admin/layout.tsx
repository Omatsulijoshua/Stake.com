'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // In production, check for admin role
    // if (!user || user.role !== 'ADMIN') {
    //   router.push('/');
    // }
  }, [user, router]);

  return <div className="p-8 space-y-8">{children}</div>;
}
