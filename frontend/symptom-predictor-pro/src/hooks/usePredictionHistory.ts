import { useState, useEffect, useCallback } from 'react';
import { PredictionHistoryItem } from '@/types/prediction';

const STORAGE_KEY = 'disease_prediction_history';
const MAX_HISTORY_ITEMS = 20;

export function usePredictionHistory() {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load prediction history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveHistory = useCallback((newHistory: PredictionHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save prediction history:', error);
    }
  }, []);

  const addPrediction = useCallback((
    disease: string,
    confidence: number,
    symptoms: string[]
  ) => {
    const newItem: PredictionHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      disease,
      confidence,
      symptoms,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(newHistory);
    
    return newItem;
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  const removeItem = useCallback((id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    saveHistory(newHistory);
  }, [history, saveHistory]);

  return {
    history,
    addPrediction,
    clearHistory,
    removeItem,
  };
}
