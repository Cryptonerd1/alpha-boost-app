/**
 * ScannerScreen
 *
 * The AI food scanner. Mirrors Cal AI's camera screen:
 * - Full dark camera area with "Just snap a pic" headline
 * - 3 scan modes: Scan Food / Barcode / Food Label
 * - Result card with Performance Score and breakdown
 *
 * In production, the camera integrates with expo-camera
 * and sends the image to the OpenAI Vision API.
 * The demo simulates this with a local food database.
 */

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator,
} from 'react-native';

import { FOODS } from '../constants/data';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { getFoodVerdict } from '../utils/scoreCalculator';
import MetricBar from '../components/MetricBar';

const SCAN_MODES = [
  { id: 'food',    label: '🍽  Scan Food' },
  { id: 'barcode', label: '|||  Barcode'  },
  { id: 'label',   label: '🏷  Food Label' },
];

export default function ScannerScreen() {
  const [activeModeId, setActiveModeId] = useState('food');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);

  /**
   * Simulate an AI scan by selecting a food from the local database.
   * Replace this with a real camera + OpenAI Vision API call in production.
   */
  const simulateScan = (foodId) => {
    const food = FOODS[foodId];
    if (!food) return;

    setIsScanning(true);
    setScannedFood(null);

    // Simulate API latency
    setTimeout(() => {
      setIsScanning(false);
      setScannedFood(food);
    }, 1600);
  };

  if (scannedFood) {
    return (
      <FoodResultScreen
        food={scannedFood}
        onScanAnother={() => setScannedFood(null)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <CameraArea
        activeModeId={activeModeId}
        onModeChange={setActiveModeId}
        isScanning={isScanning}
        onShutterPress={() => simulateScan('watermelon')}
      />
      <QuickScanList onSelect={simulateScan} />
    </View>
  );
}

// ─── Camera area ───────────────────────────────────────────────

function CameraArea({ activeModeId, onModeChange, isScanning, onShutterPress }) {
  return (
    <View style={styles.cameraArea}>
      {/* Header */}
      <View style={styles.cameraHeader}>
        <Text style={styles.cameraTitle}>⚡ Alpha Boost</Text>
        <View style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </View>
      </View>

      {/* Prompt / scanning state */}
      {isScanning ? (
        <View style={styles.scanningState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.scanningText}>Analysing food...</Text>
        </View>
      ) : (
        <View style={styles.cameraPrompt}>
          <Text style={styles.cameraHeadline}>Just snap a pic</Text>
          <Text style={styles.cameraSub}>Get your food's Performance Score in 3 seconds</Text>
          <Viewfinder />
        </View>
      )}

      {/* Scan mode tabs */}
      <View style={styles.modesRow}>
        {SCAN_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeTab, activeModeId === mode.id && styles.modeTabActive]}
            onPress={() => onModeChange(mode.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeLabel, activeModeId === mode.id && styles.modeLabelActive]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shutter button */}
      <View style={styles.shutterRow}>
        <TouchableOpacity style={styles.shutterOuter} onPress={onShutterPress} activeOpacity={0.8}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Viewfinder() {
  return (
    <View style={styles.viewfinder}>
      <View style={[styles.corner, styles.cornerTopLeft]} />
      <View style={[styles.corner, styles.cornerTopRight]} />
      <View style={[styles.corner, styles.cornerBottomLeft]} />
      <View style={[styles.corner, styles.cornerBottomRight]} />
      <Text style={styles.viewfinderIcon}>🍽</Text>
    </View>
  );
}

// ─── Quick scan list ────────────────────────────────────────────

function QuickScanList({ onSelect }) {
  return (
    <View style={styles.quickScanSection}>
      <Text style={styles.quickScanTitle}>Quick scan</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.values(FOODS).map((food) => (
          <TouchableOpacity
            key={food.id}
            style={styles.quickScanItem}
            onPress={() => onSelect(food.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickScanEmoji}>{food.emoji}</Text>
            <Text style={styles.quickScanName}>{food.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Food result screen ─────────────────────────────────────────

function FoodResultScreen({ food, onScanAnother }) {
  const verdict = getFoodVerdict(food.score);

  return (
    <ScrollView style={styles.resultScreen} contentContainerStyle={styles.resultContent}>
      {/* Hero area with emoji and verdict badge */}
      <View style={styles.resultHero}>
        <Text style={styles.resultEmoji}>{food.emoji}</Text>
        <View style={[styles.verdictPill, { backgroundColor: verdict.bg }]}>
          <Text style={[styles.verdictLabel, { color: verdict.color }]}>{food.verdict}</Text>
        </View>
      </View>

      {/* Result details card */}
      <View style={styles.resultCard}>
        {/* Name and score */}
        <View style={styles.resultHeaderRow}>
          <View>
            <Text style={styles.resultFoodName}>{food.name}</Text>
            <Text style={styles.resultCategory}>{food.category}</Text>
          </View>
          <View>
            <Text style={[styles.resultScoreNumber, { color: verdict.color }]}>{food.score}</Text>
            <Text style={styles.resultScoreMax}>/ 100</Text>
          </View>
        </View>

        {/* Metric bars */}
        <View style={styles.metricsSection}>
          <MetricBar label="Blood Flow"   value={food.metrics.bloodFlow}   color={Colors.bloodFlow} />
          <MetricBar label="Testosterone" value={food.metrics.testosterone} color={Colors.testosterone} />
          <MetricBar label="Stamina"      value={food.metrics.stamina}      color={Colors.stamina} />
          <View style={styles.sugarRow}>
            <Text style={styles.sugarLabel}>Sugar Level</Text>
            <View style={[styles.sugarChip, { backgroundColor: verdict.bg }]}>
              <Text style={[styles.sugarValue, { color: verdict.color }]}>{food.sugarLevel}</Text>
            </View>
          </View>
        </View>

        {/* Science note */}
        <View style={styles.scienceBox}>
          <Text style={styles.scienceBoxLabel}>WHY THIS MATTERS</Text>
          <Text style={styles.scienceBoxText}>{food.reason}</Text>
          {food.study && <Text style={styles.studyCitation}>Source: {food.study}</Text>}
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.logButton} activeOpacity={0.85}>
          <Text style={styles.logButtonText}>Log This Food</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAnother} activeOpacity={0.7}>
          <Text style={styles.scanAgainText}>Scan Another</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },

  // Camera
  cameraArea: { backgroundColor: '#0a0a0a', paddingBottom: Spacing.lg },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.screenTop,
    paddingBottom: Spacing.base,
  },
  cameraTitle: { fontSize: Typography.xl, fontWeight: Typography.black, color: Colors.white },
  helpButton: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#374151', alignItems: 'center', justifyContent: 'center' },
  helpButtonText: { color: '#9ca3af', fontWeight: Typography.bold, fontSize: 13 },
  cameraPrompt: { alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },
  cameraHeadline: { fontSize: 28, fontWeight: Typography.black, color: Colors.white, letterSpacing: -0.5, marginBottom: Spacing.xs },
  cameraSub: { fontSize: Typography.base, color: '#9ca3af', textAlign: 'center', marginBottom: Spacing.lg },
  scanningState: { alignItems: 'center', paddingVertical: 60, gap: Spacing.base },
  scanningText: { fontSize: Typography.md, color: '#9ca3af', fontWeight: Typography.semiBold },

  // Viewfinder
  viewfinder: { width: 200, height: 200, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Colors.primary, borderStyle: 'solid' },
  cornerTopLeft:     { top: 0, left: 0,     borderTopWidth: 3,    borderLeftWidth: 3   },
  cornerTopRight:    { top: 0, right: 0,    borderTopWidth: 3,    borderRightWidth: 3  },
  cornerBottomLeft:  { bottom: 0, left: 0,  borderBottomWidth: 3, borderLeftWidth: 3   },
  cornerBottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3  },
  viewfinderIcon: { fontSize: 64, opacity: 0.25 },

  // Scan modes
  modesRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.base },
  modeTab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.sm, backgroundColor: '#1f2937', alignItems: 'center' },
  modeTabActive: { backgroundColor: Colors.primary },
  modeLabel: { fontSize: Typography.xs, color: '#9ca3af', fontWeight: Typography.bold },
  modeLabelActive: { color: Colors.white },

  // Shutter
  shutterRow: { alignItems: 'center', paddingBottom: Spacing.sm },
  shutterOuter: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: '#d1d5db' },

  // Quick scan
  quickScanSection: { padding: Spacing.base },
  quickScanTitle: { fontSize: Typography.md, fontWeight: Typography.extraBold, color: Colors.black, marginBottom: Spacing.md },
  quickScanItem: { alignItems: 'center', marginRight: Spacing.md, backgroundColor: Colors.lightGrey, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border, minWidth: 72 },
  quickScanEmoji: { fontSize: 28, marginBottom: Spacing.xs },
  quickScanName: { fontSize: Typography.xs, color: Colors.grey, fontWeight: Typography.semiBold, textAlign: 'center' },

  // Result
  resultScreen: { flex: 1, backgroundColor: Colors.white },
  resultContent: { paddingBottom: 100 },
  resultHero: { backgroundColor: '#0a0a0a', alignItems: 'center', paddingTop: Spacing.screenTop, paddingBottom: Spacing['2xl'] },
  resultEmoji: { fontSize: 80, marginBottom: Spacing.base },
  verdictPill: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill },
  verdictLabel: { fontSize: Typography.base, fontWeight: Typography.black, letterSpacing: 2 },
  resultCard: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -16, padding: Spacing.xl },
  resultHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  resultFoodName: { fontSize: Typography['2xl'], fontWeight: Typography.black, color: Colors.black, letterSpacing: -0.5 },
  resultCategory: { fontSize: 13, color: Colors.grey, marginTop: 3 },
  resultScoreNumber: { fontSize: Typography['4xl'], fontWeight: Typography.black, letterSpacing: -1 },
  resultScoreMax: { fontSize: Typography.sm, color: Colors.grey, textAlign: 'center' },
  metricsSection: { marginBottom: Spacing.lg },
  sugarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  sugarLabel: { width: 100, fontSize: Typography.sm, color: Colors.grey, fontWeight: Typography.semiBold },
  sugarChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.pill },
  sugarValue: { fontSize: Typography.xs, fontWeight: Typography.bold },
  scienceBox: { backgroundColor: '#f0fdf4', borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.base, borderWidth: 1.5, borderColor: Colors.primaryBorder },
  scienceBoxLabel: { fontSize: Typography.xs, fontWeight: Typography.extraBold, color: Colors.primary, letterSpacing: 1.5, marginBottom: Spacing.xs },
  scienceBoxText: { fontSize: 13, color: '#166534', lineHeight: 20 },
  studyCitation: { fontSize: Typography.xs, color: '#6b7280', marginTop: Spacing.sm, fontStyle: 'italic' },
  logButton: { backgroundColor: Colors.black, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', marginBottom: Spacing.sm },
  logButtonText: { color: Colors.white, fontWeight: Typography.extraBold, fontSize: Typography.md },
  scanAgainButton: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center' },
  scanAgainText: { color: Colors.grey, fontWeight: Typography.bold, fontSize: Typography.base },
});
