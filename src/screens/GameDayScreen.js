import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';

const GREEN = '#22c55e';

const PROTOCOL = [
  { time: '3 Hours', icon: '🍹', title: 'Performance Drink', desc: 'Blend watermelon (with seeds), 1 banana, 1 inch ginger, squeeze of lime. Drink immediately.', why: 'Citrulline converts to nitric oxide — the same pathway as prescription ED medication. 3 hours gives your body time to convert.' },
  { time: '2 Hours', icon: '💧', title: 'Hydration Check', desc: 'Drink a minimum of 500ml of water right now. Continue sipping every 30 minutes.', why: 'Dehydration is a direct cause of weak erections. Blood volume drops when you\'re dehydrated.' },
  { time: '1 Hour', icon: '🚿', title: 'Cold Shower + Movement', desc: 'Finish your shower with 2-3 minutes of cold water. Then do 20 squats.', why: 'Cold water boosts circulation and testosterone. Squats activate blood flow to the pelvic region.' },
  { time: '30 Min', icon: '🏋️', title: 'Kegel Activation', desc: 'Do a set of 20 Kegel contractions, 5-second holds. Focus on the squeeze.', why: 'Activates your PC muscle before performance. Like warming up before a sport.' },
  { time: 'Now', icon: '🧘', title: 'Breathwork — Kill the Anxiety', desc: 'Breathe in for 4 counts, hold for 4, out for 6. Repeat 10 times.', why: 'Anxiety is the #1 erection killer. Cortisol spikes from stress suppress blood flow directly. This resets your nervous system.' },
];

export default function GameDayScreen() {
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [active]);

  const toggleComplete = (i) => {
    setCompleted(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const allDone = completed.length === PROTOCOL.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Game Day Mode ⚡</Text>
        <Text style={styles.headerSub}>Tonight's the night. Follow the protocol.</Text>
      </View>

      {!active ? (
        <View style={styles.activateSection}>
          <Animated.View style={[styles.activateCard, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.activateEmoji}>⚡</Text>
            <Text style={styles.activateTitle}>Activate Game Day</Text>
            <Text style={styles.activateSub}>Start the 3-hour protocol now. The app will guide you through each step at the right time.</Text>
            <TouchableOpacity style={styles.activateBtn} onPress={() => { setActive(true); setStartTime(Date.now()); setCompleted([]); }}>
              <Text style={styles.activateBtnText}>Activate Now →</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>What happens when you activate</Text>
            {PROTOCOL.map((step, i) => (
              <View key={i} style={styles.previewStep}>
                <View style={styles.previewTimeBadge}>
                  <Text style={styles.previewTimeText}>{step.time}</Text>
                </View>
                <Text style={styles.previewStepText}>{step.title}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.activeSection}>
          {allDone ? (
            <View style={styles.allDoneCard}>
              <Text style={styles.allDoneEmoji}>🔥</Text>
              <Text style={styles.allDoneTitle}>You're ready.</Text>
              <Text style={styles.allDoneSub}>Protocol complete. You've done everything right. Trust the process and show up.</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={() => { setActive(false); setCompleted([]); }}>
                <Text style={styles.resetBtnText}>Reset Protocol</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activeBanner}>
              <Text style={styles.activeBannerText}>🟢 Protocol Active</Text>
              <Text style={styles.activeBannerSub}>{completed.length}/{PROTOCOL.length} steps complete</Text>
            </View>
          )}

          {PROTOCOL.map((step, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.stepCard, completed.includes(i) && styles.stepCardDone]}
              onPress={() => toggleComplete(i)}
              activeOpacity={0.85}
            >
              <View style={styles.stepTop}>
                <View style={styles.stepLeft}>
                  <View style={[styles.timeBadge, completed.includes(i) && styles.timeBadgeDone]}>
                    <Text style={[styles.timeBadgeText, completed.includes(i) && styles.timeBadgeTextDone]}>{step.time}</Text>
                  </View>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stepTitle, completed.includes(i) && styles.stepTitleDone]}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
                <View style={[styles.checkbox, completed.includes(i) && styles.checkboxDone]}>
                  {completed.includes(i) && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
              <View style={styles.whyBox}>
                <Text style={styles.whyLabel}>WHY THIS WORKS</Text>
                <Text style={styles.whyText}>{step.why}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {!allDone && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setActive(false); setCompleted([]); }}>
              <Text style={styles.cancelBtnText}>Cancel Protocol</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  activateSection: { padding: 16 },
  activateCard: { backgroundColor: '#0a0a0a', borderRadius: 22, padding: 28, alignItems: 'center', marginBottom: 16 },
  activateEmoji: { fontSize: 52, marginBottom: 14 },
  activateTitle: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' },
  activateSub: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 280 },
  activateBtn: { backgroundColor: GREEN, paddingHorizontal: 32, paddingVertical: 15, borderRadius: 14, width: '100%' },
  activateBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 16 },
  previewCard: { backgroundColor: '#fff', borderRadius: 18, padding: 20, borderWidth: 1.5, borderColor: '#e5e7eb' },
  previewTitle: { fontSize: 15, fontWeight: '800', color: '#0a0a0a', marginBottom: 14 },
  previewStep: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  previewTimeBadge: { backgroundColor: '#f0fdf4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#bbf7d0' },
  previewTimeText: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  previewStepText: { fontSize: 14, fontWeight: '600', color: '#374151', flex: 1 },
  activeSection: { padding: 16 },
  activeBanner: { backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderColor: '#bbf7d0' },
  activeBannerText: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
  activeBannerSub: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  stepCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1.5, borderColor: '#e5e7eb' },
  stepCardDone: { opacity: 0.65, backgroundColor: '#f9f9f9' },
  stepTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stepLeft: { alignItems: 'center', gap: 6 },
  timeBadge: { backgroundColor: '#f0fdf4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#bbf7d0' },
  timeBadgeDone: { backgroundColor: '#e5e7eb', borderColor: '#d1d5db' },
  timeBadgeText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  timeBadgeTextDone: { color: '#9ca3af' },
  stepIcon: { fontSize: 24 },
  stepTitle: { fontSize: 16, fontWeight: '800', color: '#0a0a0a', marginBottom: 4 },
  stepTitleDone: { color: '#9ca3af', textDecorationLine: 'line-through' },
  stepDesc: { fontSize: 13, color: '#374151', lineHeight: 19 },
  checkbox: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: GREEN, borderColor: GREEN },
  checkmark: { color: '#fff', fontWeight: '900', fontSize: 12 },
  whyBox: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  whyLabel: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 },
  whyText: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  allDoneCard: { backgroundColor: '#0a0a0a', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16 },
  allDoneEmoji: { fontSize: 52, marginBottom: 12 },
  allDoneTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
  allDoneSub: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  resetBtn: { backgroundColor: GREEN, padding: 15, borderRadius: 12, width: '100%' },
  resetBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 15 },
  cancelBtn: { backgroundColor: '#f9f9f9', borderWidth: 1.5, borderColor: '#e5e7eb', padding: 14, borderRadius: 12, marginTop: 4 },
  cancelBtnText: { color: '#9ca3af', fontWeight: '700', textAlign: 'center' },
});
