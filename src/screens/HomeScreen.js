/**
 * HomeScreen
 *
 * The main dashboard. Mirrors Cal AI's layout:
 * Header → Week strip → Alpha Score card → Pillar circles
 * → Habits row → Quick actions → Tip card → Recent scans
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import { useAlphaScore } from '../hooks/useAlphaScore';
import { DAILY_TIPS, FOODS } from '../constants/data';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import ScoreRing from '../components/ScoreRing';
import PillarCircle from '../components/PillarCircle';
import FoodCard from '../components/FoodCard';

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Sample recent scans — in production this would come from AsyncStorage
const RECENT_SCANS = [
  FOODS.watermelon,
  FOODS.eggs,
  FOODS.pizza,
];

export default function HomeScreen({ navigation }) {
  const { score, streak, log } = useAlphaScore();

  // Today's date and the surrounding 7-day strip
  const weekStrip = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      return {
        dayLabel: WEEK_DAYS[date.getDay()],
        dateNum: date.getDate(),
        isToday: i === 6,
        isActive: i >= 3, // mock: last 4 days logged
      };
    });
  }, []);

  const pillars = [
    { label: 'Blood Flow', score: 82, color: Colors.bloodFlow },
    { label: 'Testosterone', score: 74, color: Colors.testosterone },
    { label: 'Stamina', score: 61, color: Colors.stamina },
  ];

  const habits = [
    { label: 'Food logged', done: log.avgFoodScore > 0, emoji: '🥤' },
    { label: 'Kegel done', done: log.kegelDone, emoji: '💪' },
    { label: '7h+ sleep', done: log.sleepHours >= 7, emoji: '😴' },
    { label: '2L water', done: log.waterLiters >= 2, emoji: '💧' },
  ];

  const dailyTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header streak={streak} />
      <WeekStrip days={weekStrip} />

      {/* Alpha Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreLeft}>
          <Text style={styles.scoreLabel}>ALPHA SCORE</Text>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreSubLabel}>out of 100</Text>
          <Text style={styles.programDay}>Day 8 of 30 · Complete Reset</Text>
        </View>
        <ScoreRing score={score} size={90} />
      </View>

      {/* Performance pillars */}
      <View style={styles.pillarsRow}>
        {pillars.map((p) => (
          <PillarCircle key={p.label} {...p} />
        ))}
      </View>

      {/* Today's habits */}
      <Section title="Today's habits">
        <View style={styles.habitsRow}>
          {habits.map((h) => (
            <HabitChip key={h.label} {...h} />
          ))}
        </View>
      </Section>

      {/* Quick action buttons */}
      <View style={styles.quickActions}>
        <QuickButton
          icon="📸"
          label="Scan Food"
          primary
          onPress={() => navigation.navigate('Scanner')}
        />
        <QuickButton
          icon="💪"
          label="Kegels"
          onPress={() => navigation.navigate('Kegel')}
        />
        <QuickButton
          icon="⚡"
          label="Tonight"
          onPress={() => navigation.navigate('GameDay')}
        />
      </View>

      {/* Daily tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>DAILY TIP</Text>
        <Text style={styles.tipText}>{dailyTip}</Text>
      </View>

      {/* Recent scans */}
      <Section title="Recently scanned">
        {RECENT_SCANS.map((food) => (
          <FoodCard key={food.id} {...food} />
        ))}
      </Section>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function Header({ streak }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Good morning 👋</Text>
        <Text style={styles.appName}>Alpha Boost</Text>
      </View>
      <View style={styles.streakBadge}>
        <Text style={styles.streakFire}>🔥</Text>
        <Text style={styles.streakCount}>{streak}</Text>
      </View>
    </View>
  );
}

function WeekStrip({ days }) {
  return (
    <View style={styles.weekStrip}>
      {days.map((d, i) => (
        <View key={i} style={styles.dayColumn}>
          <Text style={styles.dayLabel}>{d.dayLabel}</Text>
          <View style={[styles.dayCircle, d.isActive && styles.dayCircleActive]}>
            <Text style={[styles.dayNumber, d.isActive && styles.dayNumberActive]}>
              {d.dateNum}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function HabitChip({ emoji, label, done }) {
  return (
    <View style={[styles.habitChip, done && styles.habitChipDone]}>
      <Text style={styles.habitEmoji}>{emoji}</Text>
      <Text style={[styles.habitLabel, done && styles.habitLabelDone]}>{label}</Text>
    </View>
  );
}

function QuickButton({ icon, label, primary, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.quickButton, primary && styles.quickButtonPrimary, primary && styles.quickButtonWide]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.quickButtonIcon}>{icon}</Text>
      <Text style={[styles.quickButtonLabel, primary && styles.quickButtonLabelPrimary]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.lg },
  bottomPadding: { height: 100 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.screenTop,
    paddingBottom: Spacing.base,
  },
  greeting: { fontSize: Typography.sm, color: Colors.grey, fontWeight: Typography.medium },
  appName: { fontSize: Typography['3xl'], fontWeight: Typography.black, color: Colors.black, letterSpacing: -0.5 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.streakBg,
    borderWidth: 1.5,
    borderColor: Colors.streakBorder,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  streakFire: { fontSize: Typography.lg },
  streakCount: { fontSize: Typography.lg, fontWeight: Typography.black, color: Colors.streakOrange },

  // Week strip
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.base,
  },
  dayColumn: { alignItems: 'center', gap: Spacing.xs },
  dayLabel: { fontSize: Typography.xs, color: Colors.grey, fontWeight: Typography.semiBold },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayCircleActive: { backgroundColor: Colors.primary },
  dayNumber: { fontSize: 13, fontWeight: Typography.semiBold, color: Colors.grey },
  dayNumberActive: { color: Colors.white, fontWeight: Typography.extraBold },

  // Score card
  scoreCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    backgroundColor: Colors.black,
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLeft: { flex: 1 },
  scoreLabel: {
    fontSize: Typography.xs,
    color: '#9ca3af',
    fontWeight: Typography.bold,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  scoreNumber: { fontSize: Typography.hero, fontWeight: Typography.black, color: Colors.white, letterSpacing: -2, lineHeight: 68 },
  scoreSubLabel: { fontSize: 13, color: Colors.grey, marginTop: 2 },
  programDay: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.bold, marginTop: Spacing.sm },

  // Pillars
  pillarsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },

  // Section
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.lg, fontWeight: Typography.extraBold, color: Colors.black, marginBottom: Spacing.sm },

  // Habits
  habitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.lightGrey,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  habitChipDone: { backgroundColor: Colors.primaryLight, borderColor: '#86efac' },
  habitEmoji: { fontSize: Typography.base },
  habitLabel: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.grey },
  habitLabelDone: { color: Colors.primaryDark },

  // Quick actions
  quickActions: { flexDirection: 'row', gap: Spacing.sm, marginHorizontal: Spacing.base, marginBottom: Spacing.md },
  quickButton: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  quickButtonPrimary: { backgroundColor: Colors.black, borderColor: Colors.black },
  quickButtonWide: { flex: 1.5 },
  quickButtonIcon: { fontSize: 20, marginBottom: Spacing.xs },
  quickButtonLabel: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.black },
  quickButtonLabelPrimary: { color: Colors.white },

  // Tip
  tipCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    backgroundColor: '#f0fdf4',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
  },
  tipLabel: { fontSize: Typography.xs, fontWeight: Typography.extraBold, color: Colors.primary, letterSpacing: 1.5, marginBottom: Spacing.xs },
  tipText: { fontSize: Typography.base, color: '#166534', lineHeight: 20, fontWeight: Typography.medium },
});
