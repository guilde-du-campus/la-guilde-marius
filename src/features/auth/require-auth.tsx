'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { useEffect } from 'react';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status !== 'authenticated') {
    return <p aria-busy="true">Vérification de ta session...</p>;
  }

  return <>{children}</>;
}
