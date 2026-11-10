'use client';

import { createContext, useCallback, useState, useContext, useEffect } from 'react';
import { PrivateAdventurer } from './types';
import { login as apiLogin, fetchMe } from './api';
import { clearSession, setAccessToken, storeRefreshToken, tryRefresh } from '@/lib/api';

type AuthStatus = 'loading' | 'anonymous' | 'authenticated';

interface AuthContextValue {
  status: AuthStatus;
  adventurer: PrivateAdventurer | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [adventurer, setAdventurer] = useState<PrivateAdventurer | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (await tryRefresh()) {
        try {
          const me = await fetchMe();
          console.log(me);
          if (!cancelled) {
            setAdventurer(me);
            setStatus('authenticated');
          }
        } catch {
          // fetchMe a échouer, on supprime la session
          clearSession();
        }
      }
      if (!cancelled) {
        setStatus('anonymous');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log('start login');
    const tokens = await apiLogin(email, password);
    console.log(tokens);
    setAccessToken(tokens.accessToken);
    storeRefreshToken(tokens.refreshToken);
    setAdventurer(tokens.adventurer);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAdventurer(null);
    setStatus('anonymous');
  }, []);

  const refreshProfile = useCallback(async () => {
    setAdventurer(await fetchMe());
  }, []);

  return (
    <AuthContext.Provider value={{ status, adventurer, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth doit être utilisée dans un <AuthProvider>');
  }
  return value;
}
