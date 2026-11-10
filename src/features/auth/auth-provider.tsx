'use client';

import { createContext, useCallback, useState, useContext } from 'react';
import { PrivateAdventurer } from './types';
import { login as apiLogin, fetchMe } from './api';
import { clearSession, setAccessToken, storeRefreshToken } from '@/lib/api';

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

  // TODO useEffect

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiLogin(email, password);
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
