// context/AuthContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';

// Minimal recipe summary type stored in the user's collection.
export type RecipeSummary = {
  id: string;
  title: string;
  duration?: string; // IGNORE
};

// Basic shape of the logged-in user.
// You can extend this as you pull more claims from Google.
export type AuthUser = {
  name?: string;
  email?: string;
  picture?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;

  // Called after successful OAuth.
  login: (session: { user: AuthUser; accessToken: string }) => void;

  logout: () => void;

  // Favorites / collected recipes
  collected: RecipeSummary[];
  toggleLike: (r: RecipeSummary) => void;
  isCollected: (id: string) => boolean;
  collectedCount: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // OAuth session info
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // In-memory collection of recipes. (TODO: persist w/ AsyncStorage)
  const [collected, setCollected] = useState<RecipeSummary[]>([]);

  // Mark user as logged in by setting session data from Google OAuth
  function login(session: { user: AuthUser; accessToken: string }) {
    setUser(session.user);
    setAccessToken(session.accessToken);
  }

  // Clear session
  function logout() {
    setUser(null);
    setAccessToken(null);
    // (Optional) clear collected too on logout if you want:
    // setCollected([]);
  }

  function toggleLike(r: RecipeSummary) {
    setCollected((prev) => {
      const exists = prev.find((p) => p.id === r.id);
      const next = exists ? prev.filter((p) => p.id !== r.id) : [...prev, r];
      return next;
    });
  }

  function isCollected(id: string) {
    return collected.some((p) => p.id === id);
  }

  // You are "logged in" if we have both a user and an accessToken.
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
