import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const GREEN = '#22c55e';

const QUESTIONS = [
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'We use this to build your personalised protocol',
    options: [
      { label: '18 – 24', value: '18-24', emoji: '🔥' },
      { label: '25 – 34', value: '25-34', emoji: '💪' },
      { label: '35 – 44', value: '35-44', emoji: '⚡' },
      { label: '45+', value: '45+', emoji: '👑' },
    ],
  },
  {
    id: 'goal',
    title: 'What is your main goal?',
    subtitle: 'Pick your top priority',
    options: [
      { label: 'Last longer in bed', value: 'duration', emoji: '⏱️' },
      { label: 'Harder, stronger erections', value: 'erection', emoji: '💥' },
      { label: 'Higher sex drive', value: 'libido', emoji: '🔥' },
      { label: 'Better stamina & energy', value: 'stamina', emoji: '⚡' },
      { label: 'Fertility & sperm health', value: 'fertility', emoji: '🌱' },
    ],
  },
  {
    id: 'struggle',
    title: 'What is your biggest struggle?',
    subtitle: 'Be honest — this stays private',
    options: [
      { label: 'Finishing too fast', value: 'fast', emoji: '😓' },
      { label: 'Difficulty staying hard', value: 'hard', emoji: '😔' },
      { label: 'Low desire or low libido', value: 'libido', emoji: '😶' },
      { label: 'Low energy in general', value: 'energy', emoji: '😴' },
      { label: 'Performance anxiety', value: 'anxiety', emoji: '😰' },
    ],
  },
  {
    id: 'exercise',
    title: 'How often do you exercise?',
    subtitle: 'This affects your stamina and testosterone baseline',
    options: [
      { label: 'Rarely or never', value: 'never', emoji: '🛋️' },
      { label: '1-2 times a week', value: 'light', emoji: '🚶' },
      { label: '3-4 times a week', value: 'moderate', emoji: '🏃' },
      { label: 'Daily or more', value: 'heavy', emoji: '🏋️' },
    ],
  },
];

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(-1); // -1 = splash
  const [answers, setAnswers] = useState({});
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeTransition = (cb) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleSelect = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    fadeTransition(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setStep(QUESTIONS.length); // results
      }
    });
  };

  const getAlphaProfile = () => {
    const age = answers.age;
    const planName = age === '18-24' ? 'Plan A' : age === '25-34' || age === '35-44' ? 'Plan B' : 'Plan C';
    const bloodFlow = answers.goal === 'erection' ? 38 : 52;
    const testosterone = age === '45+' ? 34 : age === '35-44' ? 48 : 62;
    const stamina = answers.exercise === 'heavy' ? 70 : answers.exercise === 'moderate' ? 55 : 35;
    return { planName, bloodFlow, testosterone, stamina };
  };

  const handleStart = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    await AsyncStorage.setItem('user_profile', JSON.stringify(answers));
    navigation.replace('Main');
  };

  // SPLASH
  if (step === -1) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashContent}>
          <Text style={styles.splashLogo}>Alpha<Text style={{ color: GREEN }}>Boost</Text></Text>
          <Text style={styles.splashTagline}>Peak Performance.{'\n'}No Prescriptions.{'\n'}<Text style={{ color: GREEN }}>No Side Effects.</Text></Text>
          <Text style={styles.splashSub}>The world's first men's sexual health app powered by food intelligence.</Text>
          <TouchableOpacity style={styles.splashBtn} onPress={() => fadeTransition(() => setStep(0))}>
            <Text style={styles.splashBtnText}>Build My Plan →</Text>
          </TouchableOpacity>
          <Text style={styles.splashNote}>7 days free · No credit card required</Text>
        </View>
      </View>
    );
  }

  // RESULTS
  if (step === QUESTIONS.length) {
    const profile = getAlphaProfile();
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.resultsScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsTitle}>Your Alpha Profile</Text>
          <Text style={styles.resultsSub}>Based on your answers, here is your starting point.</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardLabel}>ALPHA SCORE BASELINE</Text>
            <Text style={styles.scoreCardNum}>41</Text>
            <Text style={styles.scoreCardNote}>Your body can reach 90+ in 30 days.</Text>
          </View>

          <View style={styles.metricsCard}>
            {[
              { label: 'Blood Flow', value: profile.bloodFlow, max: 100 },
              { label: 'Testosterone', value: profile.testosterone, max: 100 },
              { label: 'Stamina', value: profile.stamina, max: 100 },
            ].map((m) => (
              <View key={m.label} style={styles.metricRow}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <View style={styles.metricBarWrap}>
                  <View style={[styles.metricBar, { width: `${m.value}%` }]} />
                </View>
                <Text style={styles.metricVal}>{m.value}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.planBadge}>
            <Text style={styles.planBadgeLabel}>YOUR PROTOCOL</Text>
            <Text style={styles.planBadgeText}>{profile.planName} — 30-Day Alpha Reset</Text>
          </View>

          <View style={styles.whatYouGet}>
            <Text style={styles.whatTitle}>Your plan includes:</Text>
            {['Personalised daily food recommendations', 'Food intelligence scanner for every meal', 'Guided Kegel trainer program', 'Game Day Mode for tonight', 'Private performance log', 'Brotherhood community access'].map((item) => (
              <View key={item} style={styles.whatItem}>
                <Text style={styles.whatCheck}>✓</Text>
                <Text style={styles.whatText}>{item}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start My Free Trial →</Text>
          </TouchableOpacity>
          <Text style={styles.trialNote}>7 days free. No charge today. Cancel anytime.</Text>
        </ScrollView>
      </Animated.View>
    );
  }

  // QUESTIONS
  const q = QUESTIONS[step];
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / QUESTIONS.length) * 100}%` }]} />
      </View>
      <Text style={styles.stepCount}>{step + 1} of {QUESTIONS.length}</Text>
      <Text style={styles.questionTitle}>{q.title}</Text>
      <Text style={styles.questionSub}>{q.subtitle}</Text>
      <View style={styles.optionsContainer}>
        {q.options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionBtn, answers[q.id] === opt.value && styles.optionBtnSelected]}
            onPress={() => handleSelect(q.id, opt.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionEmoji}>{opt.emoji}</Text>
            <Text style={[styles.optionLabel, answers[q.id] === opt.value && styles.optionLabelSelected]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 28 },
  splashContent: { alignItems: 'center' },
  splashLogo: { fontSize: 36, fontWeight: '900', color: '#0a0a0a', letterSpacing: -1, marginBottom: 32 },
  splashTagline: { fontSize: 34, fontWeight: '900', color: '#0a0a0a', textAlign: 'center', letterSpacing: -1, lineHeight: 40, marginBottom: 16 },
  splashSub: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 40, maxWidth: 300 },
  splashBtn: { backgroundColor: GREEN, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14, marginBottom: 16, width: '100%' },
  splashBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  splashNote: { fontSize: 12, color: '#9ca3af' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  progressBar: { height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 2 },
  stepCount: { fontSize: 12, color: '#9ca3af', fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  questionTitle: { fontSize: 28, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5, marginBottom: 8 },
  questionSub: { fontSize: 15, color: '#6b7280', marginBottom: 32, lineHeight: 22 },
  optionsContainer: { gap: 12 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 14, borderWidth: 1.5, borderColor: '#e5e7eb', backgroundColor: '#fff', gap: 14 },
  optionBtnSelected: { borderColor: GREEN, backgroundColor: '#f0fdf4' },
  optionEmoji: { fontSize: 22 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  optionLabelSelected: { color: '#16a34a' },
  resultsScroll: { padding: 24, paddingTop: 60 },
  resultsTitle: { fontSize: 30, fontWeight: '900', color: '#0a0a0a', letterSpacing: -1, marginBottom: 8 },
  resultsSub: { fontSize: 15, color: '#6b7280', marginBottom: 28, lineHeight: 22 },
  scoreCard: { backgroundColor: '#0a0a0a', borderRadius: 18, padding: 28, alignItems: 'center', marginBottom: 16 },
  scoreCardLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  scoreCardNum: { fontSize: 72, fontWeight: '900', color: GREEN, letterSpacing: -2, lineHeight: 80 },
  scoreCardNote: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  metricsCard: { backgroundColor: '#f9f9f9', borderRadius: 16, padding: 20, marginBottom: 16, gap: 14 },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metricLabel: { fontSize: 13, color: '#374151', fontWeight: '500', width: 110 },
  metricBarWrap: { flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  metricBar: { height: '100%', backgroundColor: GREEN, borderRadius: 4 },
  metricVal: { fontSize: 12, fontWeight: '700', color: '#374151', width: 36, textAlign: 'right' },
  planBadge: { backgroundColor: '#f0fdf4', borderWidth: 1.5, borderColor: '#bbf7d0', borderRadius: 14, padding: 16, marginBottom: 20 },
  planBadgeLabel: { fontSize: 11, color: '#16a34a', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  planBadgeText: { fontSize: 16, fontWeight: '700', color: '#14532d' },
  whatYouGet: { marginBottom: 28 },
  whatTitle: { fontSize: 16, fontWeight: '700', color: '#0a0a0a', marginBottom: 14 },
  whatItem: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  whatCheck: { color: GREEN, fontWeight: '800', fontSize: 14, marginTop: 1 },
  whatText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  startBtn: { backgroundColor: GREEN, padding: 18, borderRadius: 14, marginBottom: 12 },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  trialNote: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
});
