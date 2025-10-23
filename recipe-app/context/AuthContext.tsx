// contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Minimal recipe summary type stored in the user's collection.
export type RecipeSummary = {
  id: string;
  title: string;
  duration?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  collected: RecipeSummary[];
  // Toggle the liked/collected state for a recipe. If recipe is already collected,
  // it will be removed; otherwise it will be added.
  toggleLike: (r: RecipeSummary) => void;
  isCollected: (id: string) => boolean;
  collectedCount: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // In-memory collection of recipes. TODO: persist this to AsyncStorage and
  // rehydrate on app load. For course/demo work in the short term, in-memory is OK.
  const [collected, setCollected] = useState<RecipeSummary[]>([]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);


  function toggleLike(r: RecipeSummary) {
    setCollected((prev) => {
      const exists = prev.find((p) => p.id === r.id);
      const next = exists ? prev.filter((p) => p.id !== r.id) : [...prev, r];
      // TODO: persist next to AsyncStorage
      return next;
    });
  }

  function isCollected(id: string) {
    return collected.some((p) => p.id === id);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
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
