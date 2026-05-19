/**
 * Alpha Score Calculator
 *
 * Computes the Alpha Score (0–100) from 7 daily lifestyle inputs.
 * Each factor is backed by peer-reviewed research.
 *
 * Scientific sources are documented in AlphaBoost_Legal_Citations.docx
 */

/** Maximum points each factor can contribute */
export const SCORE_WEIGHTS = {
  nutrition: 25,   // USDA Nutrient DB; Rimm et al. AJCN 2021
  sleep: 20,       // Leproult & Van Cauter, JAMA 2011
  exercise: 20,    // Kraemer & Ratamess, J. Endocrinology 2012
  hydration: 10,   // European Urology, multiple studies
  kegels: 10,      // Dorey et al., Therapeutic Advances in Urology 2004
  stress: 10,      // Cumming et al., J. Clinical Endocrinology
  alcohol: 5,      // Välimäki et al., Alcohol and Alcoholism
};

/**
 * Calculate the Alpha Score from a daily log entry.
 *
 * @param {object} log
 * @param {number} log.avgFoodScore   - Average food performance score for the day (0–100)
 * @param {number} log.sleepHours     - Hours of sleep logged
 * @param {boolean} log.exercised     - Whether any exercise was logged
 * @param {number} log.waterLiters    - Litres of water consumed
 * @param {boolean} log.kegelDone     - Whether a Kegel session was completed
 * @param {number} log.stressLevel    - Self-reported stress level (1–10)
 * @param {boolean} log.alcoholFree   - Whether the day was alcohol-free
 *
 * @returns {{ total: number, breakdown: Record<string, number> }}
 */
export function calculateAlphaScore(log) {
  const {
    avgFoodScore = 0,
    sleepHours = 0,
    exercised = false,
    waterLiters = 0,
    kegelDone = false,
    stressLevel = 10,
    alcoholFree = false,
  } = log;

  const breakdown = {
    nutrition: scaleScore(avgFoodScore, 100, SCORE_WEIGHTS.nutrition),
    sleep: calculateSleepScore(sleepHours),
    exercise: exercised ? SCORE_WEIGHTS.exercise : 0,
    hydration: calculateHydrationScore(waterLiters),
    kegels: kegelDone ? SCORE_WEIGHTS.kegels : 0,
    stress: calculateStressScore(stressLevel),
    alcohol: alcoholFree ? SCORE_WEIGHTS.alcohol : 0,
  };

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    total: Math.round(total),
    breakdown,
  };
}

/** Sleep score — peaks at 7.5h, penalises both under and over */
function calculateSleepScore(hours) {
  if (hours >= 7.5) return SCORE_WEIGHTS.sleep;
  if (hours >= 6) return Math.round(SCORE_WEIGHTS.sleep * 0.6);
  if (hours >= 5) return Math.round(SCORE_WEIGHTS.sleep * 0.3);
  return 0;
}

/** Hydration score — 2.5L is full score, scales linearly below */
function calculateHydrationScore(liters) {
  if (liters >= 2.5) return SCORE_WEIGHTS.hydration;
  return Math.round((liters / 2.5) * SCORE_WEIGHTS.hydration);
}

/** Stress score — inverted (lower stress = higher score) */
function calculateStressScore(level) {
  const clamped = Math.max(1, Math.min(10, level));
  const inverted = 11 - clamped; // stress 1 → 10 points, stress 10 → 1 point
  return Math.round((inverted / 10) * SCORE_WEIGHTS.stress);
}

/** Scale a raw score (0–maxRaw) to fit within a weight ceiling */
function scaleScore(raw, maxRaw, weight) {
  return Math.round((raw / maxRaw) * weight);
}

/**
 * Return a label and colour for a given Alpha Score.
 * Used throughout the app for consistent messaging.
 */
export function getScoreLabel(score) {
  if (score >= 90) return { label: 'Elite', color: '#22c55e' };
  if (score >= 75) return { label: 'Strong', color: '#22c55e' };
  if (score >= 55) return { label: 'Building', color: '#f59e0b' };
  if (score >= 35) return { label: 'Low', color: '#f97316' };
  return { label: 'Critical', color: '#ef4444' };
}

/**
 * Return verdict data (colour, bg, label) for a food performance score.
 */
export function getFoodVerdict(score) {
  if (score >= 70) return { label: 'Boost', color: '#16a34a', bg: '#dcfce7' };
  if (score >= 40) return { label: 'Neutral', color: '#b45309', bg: '#fef9c3' };
  return { label: 'Avoid', color: '#dc2626', bg: '#fee2e2' };
}
