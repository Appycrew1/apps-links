"use client";
import { useEffect, useState } from "react";

export function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export function useLocalStorage(key, initialValue) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : initialValue;
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return initialValue;
      return parsed;
    } catch {
      return initialValue;
    }
  };
  const [value, setValue] = useState(initialValue);
  useEffect(() => { setValue(read()); }, [key]);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}
