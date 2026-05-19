/**
 * ScoreRing
 *
 * The circular progress indicator used for the Alpha Score.
 * Built with SVG for smooth rendering at any size.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants/theme';

/**
 * @param {object} props
 * @param {number}  props.score      - Current score (0–100)
 * @param {number}  props.size       - Diameter in pixels (default 90)
 * @param {number}  props.strokeWidth - Ring stroke width (default 8)
 * @param {string}  props.color      - Ring colour (default primary green)
 * @param {boolean} props.showLabel  - Whether to show the % label inside
 */
export default function ScoreRing({
  score = 0,
  size = 90,
  strokeWidth = 8,
  color = Colors.primary,
  showLabel = true,
}) {
  const animatedScore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const innerSize = size - strokeWidth * 2;
  const innerRadius = innerSize / 2;

  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: Colors.lightGrey }]}>
      <View style={[styles.inner, { width: innerSize, height: innerSize, borderRadius: innerRadius, borderWidth: strokeWidth, borderColor: color }]}>
        {showLabel && (
          <Text style={[styles.label, { color: Colors.white }]}>
            {score}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.black,
  },
});
