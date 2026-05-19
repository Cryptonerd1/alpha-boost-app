/**
 * useAlphaScore hook
 *
 * Manages the user's Alpha Score state and daily log persistence.
 * Any screen that needs score data imports this hook — never AsyncStorage directly.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateAlphaScore } from '../utils/scoreCalculator';

const STORAGE_KEY = '@alpha_boost:daily_log';

const DEFAULT_LOG = {
  avgFoodScore: 0,
  sleepHours: 0,
  exercised: false,
  waterLiters: 0,
  kegelDone: false,
  stressLevel: 5,
  alcoholFree: true,
  date: '',
};

export function useAlphaScore() {
  const [log, setLog] = useState(DEFAULT_LOG);
  const [scoreData, setScoreData] = useState({ total: 0, breakdown: {} });
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted log on mount
  useEffect(() => {
    loadLog();
  }, []);

  // Recalculate score whenever the log changes
  useEffect(() => {
    setScoreData(calculateAlphaScore(log));
  }, [log]);

  const loadLog = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        // Reset log if it belongs to a previous day
        const today = new Date().toDateString();
        if (stored.date !== today) {
          await persistLog(DEFAULT_LOG, today);
        } else {
          setLog(stored);
          setStreak(stored.streak ?? 0);
        }
      }
    } catch (error) {
      console.warn('useAlphaScore: failed to load log', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistLog = async (updatedLog, date) => {
    const today = date ?? new Date().toDateString();
    const toSave = { ...updatedLog, date: today };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setLog(toSave);
  };

  /**
   * Update a single field in the daily log.
   * @param {keyof typeof DEFAULT_LOG} field
   * @param {*} value
   */
  const updateLog = useCallback(async (field, value) => {
    const updated = { ...log, [field]: value };
    await persistLog(updated);
  }, [log]);

  /**
   * Mark the Kegel session as complete for today.
   */
  const completeKegel = useCallback(async () => {
    await updateLog('kegelDone', true);
  }, [updateLog]);

  /**
   * Log a food scan result — updates the running average food score.
   * @param {number} foodScore
   */
  const logFood = useCallback(async (foodScore) => {
    const currentAvg = log.avgFoodScore || 0;
    // Running average weighted toward today's foods
    const newAvg = currentAvg === 0 ? foodScore : Math.round((currentAvg + foodScore) / 2);
    await updateLog('avgFoodScore', newAvg);
  }, [log, updateLog]);

  return {
    log,
    score: scoreData.total,
    breakdown: scoreData.breakdown,
    streak,
    isLoading,
    updateLog,
    completeKegel,
    logFood,
  };
}
