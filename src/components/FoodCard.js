/**
 * FoodCard
 *
 * Displays a single food item in the "Recently scanned" feed
 * on the Home screen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { getFoodVerdict } from '../utils/scoreCalculator';

/**
 * @param {object} props
 * @param {string} props.emoji    - Food emoji
 * @param {string} props.name     - Food name
 * @param {string} props.category - e.g. "Blood Flow Booster"
 * @param {number} props.score    - Performance score 0–100
 */
export default function FoodCard({ emoji, name, category, score }) {
  const verdict = getFoodVerdict(score);

  return (
    <View style={styles.container}>
      {/* Emoji thumbnail */}
      <View style={styles.thumbnail}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Name and category */}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>

      {/* Score badge and verdict label */}
      <View style={styles.scoreBlock}>
        <View style={[styles.badge, { backgroundColor: verdict.bg }]}>
          <Text style={[styles.badgeScore, { color: verdict.color }]}>{score}</Text>
        </View>
        <Text style={styles.verdict}>{verdict.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: 2,
  },
  category: {
    fontSize: Typography.sm,
    color: Colors.grey,
  },
  scoreBlock: {
    alignItems: 'center',
    gap: 2,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeScore: {
    fontSize: Typography.lg,
    fontWeight: Typography.black,
  },
  verdict: {
    fontSize: Typography.xs,
    color: Colors.grey,
    fontWeight: Typography.semiBold,
  },
});
