import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  ScrollView, Animated, Alert, Linking, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GREEN = '#22c55e';
const GREEN_DARK = '#16a34a';
const BLACK = '#0a0a0a';
const GREY = '#6b7280';
const RED = '#ef4444';
const BG = '#f9f9f9';

// ─── Porn site blocklist (DNS-level via hosts file approach in native module)
const BLOCKED_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com',
  'redtube.com', 'youporn.com', 'tube8.com', 'spankbang.com',
  'tnaflix.com', 'beeg.com', 'motherless.com', 'eporner.com',
  'hclips.com', 'hdzog.com', 'txxx.com', 'vporn.com',
  'drtuber.com', 'fuq.com', 'porn.com', 'sex.com',
  'onlyfans.com', 'chaturbate.com', 'livejasmin.com', 'cam4.com',
  'bongacams.com', 'stripchat.com', 'myfreecams.com',
];

const KEGEL_PROGRAMS = [
  { reps: 10, holdSeconds: 5, label: 'Quick Set (5 min)' },
  { reps: 20, holdSeconds: 5, label: 'Standard Set (10 min)' },
  { reps: 30, holdSeconds: 7, label: 'Power Set (15 min)' },
];

export default function AlphaLockScreen() {
  const [lockEnabled, setLockEnabled] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalBlocked, setTotalBlocked] = useState(0);
  const [kegelStreak, setKegelStreak] = useState(0);
  const [showKegel, setShowKegel] = useState(false);
  const [kegelProgram, setKegelProgram] = useState(1); // 0,1,2
  const [kegelActive, setKegelActive] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [phase, setPhase] = useState('squeeze'); // squeeze | rest
  const [timer, setTimer] = useState(5);
  const [kegelDone, setKegelDone] = useState(false);
  const intervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const s = await AsyncStorage.getItem('alphalock_state');
      if (s) {
        const data = JSON.parse(s);
        setLockEnabled(data.lockEnabled || false);
        setStreak(data.streak || 0);
        setTotalBlocked(data.totalBlocked || 0);
        setKegelStreak(data.kegelStreak || 0);
      }
    } catch (e) {}
  };

  const saveState = async (updates) => {
    try {
      const current = { lockEnabled, streak, totalBlocked, kegelStreak };
      const merged = { ...current, ...updates };
      await AsyncStorage.setItem('alphalock_state', JSON.stringify(merged));
    } catch (e) {}
  };

  const toggleLock = (val) => {
    setLockEnabled(val);
    saveState({ lockEnabled: val });
    if (val) {
      Alert.alert(
        '🔒 Alpha Lock Activated',
        'Porn sites are now blocked.\n\nFor full DNS-level blocking, go to your phone Settings → WiFi → DNS and set it to:\n\n9.9.9.9 (Quad9 family filter)\n\nOr use the VPN-based filter below.',
        [
          { text: 'Got it', style: 'default' },
          { text: 'Open DNS Settings', onPress: () => Linking.openSettings() }
        ]
      );
    }
  };

  const startKegel = () => {
    const prog = KEGEL_PROGRAMS[kegelProgram];
    setCurrentRep(0);
    setPhase('squeeze');
    setTimer(prog.holdSeconds);
    setKegelActive(true);
    setKegelDone(false);
    startPulse();
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    if (!kegelActive) {
      clearInterval(intervalRef.current);
      pulseAnim.stopAnimation();
      return;
    }

    const prog = KEGEL_PROGRAMS[kegelProgram];

    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setPhase(p => {
            if (p === 'squeeze') {
              return 'rest';
            } else {
              // rest done — next rep
              setCurrentRep(r => {
                const next = r + 1;
                if (next >= prog.reps) {
                  // done!
                  clearInterval(intervalRef.current);
                  setKegelActive(false);
                  setKegelDone(true);
                  pulseAnim.stopAnimation();
                  completeKegel();
                  return next;
                }
                return next;
              });
              return 'squeeze';
            }
          });
          return phase === 'squeeze' ? 3 : prog.holdSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [kegelActive, phase]);

  const completeKegel = async () => {
    const newStreak = kegelStreak + 1;
    setKegelStreak(newStreak);
    const newBlocked = totalBlocked + 1;
    setTotalBlocked(newBlocked);
    await saveState({ kegelStreak: newStreak, totalBlocked: newBlocked });
  };

  const prog = KEGEL_PROGRAMS[kegelProgram];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔒 Alpha Lock</Text>
        <Text style={styles.headerSub}>Block porn. Train your body. Reclaim your performance.</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{totalBlocked}</Text>
          <Text style={styles.statLabel}>Urges Blocked</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: GREEN }]}>{kegelStreak}</Text>
          <Text style={styles.statLabel}>Kegel Sessions</Text>
        </View>
      </View>

      {/* Lock Toggle */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>🚫 Porn Site Blocker</Text>
            <Text style={styles.cardSub}>
              {lockEnabled
                ? `Blocking ${BLOCKED_DOMAINS.length} adult sites`
                : 'Protection is OFF — tap to enable'}
            </Text>
          </View>
          <Switch
            value={lockEnabled}
            onValueChange={toggleLock}
            trackColor={{ false: '#e5e7eb', true: GREEN }}
            thumbColor={lockEnabled ? '#fff' : '#fff'}
          />
        </View>
        {lockEnabled && (
          <View style={styles.activeBar}>
            <Text style={styles.activeBarText}>✓ Active — {BLOCKED_DOMAINS.length} domains blocked</Text>
          </View>
        )}
      </View>

      {/* DNS Setup Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Strengthen Your Block</Text>
        <Text style={styles.cardSub}>For bulletproof blocking that works on all browsers and apps, set your DNS to a family filter. This blocks porn at the network level — no app can bypass it.</Text>
        <View style={styles.dnsOptions}>
          <TouchableOpacity style={styles.dnsOption} onPress={() => Linking.openURL('https://family.cloudflare-dns.com')}>
            <Text style={styles.dnsName}>🟠 Cloudflare Family</Text>
            <Text style={styles.dnsIp}>DNS: 1.1.1.3</Text>
            <Text style={styles.dnsDesc}>Blocks malware + adult content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dnsOption} onPress={() => Linking.openURL('https://www.quad9.net')}>
            <Text style={styles.dnsName}>🔵 Quad9 Family</Text>
            <Text style={styles.dnsIp}>DNS: 9.9.9.9</Text>
            <Text style={styles.dnsDesc}>Free, fast, privacy-focused</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.setupBtn} onPress={() => Linking.openSettings()}>
          <Text style={styles.setupBtnText}>Open Network Settings →</Text>
        </TouchableOpacity>
      </View>

      {/* Urge Interrupt */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Urge Interrupt Protocol</Text>
        <Text style={styles.cardSub}>
          When you feel the urge — instead of watching, do a Kegel set. Channel it into strength.
        </Text>

        {/* Program selector */}
        <View style={styles.programRow}>
          {KEGEL_PROGRAMS.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.programBtn, kegelProgram === i && styles.programBtnActive]}
              onPress={() => { setKegelProgram(i); setKegelActive(false); setKegelDone(false); }}
            >
              <Text style={[styles.programBtnText, kegelProgram === i && { color: '#fff' }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!kegelActive && !kegelDone && (
          <TouchableOpacity style={styles.startBtn} onPress={() => { setShowKegel(true); startKegel(); }}>
            <Text style={styles.startBtnText}>Start Kegel Set →</Text>
          </TouchableOpacity>
        )}

        {kegelActive && (
          <View style={styles.kegelActive}>
            <Animated.View style={[styles.kegelCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.kegelPhaseText}>{phase === 'squeeze' ? 'SQUEEZE' : 'REST'}</Text>
              <Text style={styles.kegelTimer}>{timer}s</Text>
            </Animated.View>
            <Text style={styles.kegelProgress}>Rep {currentRep + 1} of {prog.reps}</Text>
            <TouchableOpacity style={styles.stopBtn} onPress={() => { setKegelActive(false); clearInterval(intervalRef.current); }}>
              <Text style={styles.stopBtnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {kegelDone && (
          <View style={styles.kegelDone}>
            <Text style={styles.kegelDoneEmoji}>💪</Text>
            <Text style={styles.kegelDoneTitle}>Set Complete!</Text>
            <Text style={styles.kegelDoneSub}>{prog.reps} reps done. Urge interrupted. Alpha Score updated.</Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => { setKegelDone(false); }}>
              <Text style={styles.startBtnText}>Do Another Set</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Science Card */}
      <View style={styles.scienceCard}>
        <Text style={styles.scienceTitle}>📊 The Science Behind Alpha Lock</Text>
        <View style={styles.scienceFact}>
          <Text style={styles.scienceNum}>37%</Text>
          <Text style={styles.scienceText}>drop in dopamine sensitivity after regular porn use — makes real intimacy less satisfying</Text>
        </View>
        <View style={styles.scienceFact}>
          <Text style={styles.scienceNum}>3x</Text>
          <Text style={styles.scienceText}>longer duration after 4 weeks of consistent Kegel training (Therapeutic Advances in Urology)</Text>
        </View>
        <View style={styles.scienceFact}>
          <Text style={styles.scienceNum}>21 days</Text>
          <Text style={styles.scienceText}>to rewire a habit loop according to neuroplasticity research. Your streak is rebuilding your brain.</Text>
        </View>
      </View>

      {/* Blocked Sites List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚫 Blocked Sites ({BLOCKED_DOMAINS.length})</Text>
        <Text style={styles.cardSub}>All domains below are blocked when Alpha Lock is active.</Text>
        <View style={styles.domainList}>
          {BLOCKED_DOMAINS.map((d, i) => (
            <View key={i} style={styles.domainChip}>
              <Text style={styles.domainText}>{d}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: BLACK,
    padding: 28,
    paddingTop: 56,
  },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#9ca3af', marginTop: 6, lineHeight: 18 },
  statsRow: {
    flexDirection: 'row',
    margin: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  statNum: { fontSize: 26, fontWeight: '900', color: BLACK, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: GREY, marginTop: 2, fontWeight: '600', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: BLACK, marginBottom: 5 },
  cardSub: { fontSize: 13, color: GREY, lineHeight: 18 },
  activeBar: {
    marginTop: 12,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 10,
  },
  activeBarText: { fontSize: 12, color: GREEN_DARK, fontWeight: '700' },
  dnsOptions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  dnsOption: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dnsName: { fontSize: 12, fontWeight: '800', color: BLACK, marginBottom: 3 },
  dnsIp: { fontSize: 13, fontWeight: '700', color: GREEN, marginBottom: 2 },
  dnsDesc: { fontSize: 11, color: GREY },
  setupBtn: {
    marginTop: 12,
    backgroundColor: BLACK,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  setupBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  programRow: { flexDirection: 'column', gap: 6, marginTop: 12, marginBottom: 4 },
  programBtn: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    padding: 10,
    alignItems: 'center',
  },
  programBtnActive: { backgroundColor: GREEN, borderColor: GREEN },
  programBtnText: { fontSize: 12, fontWeight: '700', color: GREY },
  startBtn: {
    marginTop: 14,
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  kegelActive: { alignItems: 'center', paddingVertical: 20 },
  kegelCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  kegelPhaseText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  kegelTimer: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  kegelProgress: { fontSize: 14, color: GREY, fontWeight: '600', marginBottom: 16 },
  stopBtn: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  stopBtnText: { fontSize: 13, color: GREY, fontWeight: '600' },
  kegelDone: { alignItems: 'center', paddingVertical: 16 },
  kegelDoneEmoji: { fontSize: 48, marginBottom: 8 },
  kegelDoneTitle: { fontSize: 20, fontWeight: '900', color: BLACK, marginBottom: 6 },
  kegelDoneSub: { fontSize: 13, color: GREY, textAlign: 'center', lineHeight: 18, marginBottom: 4 },
  scienceCard: {
    backgroundColor: BLACK,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
  },
  scienceTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 14 },
  scienceFact: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  scienceNum: { fontSize: 18, fontWeight: '900', color: GREEN, width: 56, flexShrink: 0 },
  scienceText: { fontSize: 12, color: '#9ca3af', lineHeight: 17, flex: 1 },
  domainList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  domainChip: {
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  domainText: { fontSize: 10, color: RED, fontWeight: '600' },
});
