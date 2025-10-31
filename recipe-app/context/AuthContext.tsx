import React, { createContext, useContext, useState, useMemo } from 'react';

export type RecipeSummary = {
  id: string;
  title: string;
  duration?: string;
};

export type AuthUser = {
  name?: string;
  email?: string;
  picture?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null; // we'll store idToken here for now
  login: (session: { user: AuthUser; accessToken: string }) => void;
  logout: () => void;

  // recipe collection
  collected: RecipeSummary[];
  toggleLike: (r: RecipeSummary) => void;
  isCollected: (id: string) => boolean;
  collectedCount: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [collected, setCollected] = useState<RecipeSummary[]>([]);

  function login(session: { user: AuthUser; accessToken: string }) {
    setUser(session.user);
    setAccessToken(session.accessToken);
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
    setCollected([]);
  }

  function toggleLike(r: RecipeSummary) {
    setCollected((prev) => {
      const exists = prev.find((p) => p.id === r.id);
      return exists ? prev.filter((p) => p.id !== r.id) : [...prev, r];
    });
  }

  function isCollected(id: string) {
    return collected.some((p) => p.id === id);
  }

  const isLoggedIn = useMemo(() => !!user && !!accessToken, [user, accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        accessToken,
        login,
        logout,
        collected,
        toggleLike,
        isCollected,
        collectedCount: collected.length,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
