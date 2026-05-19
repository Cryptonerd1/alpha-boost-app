/**
 * Static data — foods, tips, recipes, programs.
 * In a production app this would come from an API.
 * Centralised here so screens never hardcode content.
 */

/** @type {Record<string, FoodItem>} */
export const FOODS = {
  watermelon: {
    id: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    category: 'Blood Flow King',
    score: 94,
    verdict: 'BOOST',
    metrics: { bloodFlow: 97, testosterone: 78, stamina: 90 },
    sugarLevel: 'Low-Med',
    reason:
      'Highest natural source of citrulline — converts directly to nitric oxide. Opens blood vessels and maximises blood flow. Eating it daily is equivalent to a mild natural performance enhancer.',
    study: 'Cormio et al., BJU International, 2011',
  },
  eggs: {
    id: 'eggs',
    name: 'Eggs',
    emoji: '🥚',
    category: 'Testosterone Builder',
    score: 88,
    verdict: 'BOOST',
    metrics: { bloodFlow: 82, testosterone: 95, stamina: 88 },
    sugarLevel: 'Zero',
    reason:
      'Cholesterol in egg yolk is the raw material for testosterone synthesis. Selenium and B12 support sperm health and motility.',
    study: 'USDA Nutrient Database; multiple endocrinology studies',
  },
  beetroot: {
    id: 'beetroot',
    name: 'Beetroot',
    emoji: '🟣',
    category: 'Blood Flow King',
    score: 92,
    verdict: 'BOOST',
    metrics: { bloodFlow: 99, testosterone: 70, stamina: 92 },
    sugarLevel: 'Low-Med',
    reason:
      'Dietary nitrates increase blood flow by up to 20%. Effect peaks 2–3 hours after eating. Clinically equivalent to low-dose medication in vasodilation studies.',
    study: 'Webb et al., Journal of Applied Physiology, 2010',
  },
  salmon: {
    id: 'salmon',
    name: 'Salmon',
    emoji: '🐟',
    category: 'Testosterone Builder',
    score: 86,
    verdict: 'BOOST',
    metrics: { bloodFlow: 84, testosterone: 88, stamina: 86 },
    sugarLevel: 'Zero',
    reason:
      'Omega-3 fatty acids reduce systemic inflammation and support testosterone production. Also a key source of vitamin D, a direct testosterone precursor.',
    study: 'Kraemer & Ratamess, Journal of Endocrinology, 2012',
  },
  avocado: {
    id: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    category: 'Testosterone Builder',
    score: 84,
    verdict: 'BOOST',
    metrics: { bloodFlow: 80, testosterone: 88, stamina: 82 },
    sugarLevel: 'Very Low',
    reason:
      'Monounsaturated fats are the primary building block for testosterone. Vitamin E is a potent antioxidant that protects sperm from DNA damage.',
    study: 'USDA Nutrient Database; Journal of Reproductive Medicine',
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    category: 'Stamina Booster',
    score: 80,
    verdict: 'BOOST',
    metrics: { bloodFlow: 76, testosterone: 72, stamina: 94 },
    sugarLevel: 'Medium',
    reason:
      'Potassium supports heart health and blood pressure. Vitamin B6 regulates testosterone. Best pre-performance energy food — sustained release, no crash.',
    study: 'USDA Nutrient Database',
  },
  pizza: {
    id: 'pizza',
    name: 'Pizza',
    emoji: '🍕',
    category: 'Performance Killer',
    score: 18,
    verdict: 'AVOID',
    metrics: { bloodFlow: 15, testosterone: 12, stamina: 20 },
    sugarLevel: 'Very High',
    reason:
      'Saturated fat restricts blood vessels and suppresses nitric oxide production. Refined carbs spike insulin, which directly suppresses testosterone. Zero performance value.',
    study: 'Rimm et al., American Journal of Clinical Nutrition, 2021',
  },
  alcohol: {
    id: 'alcohol',
    name: 'Alcohol',
    emoji: '🍺',
    category: 'Testosterone Killer',
    score: 8,
    verdict: 'AVOID',
    metrics: { bloodFlow: 20, testosterone: 5, stamina: 10 },
    sugarLevel: 'High',
    reason:
      'Even 2–3 drinks suppress testosterone for up to 24 hours. Alcohol dehydrates, restricts blood flow, impairs nerve function, and kills erection quality.',
    study: 'Välimäki et al., Alcohol and Alcoholism, 1984',
  },
};

