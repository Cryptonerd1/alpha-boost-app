import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GREEN = '#22c55e';
const { width } = Dimensions.get('window');

const DAILY_TIPS = [
  'Eat watermelon today — citrulline converts to nitric oxide, the same pathway as ED medication.',
  'Do your Kegels: 40 reps, 5-second holds. The #1 exercise for lasting longer.',
  'Drink 2-3 liters of water today. Dehydration directly reduces erection quality.',
  'Avoid alcohol today — even 2-3 drinks reduce testosterone for 24 hours.',
  'Get 7-8 hours of sleep tonight. Testosterone peaks between 11pm and 3am.',
  'Add pumpkin seeds to your meals today — best natural zinc source available.',
  'Try a cold shower: 2-3 minutes cold at the end boosts circulation and testosterone.',
];

export default function HomeScreen({ navigation }) {
  const [alphaScore, setAlphaScore] = useState(41);
  const [streak, setStreak] = useState(0);
  const [todayLog, setTodayLog] = useState({ kegel: false, water: 0, sleep: 0 });
  const [tip] = useState(DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const score = await AsyncStorage.getItem('alpha_score');
    const s = await AsyncStorage.getItem('streak');
    if (score) setAlphaScore(parseInt(score));
    if (s) setStreak(parseInt(s));
  };

  const scoreColor = alphaScore >= 70 ? GREEN : alphaScore >= 40 ? '#f59e0b' : '#ef4444';

  const METRICS = [
    { label: 'Blood Flow', val: 68, max: 100 },
    { label: 'Testosterone', val: 52, max: 100 },
    { label: 'Stamina', val: 60, max: 100 },
    { label: 'Zinc Level', val: 45, max: 100 },
  ];

  const QUICK_ACTIONS = [
    { icon: '📸', label: 'Scan Food', screen: 'Scanner' },
    { icon: '🏋️', label: 'Kegels', screen: 'Kegel' },
    { icon: '⚡', label: 'Game Day', screen: 'GameDay' },
    { icon: '📊', label: 'Log', screen: 'PerformanceLog' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.headerTitle}>Alpha<Text style={{ color: GREEN }}>Boost</Text></Text>
        </View>
        <TouchableOpacity style={styles.streakBadge}>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak 🔥</Text>
        </TouchableOpacity>
      </View>

      {/* Alpha Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreCardLabel}>TODAY'S ALPHA SCORE</Text>
        <Text style={[styles.scoreNum, { color: scoreColor }]}>{alphaScore}</Text>
        <Text style={styles.scoreMax}>/100</Text>
        <View style={styles.scoreBarWrap}>
          <View style={[styles.scoreBar, { width: `${alphaScore}%`, backgroundColor: scoreColor }]} />
        </View>
        <Text style={styles.scoreNote}>
          {alphaScore < 50 ? 'Your score is low — follow today\'s plan to improve it.' : alphaScore < 70 ? 'Good progress. Keep your habits consistent.' : 'Excellent. Your body is performing at a high level.'}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {QUICK_ACTIONS.map((a) => (
          <TouchableOpacity key={a.label} style={styles.quickBtn} onPress={() => navigation.navigate(a.screen)}>
            <Text style={styles.quickIcon}>{a.icon}</Text>
            <Text style={styles.quickLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>💡 TODAY'S TIP</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>

      {/* Metrics */}
      <View style={styles.metricsCard}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        {METRICS.map((m) => (
          <View key={m.label} style={styles.metricRow}>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <View style={styles.metricBarWrap}>
              <View style={[styles.metricBar, { width: `${m.val}%` }]} />
            </View>
            <Text style={styles.metricVal}>{m.val}</Text>
          </View>
        ))}
      </View>

      {/* Today's Plan */}
      <View style={styles.planCard}>
        <Text style={styles.sectionTitle}>Today's Plan</Text>
        <TouchableOpacity style={[styles.planItem, todayLog.kegel && styles.planItemDone]} onPress={() => navigation.navigate('Kegel')}>
          <Text style={styles.planItemIcon}>🏋️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.planItemTitle}>Kegel Session</Text>
            <Text style={styles.planItemSub}>40 reps · 5 sec holds</Text>
          </View>
          <Text style={styles.planItemArrow}>{todayLog.kegel ? '✓' : '→'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.planItem} onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.planItemIcon}>📸</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.planItemTitle}>Scan Your Breakfast</Text>
            <Text style={styles.planItemSub}>Know its performance impact</Text>
          </View>
          <Text style={styles.planItemArrow}>→</Text>
        </TouchableOpacity>
        <View style={styles.planItem}>
          <Text style={styles.planItemIcon}>💧</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.planItemTitle}>Hydration Goal</Text>
            <Text style={styles.planItemSub}>Drink 2-3 liters today</Text>
          </View>
          <Text style={styles.planItemArrow}>→</Text>
        </View>
      </View>

      {/* Game Day CTA */}
      <TouchableOpacity style={styles.gameDayCard} onPress={() => navigation.navigate('GameDay')}>
        <View>
          <Text style={styles.gameDayLabel}>TONIGHT'S THE NIGHT?</Text>
          <Text style={styles.gameDayTitle}>Activate Game Day Mode ⚡</Text>
          <Text style={styles.gameDaySub}>3-hour protocol to show up at your best</Text>
        </View>
        <Text style={styles.gameDayArrow}>→</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  greeting: { fontSize: 14, color: '#6b7280', fontWeight: '500', marginBottom: 2 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5 },
  streakBadge: { alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 12, padding: 10, borderWidth: 1.5, borderColor: '#bbf7d0' },
  streakNum: { fontSize: 22, fontWeight: '900', color: GREEN },
  streakLabel: { fontSize: 10, color: '#16a34a', fontWeight: '600' },
  scoreCard: { margin: 16, backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb' },
  scoreCardLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  scoreNum: { fontSize: 80, fontWeight: '900', letterSpacing: -2, lineHeight: 88 },
  scoreMax: { fontSize: 18, color: '#9ca3af', fontWeight: '600', marginTop: -4, marginBottom: 16 },
  scoreBarWrap: { width: '100%', height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  scoreBar: { height: '100%', borderRadius: 4 },
  scoreNote: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
  quickActions: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 16 },
  quickBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb' },
  quickIcon: { fontSize: 24, marginBottom: 6 },
  quickLabel: { fontSize: 11, fontWeight: '700', color: '#374151' },
  tipCard: { marginHorizontal: 16, backgroundColor: '#f0fdf4', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#bbf7d0' },
  tipLabel: { fontSize: 11, fontWeight: '700', color: '#16a34a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  tipText: { fontSize: 14, color: '#14532d', lineHeight: 20, fontWeight: '500' },
  metricsCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0a0a0a', marginBottom: 8 },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metricLabel: { fontSize: 13, color: '#374151', fontWeight: '500', width: 110 },
  metricBarWrap: { flex: 1, height: 7, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  metricBar: { height: '100%', backgroundColor: GREEN, borderRadius: 4 },
  metricVal: { fontSize: 12, fontWeight: '700', color: '#374151', width: 28, textAlign: 'right' },
  planCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1.5, borderColor: '#e5e7eb' },
  planItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', gap: 14 },
  planItemDone: { opacity: 0.5 },
  planItemIcon: { fontSize: 22 },
  planItemTitle: { fontSize: 14, fontWeight: '700', color: '#0a0a0a' },
  planItemSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  planItemArrow: { fontSize: 14, color: GREEN, fontWeight: '700' },
  gameDayCard: { marginHorizontal: 16, backgroundColor: '#0a0a0a', borderRadius: 18, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameDayLabel: { fontSize: 10, color: GREEN, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  gameDayTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  gameDaySub: { fontSize: 12, color: '#9ca3af' },
  gameDayArrow: { fontSize: 24, color: GREEN },
});
