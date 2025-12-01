import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export type CollectedItem = {
  id: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  instructions?: string;
  ingredients?: string[];
};

type CollectedCtx = {
  collected: CollectedItem[];
  toggleLike: (item: CollectedItem) => void;
  isCollected: (id: string) => boolean;
  clearCollected: () => void;
};

const STORAGE_KEY = '@collected_recipes_v1';
const CollectedContext = createContext<CollectedCtx | undefined>(undefined);

export const CollectedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collected, setCollected] = useState<CollectedItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setCollected(parsed);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
      } catch (error) {
        console.error('Failed to save collected recipes:', error);
        // Consider showing a toast notification to user
        Alert.alert('Storage Error', 'Failed to save your recipes. Please try again.');
      }
    })();
  }, [collected]);

  const toggleLike = useCallback((item: CollectedItem) => {
    setCollected((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        // remove when unliked
        return prev.filter((p) => p.id !== item.id);
      }
      // add full item when liked
      return [{ ...item }, ...prev];
    });
  }, []);

  const isCollected = useCallback((id: string) => collected.some((c) => c.id === id), [collected]);

  const clearCollected = useCallback(() => setCollected([]), []);

  return (
    <CollectedContext.Provider value={{ collected, toggleLike, isCollected, clearCollected }}>
      {children}
    </CollectedContext.Provider>
  );
};

export const useCollected = () => {
  const ctx = useContext(CollectedContext);
  if (!ctx) throw new Error('useCollected must be used within CollectedProvider');
  return ctx;
};