export const DAILY_TIPS = [
  '🍉 Watermelon has more citrulline than any supplement. Eat it daily.',
  '💧 Dehydration reduces blood volume — directly weakening erection quality.',
  '😴 95% of daily testosterone is produced during sleep. Protect 7.5 hours.',
  '🥚 Egg yolk contains cholesterol — the raw material for testosterone synthesis.',
  '🧘 High cortisol directly suppresses testosterone. Manage stress first.',
  '🟣 Beetroot nitrates open blood vessels within 2–3 hours of eating.',
  '💪 20 Kegel reps today = stronger PC muscle and better control tomorrow.',
  '🐟 Omega-3 from salmon reduces inflammation that blocks testosterone production.',
  '🌱 Pumpkin seeds are the highest natural zinc source. Eat a handful daily.',
  '🍫 Dark chocolate (70%+) reduces cortisol and boosts blood flow to the brain.',
];

export const PROGRAMS = [
  {
    id: 'erection',
    name: 'Erection Strength',
    emoji: '🩸',
    description: 'Rebuild blood flow and erection firmness from the ground up.',
    duration: 30,
    targetColor: '#22c55e',
  },
  {
    id: 'last-longer',
    name: 'Last Longer',
    emoji: '⏱',
    description: 'Train your PC muscle and master ejaculation control.',
    duration: 30,
    targetColor: '#3b82f6',
  },
  {
    id: 'fertility',
    name: 'Fertility + Sperm',
    emoji: '🌱',
    description: 'Improve sperm count, motility, and overall fertility.',
    duration: 30,
    targetColor: '#8b5cf6',
  },
  {
    id: 'testosterone',
    name: 'Testosterone + Libido',
    emoji: '⚡',
    description: 'Restore testosterone levels and reignite your sex drive.',
    duration: 30,
    targetColor: '#f59e0b',
  },
  {
    id: 'reset',
    name: 'Complete Reset',
    emoji: '🔄',
    description: 'Optimise all four pillars simultaneously over 30 days.',
    duration: 30,
    targetColor: '#22c55e',
  },
];

export const KEGEL_PROGRAMS = [
  { id: 'quick', label: 'Quick Set', reps: 10, holdSeconds: 5, estimatedMinutes: 5 },
  { id: 'standard', label: 'Standard Set', reps: 20, holdSeconds: 7, estimatedMinutes: 10 },
  { id: 'power', label: 'Power Set', reps: 30, holdSeconds: 10, estimatedMinutes: 18 },
];

export const GAME_DAY_STEPS = [
  { timeLabel: '3 hours before', action: 'Performance smoothie', instruction: 'Blend: 2 cups watermelon (with seeds) + 1 banana + 1 inch ginger + squeeze of lime. Drink immediately.', emoji: '🥤' },
  { timeLabel: '2.5 hours before', action: 'Hydration load', instruction: 'Drink 500ml water now. Continue 250ml every 30 minutes until performance.', emoji: '💧' },
  { timeLabel: '2 hours before', action: 'Light movement', instruction: '20 squats + 20 hip rotations + 5 minutes walking. Activates pelvic blood flow without fatigue.', emoji: '🏃' },
  { timeLabel: '1.5 hours before', action: 'Cold shower', instruction: 'End your shower with 2–3 minutes of cold water on your lower back and groin. Boosts circulation and testosterone.', emoji: '🚿' },
  { timeLabel: '45 minutes before', action: 'Kegel activation', instruction: '20 strong Kegel contractions, 5-second holds. Warms up the PC muscle before performance.', emoji: '💪' },
  { timeLabel: '30 minutes before', action: 'Breathwork', instruction: 'Breathe in for 4 counts, hold 4, out for 6. Repeat 10 times. Eliminates performance anxiety.', emoji: '🧘' },
  { timeLabel: '15 minutes before', action: 'Mental reset', instruction: 'Your body has been prepared. You ate right, moved right, and trained right. Trust the process.', emoji: '🧠' },
];
