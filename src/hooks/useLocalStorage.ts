import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key in other tabs/windows
  // Wrap handler in useCallback (stable ref for add/removeEventListener)
  // Use functional setState to avoid stale prev comparisons
  const handleStorageChange = useCallback((e: StorageEvent) => {
    if (e.key !== key) return;
    if (e.newValue === null) {
      // Key was removed in another tab
      setStoredValue(initialValue);
      return;
    }
    try {
      const incoming = JSON.parse(e.newValue);
      setStoredValue(prev => {
        // Referential equality check prevents unnecessary re-renders
        // when the value hasn't actually changed
        const prevSerialized = JSON.stringify(prev);
        return prevSerialized !== e.newValue ? incoming : prev;
      });
    } catch {
      // Malformed JSON in storage — ignore silently
    }
  }, [key, initialValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);

  return [storedValue, setValue, removeValue];
}
