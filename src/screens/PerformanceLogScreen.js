import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const GREEN = '#22c55e';
const BLACK = '#111827';
const GREY = '#6b7280';
const BORDER = '#e5e7eb';
const WHITE = '#ffffff';
const LIGHT = '#f9fafb';

const WEEKS = ['6M', '30D', '7D', 'ALL'];

const MOCK_SCORES = [62, 58, 71, 74, 68, 80, 82, 76, 85, 88, 84, 90, 87, 91, 94, 89, 92, 96, 93, 97, 95, 98, 96, 99, 97, 100, 98, 100, 99, 100];

export default function PerformanceLogScreen() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [alphaScore] = useState(88);
  const [goalScore] = useState(100);
  const [streak] = useState(21);

  const today = new Date();
  const calDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return { date: d.getDate(), score: MOCK_SCORES[i], active: i >= 16 };
  });

  const factors = [
    { label: 'Nutrition', score: 92, max: 25, color: GREEN },
    { label: 'Sleep', score: 85, max: 20, color: '#3b82f6' },
    { label: 'Exercise', score: 90, max: 20, color: '#f59e0b' },
    { label: 'Hydration', score: 70, max: 10, color: '#06b6d4' },
    { label: 'Kegels', score: 100, max: 10, color: '#8b5cf6' },
    { label: 'Stress', score: 60, max: 10, color: '#f43f5e' },
    { label: 'No Alcohol', score: 100, max: 5, color: GREEN },
  ];

  const scoreColor = (s) => s >= 80 ? GREEN : s >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <Text style={styles.headerSub}>Day 21 of 30 · Complete Reset Program</Text>
      </View>

      {/* Score + Streak Card */}
      <View style={styles.topCard}>
        <View style={styles.topCardLeft}>
          <Text style={styles.topCardLabel}>Alpha Score</Text>
          <Text style={styles.topCardScore}>{alphaScore}</Text>
          <Text style={styles.topCardGoal}>Goal: {goalScore}</Text>
          <TouchableOpacity style={styles.logTodayBtn}>
            <Text style={styles.logTodayText}>Log today →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.topCardRight}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
          {/* Mini calendar dots */}
          <View style={styles.streakDots}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <View key={i} style={styles.streakDotCol}>
                <Text style={styles.streakDotDay}>{d}</Text>
                <View style={[styles.streakDot, i < 5 && styles.streakDotActive]} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Alpha Score Trend */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Alpha Score trend</Text>
          <View style={styles.weekTabs}>
            {WEEKS.map((w, i) => (
              <TouchableOpacity key={i} style={[styles.weekTab, activeWeek === i && styles.weekTabActive]} onPress={() => setActiveWeek(i)}>
                <Text style={[styles.weekTabText, activeWeek === i && styles.weekTabTextActive]}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Simple Bar Chart */}
        <View style={styles.chartArea}>
          <View style={styles.chartBars}>
            {calDays.slice(-14).map((d, i) => (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: `${d.score}%`, backgroundColor: d.active ? GREEN : '#e5e7eb' }]} />
                <Text style={styles.barLabel}>{d.date}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartCaption}>🟢 Great job! 21 days consistent and climbing.</Text>
        </View>
      </View>

      {/* 30-Day Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>30-day calendar</Text>
        <View style={styles.calendar}>
          {calDays.map((d, i) => (
            <View key={i} style={[styles.calDay, { backgroundColor: d.active ? scoreColor(d.score) : '#f3f4f6' }]}>
              <Text style={[styles.calDayNum, { color: d.active ? '#fff' : GREY }]}>{d.date}</Text>
            </View>
          ))}
        </View>
        <View style={styles.calLegend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: GREEN }]} /><Text style={styles.legendText}>80-100</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} /><Text style={styles.legendText}>50-79</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} /><Text style={styles.legendText}>0-49</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#f3f4f6' }]} /><Text style={styles.legendText}>No log</Text></View>
        </View>
      </View>

      {/* Factor Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Score breakdown</Text>
        {factors.map((f, i) => (
          <View key={i} style={styles.factorRow}>
            <Text style={styles.factorLabel}>{f.label}</Text>
            <View style={styles.factorBarBg}>
              <View style={[styles.factorBar, { width: `${f.score}%`, backgroundColor: f.color }]} />
            </View>
            <Text style={[styles.factorScore, { color: f.color }]}>{f.score}</Text>
          </View>
        ))}
      </View>

      {/* Before/After Compare */}
      <View style={styles.compareCard}>
        <Text style={styles.comparTitle}>Watch yourself change</Text>
        <Text style={styles.comparSub}>Your performance score then vs now</Text>
        <View style={styles.compareRow}>
          <View style={styles.compareBox}>
            <Text style={styles.compareScore} style={{ fontSize: 36, fontWeight: '900', color: '#ef4444' }}>44</Text>
            <Text style={styles.compareDate}>Day 1 · May 1</Text>
            <Text style={styles.compareLabel}>Before</Text>
          </View>
          <Text style={styles.compareArrow}>→</Text>
          <View style={styles.compareBox}>
            <Text style={{ fontSize: 36, fontWeight: '900', color: GREEN }}>88</Text>
            <Text style={styles.compareDate}>Day 21 · May 21</Text>
            <Text style={styles.compareLabel}>Now</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareBtnText}>⬆ Share your progress</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Log Entry */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log today</Text>
        {[
          { label: 'Hours of sleep', emoji: '😴', unit: 'hours', done: true },
          { label: 'Water intake', emoji: '💧', unit: 'liters', done: true },
          { label: 'Exercise', emoji: '🏋️', unit: 'minutes', done: false },
          { label: 'Stress level', emoji: '🧠', unit: '/ 10', done: false },
          { label: 'Alcohol today', emoji: '🚫', unit: 'yes / no', done: true },
        ].map((item, i) => (
          <View key={i} style={styles.logItem}>
            <Text style={styles.logEmoji}>{item.emoji}</Text>
            <Text style={styles.logLabel}>{item.label}</Text>
            <View style={[styles.logStatus, { backgroundColor: item.done ? '#dcfce7' : '#f3f4f6' }]}>
              <Text style={[styles.logStatusText, { color: item.done ? GREEN : GREY }]}>{item.done ? '✓ Done' : item.unit}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  content: { paddingBottom: 20 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: BLACK, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: GREY, marginTop: 3, fontWeight: '500' },

  topCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: BLACK, borderRadius: 20, padding: 22, flexDirection: 'row' },
  topCardLeft: { flex: 1 },
  topCardLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  topCardScore: { fontSize: 58, fontWeight: '900', color: WHITE, letterSpacing: -2, lineHeight: 62 },
  topCardGoal: { fontSize: 13, color: '#6b7280', marginBottom: 14 },
  logTodayBtn: { backgroundColor: GREEN, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start' },
  logTodayText: { color: WHITE, fontWeight: '800', fontSize: 13 },
  topCardRight: { alignItems: 'center', justifyContent: 'center', paddingLeft: 16 },
  streakFire: { fontSize: 28, marginBottom: 2 },
  streakNum: { fontSize: 30, fontWeight: '900', color: WHITE, letterSpacing: -1 },
  streakLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginBottom: 12 },
  streakDots: { flexDirection: 'row', gap: 4 },
  streakDotCol: { alignItems: 'center', gap: 3 },
  streakDotDay: { fontSize: 8, color: '#6b7280', fontWeight: '600' },
  streakDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1f2937' },
  streakDotActive: { backgroundColor: GREEN },

  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: BLACK, marginBottom: 12 },
  weekTabs: { flexDirection: 'row', gap: 4 },
  weekTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#f3f4f6' },
  weekTabActive: { backgroundColor: BLACK },
  weekTabText: { fontSize: 11, fontWeight: '700', color: GREY },
  weekTabTextActive: { color: WHITE },

  chartArea: { backgroundColor: '#f9fafb', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: BORDER },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4, marginBottom: 8 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: '80%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 8, color: GREY, marginTop: 4, fontWeight: '600' },
  chartCaption: { fontSize: 12, color: GREEN, fontWeight: '600' },

  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calDay: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  calDayNum: { fontSize: 12, fontWeight: '700' },
  calLegend: { flexDirection: 'row', gap: 14, marginTop: 10, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: GREY, fontWeight: '500' },

  factorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  factorLabel: { width: 90, fontSize: 12, color: GREY, fontWeight: '600' },
  factorBarBg: { flex: 1, height: 7, backgroundColor: '#f3f4f6', borderRadius: 4, overflow: 'hidden' },
  factorBar: { height: '100%', borderRadius: 4 },
  factorScore: { width: 32, fontSize: 12, fontWeight: '900', textAlign: 'right' },

  compareCard: { marginHorizontal: 16, marginBottom: 20, backgroundColor: BLACK, borderRadius: 20, padding: 22 },
  comparTitle: { fontSize: 18, fontWeight: '900', color: WHITE, marginBottom: 4 },
  comparSub: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  compareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20 },
  compareBox: { alignItems: 'center', backgroundColor: '#111827', borderRadius: 14, padding: 16, flex: 1 },
  compareArrow: { fontSize: 24, color: '#374151', paddingHorizontal: 10 },
  compareDate: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  compareLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 },
  shareBtn: { backgroundColor: '#1f2937', borderRadius: 12, padding: 14, alignItems: 'center' },
  shareBtnText: { color: WHITE, fontWeight: '700', fontSize: 14 },

  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER, gap: 12 },
  logEmoji: { fontSize: 22, width: 36, textAlign: 'center' },
  logLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: BLACK },
  logStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logStatusText: { fontSize: 12, fontWeight: '700' },
});
