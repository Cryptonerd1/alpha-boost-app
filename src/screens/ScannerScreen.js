import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Dimensions } from 'react-native';
import { FOOD_DATABASE } from '../data/foods';

const GREEN = '#22c55e';
const RED = '#ef4444';
const { width } = Dimensions.get('window');

const SAMPLE_FOODS = Object.entries(FOOD_DATABASE).map(([key, val]) => ({ key, ...val }));

export default function ScannerScreen() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [recentScans, setRecentScans] = useState([]);

  const simulateScan = (food) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult(food);
      setShowResult(true);
      setRecentScans(prev => [food, ...prev.slice(0, 4)]);
    }, 1800);
  };

  const getVerdictStyle = (verdict) => {
    if (verdict === 'eat_more') return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
    if (verdict === 'moderation') return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
    return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
  };

  const getVerdictLabel = (verdict) => {
    if (verdict === 'eat_more') return '✓ Eat More';
    if (verdict === 'moderation') return '◎ In Moderation';
    return '✗ Avoid';
  };

  const ScoreBar = ({ label, value, max = 100 }) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    const color = value < 0 ? RED : value > 70 ? GREEN : value > 40 ? '#f59e0b' : RED;
    return (
      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>{label}</Text>
        <View style={styles.scoreBarWrap}>
          <View style={[styles.scoreBar, { width: `${Math.abs(pct)}%`, backgroundColor: color }]} />
        </View>
        <Text style={[styles.scoreVal, { color }]}>{value < 0 ? value : value > 10 ? value : `${value}/10`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Food Scanner</Text>
          <Text style={styles.headerSub}>Scan any food to see its sexual health impact</Text>
        </View>

        {/* Camera Mock */}
        <TouchableOpacity
          style={[styles.cameraBox, scanning && styles.cameraBoxScanning]}
          onPress={() => !scanning && simulateScan(SAMPLE_FOODS[Math.floor(Math.random() * SAMPLE_FOODS.length)])}
          activeOpacity={0.85}
        >
          {scanning ? (
            <View style={styles.scanningIndicator}>
              <Text style={styles.cameraIcon}>⏳</Text>
              <Text style={styles.scanningText}>Analysing food...</Text>
              <Text style={styles.scanningSubText}>Checking testosterone, blood flow, nitric oxide...</Text>
            </View>
          ) : (
            <View style={styles.cameraPrompt}>
              <Text style={styles.cameraIcon}>📸</Text>
              <Text style={styles.cameraText}>Tap to Scan Food</Text>
              <Text style={styles.cameraSub}>Point at any food or drink</Text>
            </View>
          )}
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </TouchableOpacity>

        {/* Quick Scan from list */}
        <Text style={styles.orText}>— or select a food to test —</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodChips}>
          {SAMPLE_FOODS.map((f) => (
            <TouchableOpacity key={f.key} style={styles.foodChip} onPress={() => simulateScan(f)}>
              <Text style={styles.foodChipEmoji}>{f.emoji}</Text>
              <Text style={styles.foodChipName}>{f.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            {recentScans.map((f, i) => {
              const v = getVerdictStyle(f.verdict);
              return (
                <TouchableOpacity key={i} style={styles.recentItem} onPress={() => { setResult(f); setShowResult(true); }}>
                  <Text style={styles.recentEmoji}>{f.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentName}>{f.name}</Text>
                    <Text style={styles.recentCat}>{f.category}</Text>
                  </View>
                  <View style={[styles.recentScore, { backgroundColor: v.bg, borderColor: v.border }]}>
                    <Text style={[styles.recentScoreText, { color: v.text }]}>{f.score}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Result Modal */}
      <Modal visible={showResult} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowResult(false)}>
        {result && (
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalEmoji}>{result.emoji}</Text>
                <Text style={styles.modalFoodName}>{result.name}</Text>
                <Text style={styles.modalCategory}>{result.category}</Text>
              </View>

              <View style={styles.overallScore}>
                <View>
                  <Text style={styles.overallLabel}>PERFORMANCE SCORE</Text>
                  <Text style={[styles.overallNum, { color: result.score >= 70 ? GREEN : result.score >= 40 ? '#f59e0b' : RED }]}>{result.score}</Text>
                </View>
                <View style={[styles.verdictBadge, { backgroundColor: getVerdictStyle(result.verdict).bg, borderColor: getVerdictStyle(result.verdict).border }]}>
                  <Text style={[styles.verdictText, { color: getVerdictStyle(result.verdict).text }]}>{getVerdictLabel(result.verdict)}</Text>
                </View>
              </View>

              <View style={styles.scoresCard}>
                <ScoreBar label="Blood Flow" value={result.bloodFlow} />
                <ScoreBar label="Testosterone" value={result.testosterone} />
                <ScoreBar label="Nitric Oxide" value={result.nitricOxide} max={10} />
                <ScoreBar label="Stamina" value={result.stamina} />
                <ScoreBar label="Libido" value={result.libido} />
                <ScoreBar label="Sperm Health" value={result.spermHealth} />
                <ScoreBar label="Sugar Level" value={result.sugarLevel} />
              </View>

              <View style={styles.noteCard}>
                <Text style={styles.noteTitle}>Why This Matters</Text>
                <Text style={styles.noteText}>{result.note}</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowResult(false)}>
                <Text style={styles.closeBtnText}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  cameraBox: {
    margin: 16, height: 240, backgroundColor: '#0a0a0a', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden',
  },
  cameraBoxScanning: { backgroundColor: '#0d1f12' },
  cameraPrompt: { alignItems: 'center' },
  cameraIcon: { fontSize: 48, marginBottom: 12 },
  cameraText: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  cameraSub: { fontSize: 13, color: '#9ca3af' },
  scanningIndicator: { alignItems: 'center' },
  scanningText: { fontSize: 16, fontWeight: '700', color: GREEN, marginBottom: 6, marginTop: 8 },
  scanningSubText: { fontSize: 12, color: '#6b7280', textAlign: 'center', maxWidth: 220 },
  cornerTL: { position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderColor: GREEN, borderRadius: 3 },
  cornerTR: { position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTopWidth: 2.5, borderRightWidth: 2.5, borderColor: GREEN, borderRadius: 3 },
  cornerBL: { position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderColor: GREEN, borderRadius: 3 },
  cornerBR: { position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: GREEN, borderRadius: 3 },
  orText: { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginVertical: 8, fontWeight: '500' },
  foodChips: { paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  foodChip: { backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', minWidth: 80 },
  foodChipEmoji: { fontSize: 24, marginBottom: 6 },
  foodChipName: { fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'center' },
  recentSection: { margin: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0a0a0a', marginBottom: 12 },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 12 },
  recentEmoji: { fontSize: 28 },
  recentName: { fontSize: 14, fontWeight: '700', color: '#0a0a0a' },
  recentCat: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  recentScore: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
  recentScoreText: { fontSize: 16, fontWeight: '900' },
  modal: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 12 },
  modalHandle: { width: 36, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalEmoji: { fontSize: 56, marginBottom: 8 },
  modalFoodName: { fontSize: 26, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5, textAlign: 'center' },
  modalCategory: { fontSize: 12, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  overallScore: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#e5e7eb' },
  overallLabel: { fontSize: 10, color: '#9ca3af', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  overallNum: { fontSize: 52, fontWeight: '900', letterSpacing: -1.5 },
  verdictBadge: { padding: 12, borderRadius: 12, borderWidth: 1.5 },
  verdictText: { fontSize: 14, fontWeight: '800' },
  scoresCard: { backgroundColor: '#f9f9f9', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 12 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreLabel: { fontSize: 12, color: '#374151', fontWeight: '500', width: 100 },
  scoreBarWrap: { flex: 1, height: 7, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  scoreBar: { height: '100%', borderRadius: 3 },
  scoreVal: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },
  noteCard: { backgroundColor: '#f0fdf4', borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1.5, borderColor: '#bbf7d0' },
  noteTitle: { fontSize: 14, fontWeight: '800', color: '#14532d', marginBottom: 8 },
  noteText: { fontSize: 14, color: '#166534', lineHeight: 21 },
  closeBtn: { backgroundColor: '#0a0a0a', padding: 16, borderRadius: 14, marginBottom: 20 },
  closeBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 15 },
});
