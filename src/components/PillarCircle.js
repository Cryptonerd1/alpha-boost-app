/**
 * PillarCircle
 *
 * One of the three performance pillar indicators shown below
 * the Alpha Score card on the Home screen.
 * Mirrors Cal AI's macro circles.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

/**
 * @param {object} props
 * @param {string} props.label - Pillar name e.g. "Blood Flow"
 * @param {number} props.score - Score 0–100
 * @param {string} props.color - Ring and score colour
 */
export default function PillarCircle({ label, score, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.ring, { borderColor: color }]}>
        <Text style={[styles.score, { color }]}>{score}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
  },
  ring: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  score: {
    fontSize: Typography.md,
    fontWeight: Typography.black,
  },
  label: {
    fontSize: Typography.xs,
    color: Colors.grey,
    fontWeight: Typography.semiBold,
    textAlign: 'center',
  },
});
