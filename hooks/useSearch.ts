"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { searchPrompts, getSearchSuggestions, getDidYouMean } from "@/lib/search";
import type { Prompt } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { POPULAR_SEARCHES } from "@/lib/constants";

const MAX_HISTORY = 8;
const DEBOUNCE_MS = 250;

export interface SearchState {
  query: string;
  results: Prompt[];
  suggestions: string[];
  history: string[];
  didYouMean: string | null;
  isSearching: boolean;
  hasQuery: boolean;
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Prompt[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory, clearHistory] = useLocalStorage<string[]>(
    "pv:search:history",
    []
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback((q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      setSuggestions([]);
      setDidYouMean(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchResults = searchPrompts(q, 48);
    const prompts = searchResults.map((r) => r.prompt);
    setResults(prompts);
    setSuggestions(getSearchSuggestions(q, 5));
    setDidYouMean(prompts.length === 0 ? getDidYouMean(q) : null);
    setIsSearching(false);
  }, []);

  // Debounced search
  const handleQueryChange = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(q), DEBOUNCE_MS);
  }, [performSearch]);

  // Save to history on explicit search action
  const saveToHistory = useCallback((q: string) => {
    if (!q.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== q.toLowerCase());
      return [q.trim(), ...filtered].slice(0, MAX_HISTORY);
    });
  }, [setHistory]);

  const removeFromHistory = useCallback((q: string) => {
    setHistory((prev) => prev.filter((h) => h !== q));
  }, [setHistory]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    results,
    suggestions,
    didYouMean,
    isSearching,
    hasQuery: query.trim().length >= 2,
    history,
    popularSearches: POPULAR_SEARCHES,
    handleQueryChange,
    saveToHistory,
    removeFromHistory,
    clearHistory,
  };
}
