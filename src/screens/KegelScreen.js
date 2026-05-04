import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';

const GREEN = '#22c55e';

const LEVELS = [
  { name: 'Beginner', reps: 20, holdSec: 5, restSec: 5, color: '#22c55e' },
  { name: 'Intermediate', reps: 40, holdSec: 7, restSec: 4, color: '#f59e0b' },
  { name: 'Advanced', reps: 60, holdSec: 10, restSec: 3, color: '#ef4444' },
];

export default function KegelScreen() {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState('squeeze'); // squeeze | release
  const [rep, setRep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [done, setDone] = useState(false);
  const [totalReps, setTotalReps] = useState(0);
  const [streak, setStreak] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const level = LEVELS[selectedLevel];

  useEffect(() => {
    if (started && !done) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
      ).start();
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [started]);

  const startTimer = () => {
    let currentPhase = 'squeeze';
    let currentTime = level.holdSec;
    let currentRep = 1;

    timerRef.current = setInterval(() => {
      currentTime -= 1;
      setTimeLeft(currentTime);

      if (currentTime <= 0) {
        if (currentPhase === 'squeeze') {
          currentPhase = 'release';
          currentTime = level.restSec;
          setPhase('release');
        } else {
          currentRep += 1;
          setRep(currentRep);
          if (currentRep > level.reps) {
            clearInterval(timerRef.current);
            setDone(true);
            setTotalReps(prev => prev + level.reps);
            setStreak(prev => prev + 1);
            pulseAnim.stopAnimation();
            return;
          }
          currentPhase = 'squeeze';
          currentTime = level.holdSec;
          setPhase('squeeze');
        }
        setTimeLeft(currentTime);
      }
    }, 1000);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setStarted(false);
    setDone(false);
    setRep(1);
    setPhase('squeeze');
    setTimeLeft(level.holdSec);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const progress = (rep - 1) / level.reps;

  if (done) {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.doneEmoji}>💪</Text>
        <Text style={styles.doneTitle}>Session Complete!</Text>
        <Text style={styles.doneSub}>{level.reps} reps at {level.name} level</Text>
        <View style={styles.doneStats}>
          <View style={styles.doneStat}>
            <Text style={styles.doneStatNum}>{level.reps}</Text>
            <Text style={styles.doneStatLabel}>Reps Done</Text>
          </View>
          <View style={styles.doneStatDivider} />
          <View style={styles.doneStat}>
            <Text style={styles.doneStatNum}>{streak}</Text>
            <Text style={styles.doneStatLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.doneStatDivider} />
          <View style={styles.doneStat}>
            <Text style={styles.doneStatNum}>{totalReps}</Text>
            <Text style={styles.doneStatLabel}>Total Reps</Text>
          </View>
        </View>
        <View style={styles.doneNote}>
          <Text style={styles.doneNoteText}>Consistency is everything. Come back tomorrow and your results will compound.</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={reset}>
          <Text style={styles.primaryBtnText}>Do Another Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (started) {
    return (
      <View style={styles.activeContainer}>
        <Text style={styles.repCount}>Rep {Math.min(rep, level.reps)} / {level.reps}</Text>
        <View style={styles.progressRingWrap}>
          <View style={styles.progressRingBg} />
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], backgroundColor: phase === 'squeeze' ? GREEN : '#f59e0b' }]}>
            <Text style={styles.phaseText}>{phase === 'squeeze' ? 'SQUEEZE' : 'RELEASE'}</Text>
            <Text style={styles.timerNum}>{timeLeft}s</Text>
          </Animated.View>
        </View>
        <Text style={styles.phaseInstruction}>
          {phase === 'squeeze' ? 'Tighten your pelvic floor muscle\nHold it firmly' : 'Relax completely\nBreathe out slowly'}
        </Text>
        <View style={styles.activeProgressBar}>
          <View style={[styles.activeProgressFill, { width: `${progress * 100}%` }]} />
        </View>
        <TouchableOpacity style={styles.stopBtn} onPress={reset}>
          <Text style={styles.stopBtnText}>Stop Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kegel Trainer</Text>
        <Text style={styles.headerSub}>The #1 exercise for lasting longer and stronger erections</Text>
      </View>

      <View style={styles.whyCard}>
        <Text style={styles.whyTitle}>Why Kegels Work</Text>
        <Text style={styles.whyText}>The pubococcygeus (PC) muscle controls ejaculation. Strengthening it gives you direct control over when and how you finish. Most men never train this muscle. 3-4 weeks of daily Kegels = noticeable difference in erection strength and duration.</Text>
      </View>

      <Text style={styles.sectionTitle}>Choose Your Level</Text>
      <View style={styles.levelsContainer}>
        {LEVELS.map((l, i) => (
          <TouchableOpacity
            key={l.name}
            style={[styles.levelCard, selectedLevel === i && styles.levelCardSelected, selectedLevel === i && { borderColor: l.color }]}
            onPress={() => setSelectedLevel(i)}
          >
            <View style={[styles.levelDot, { backgroundColor: l.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.levelName}>{l.name}</Text>
              <Text style={styles.levelDetail}>{l.reps} reps · {l.holdSec}s hold · {l.restSec}s rest</Text>
            </View>
            {selectedLevel === i && <Text style={{ color: l.color, fontWeight: '700' }}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak 🔥</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{totalReps}</Text>
          <Text style={styles.statLabel}>Total Reps</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{level.reps}</Text>
          <Text style={styles.statLabel}>This Session</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={() => { setTimeLeft(level.holdSec); setStarted(true); }}>
        <Text style={styles.startBtnText}>Start Session →</Text>
      </TouchableOpacity>

      <View style={styles.techniqueCard}>
        <Text style={styles.techniqueTitle}>How to Do a Kegel</Text>
        {['Find the muscle: stop urination midstream — that\'s the PC muscle', 'Squeeze: contract that muscle firmly', 'Hold: maintain for the required seconds', 'Release: let go completely and rest', 'Repeat: for the full rep count'].map((s, i) => (
          <View key={i} style={styles.techniqueStep}>
            <Text style={styles.techniqueNum}>{i + 1}</Text>
            <Text style={styles.techniqueText}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  whyCard: { margin: 16, backgroundColor: '#f0fdf4', borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: '#bbf7d0' },
  whyTitle: { fontSize: 15, fontWeight: '800', color: '#14532d', marginBottom: 8 },
  whyText: { fontSize: 13, color: '#166534', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0a0a0a', marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
  levelsContainer: { marginHorizontal: 16, gap: 10, marginBottom: 16 },
  levelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 14 },
  levelCardSelected: { backgroundColor: '#f9fafb' },
  levelDot: { width: 12, height: 12, borderRadius: 6 },
  levelName: { fontSize: 15, fontWeight: '700', color: '#0a0a0a' },
  levelDetail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb' },
  statNum: { fontSize: 24, fontWeight: '900', color: GREEN, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginTop: 3, textAlign: 'center' },
  startBtn: { marginHorizontal: 16, backgroundColor: '#0a0a0a', padding: 18, borderRadius: 14, marginBottom: 16 },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  techniqueCard: { margin: 16, backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: '#e5e7eb' },
  techniqueTitle: { fontSize: 15, fontWeight: '800', color: '#0a0a0a', marginBottom: 14 },
  techniqueStep: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  techniqueNum: { width: 22, height: 22, backgroundColor: '#f0fdf4', borderRadius: 11, textAlign: 'center', color: GREEN, fontWeight: '800', fontSize: 12, lineHeight: 22 },
  techniqueText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 19 },
  // Active state
  activeContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 32 },
  repCount: { fontSize: 14, fontWeight: '700', color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 40 },
  progressRingWrap: { position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  progressRingBg: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 8, borderColor: '#e5e7eb' },
  pulseCircle: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center' },
  phaseText: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  timerNum: { fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  phaseInstruction: { fontSize: 15, color: '#374151', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  activeProgressBar: { width: '100%', height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 40 },
  activeProgressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 3 },
  stopBtn: { backgroundColor: '#f9f9f9', borderWidth: 1.5, borderColor: '#e5e7eb', padding: 14, borderRadius: 12 },
  stopBtnText: { color: '#6b7280', fontWeight: '700', fontSize: 14, textAlign: 'center' },
  // Done state
  doneContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 32, alignItems: 'center' },
  doneEmoji: { fontSize: 64, marginBottom: 16 },
  doneTitle: { fontSize: 28, fontWeight: '900', color: '#0a0a0a', marginBottom: 6 },
  doneSub: { fontSize: 15, color: '#6b7280', marginBottom: 32 },
  doneStats: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  doneStat: { alignItems: 'center', paddingHorizontal: 20 },
  doneStatNum: { fontSize: 28, fontWeight: '900', color: GREEN },
  doneStatLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginTop: 2 },
  doneStatDivider: { width: 1, height: 40, backgroundColor: '#e5e7eb' },
  doneNote: { backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16, marginBottom: 28, borderWidth: 1.5, borderColor: '#bbf7d0', width: '100%' },
  doneNoteText: { fontSize: 14, color: '#166534', lineHeight: 20, textAlign: 'center', fontWeight: '500' },
  primaryBtn: { backgroundColor: '#0a0a0a', padding: 18, borderRadius: 14, width: '100%' },
  primaryBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 15 },
});
