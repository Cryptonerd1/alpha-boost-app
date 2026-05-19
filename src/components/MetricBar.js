/**
 * MetricBar
 *
 * A labelled horizontal progress bar used in food scan results
 * and the Alpha Score breakdown panel.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

/**
 * @param {object} props
 * @param {string} props.label   - Factor name e.g. "Blood Flow"
 * @param {number} props.value   - Score 0–100
 * @param {string} props.color   - Bar fill colour
 * @param {number} props.labelWidth - Width reserved for the label column
 */
export default function MetricBar({ label, value, color = Colors.primary, labelWidth = 100 }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { width: labelWidth }]}>{label}</Text>

      <View style={styles.trackOuter}>
        <View style={[styles.trackFill, { width: `${clamped}%`, backgroundColor: color }]} />
      </View>

      <Text style={[styles.value, { color }]}>{clamped}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.grey,
    fontWeight: Typography.semiBold,
  },
  trackOuter: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.lightGrey,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
  value: {
    width: 28,
    fontSize: Typography.sm,
    fontWeight: Typography.black,
    textAlign: 'right',
  },
});
