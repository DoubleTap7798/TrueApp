import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface SavedContextValue {
  savedIds: string[];
  compareIds: string[];
  toggleSaved: (id: string) => void;
  toggleCompare: (id: string) => void;
  isSaved: (id: string) => boolean;
  isInCompare: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextValue | null>(null);

function readStorage(key: string, fallback: string[]): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage("ta-saved", [])
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    readStorage("ta-compare", [])
  );

  useEffect(() => {
    localStorage.setItem("ta-saved", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("ta-compare", JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleSaved = (id: string) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleCompare = (id: string) =>
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // Max 2 compare slots — evict the oldest if full
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });

  return (
    <SavedContext.Provider
      value={{
        savedIds,
        compareIds,
        toggleSaved,
        toggleCompare,
        isSaved: (id) => savedIds.includes(id),
        isInCompare: (id) => compareIds.includes(id),
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within <SavedProvider>");
  return ctx;
}
