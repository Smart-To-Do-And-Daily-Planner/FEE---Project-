import { useEffect, useState } from "react";

/**
 * Custom hook for synchronizing state with browser localStorage.
 * Implemented by Member 3 (State Management & Storage).
 * 
 * Features:
 * - Lazy initial state loader to avoid reading localStorage on every render.
 * - Robust try/catch error handling for JSON parsing and quota errors.
 * - Automatically saves state updates back to localStorage on change.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = localStorage.getItem(key);

      if (savedValue !== null) {
        return JSON.parse(savedValue);
      }

      return initialValue;
    } catch (error) {
      console.log("Error loading data:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data:", error);
    }
  }, [key, value]);

  return [value, setValue];
}