import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

const GREEN = '#22c55e';

const MOCK_LOGS = [
  { date: 'Today', duration: 14, erection: 4, confidence: 4, energy: 3 },
  { date: 'May 2', duration: 11, erection: 3, confidence: 3, energy: 4 },
  { date: 'Apr 30', duration: 9, erection: 3, confidence: 3, energy: 3 },
  { date: 'Apr 28', duration: 7, erection: 2, confidence: 2, energy: 2 },
  { date: 'Apr 25', duration: 5, erection: 2, confidence: 2, energy: 3 },
];

const RatingButtons = ({ value, onChange, max = 5 }) => (
  <View style={styles.ratingRow}>
    {Array.from({ length: max }, (_, i) => i + 1).map(i => (
      <TouchableOpacity key={i} style={[styles.ratingBtn, value >= i && styles.ratingBtnActive]} onPress={() => onChange(i)}>
        <Text style={[styles.ratingBtnText, value >= i && styles.ratingBtnTextActive]}>{i}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function PerformanceLogScreen() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showAdd, setShowAdd] = useState(false);
  const [duration, setDuration] = useState(10);
  const [erection, setErection] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [energy, setEnergy] = useState(3);

  const avgDuration = (logs.reduce((a, l) => a + l.duration, 0) / logs.length).toFixed(1);
  const firstDuration = logs[logs.length - 1].duration;
  const improvement = Math.round(((logs[0].duration - firstDuration) / firstDuration) * 100);

  const addLog = () => {
    setLogs([{ date: 'Just now', duration, erection, confidence, energy }, ...logs]);
    setShowAdd(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Performance Log</Text>
          <Text style={styles.headerSub}>Private and encrypted. Only you see this.</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{improvement}%</Text>
            <Text style={styles.statLabel}>Improvement</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{avgDuration}m</Text>
            <Text style={styles.statLabel}>Avg Duration</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{logs.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        <View style={styles.trendCard}>
          <Text style={styles.sectionTitle}>Duration Trend</Text>
          <View style={styles.chart}>
            {[...logs].reverse().map((log, i) => {
              const maxDur = Math.max(...logs.map(l => l.duration));
              const barHeight = (log.duration / maxDur) * 80;
              return (
                <View key={i} style={styles.chartBar}>
                  <Text style={styles.chartBarValue}>{log.duration}m</Text>
                  <View style={[styles.bar, { height: barHeight, backgroundColor: i === logs.length - 1 ? GREEN : '#bbf7d0' }]} />
                  <Text style={styles.chartBarDate}>{log.date.slice(0, 6)}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.trendNote}>
            {improvement > 0 ? `✓ Your duration has increased ${improvement}% since you started.` : 'Keep logging — your trend will appear here.'}
          </Text>
        </View>

        <View style={styles.logsSection}>
          <Text style={styles.sectionTitle}>Session History</Text>
          {logs.map((log, i) => (
            <View key={i} style={styles.logCard}>
              <View style={styles.logLeft}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logDuration}>{log.duration} min</Text>
              </View>
              <View style={styles.logMetrics}>
                <View style={styles.logMetric}>
                  <Text style={styles.logMetricLabel}>Erection</Text>
                  <View style={styles.logDots}>
                    {[1,2,3,4,5].map(d => <View key={d} style={[styles.dot, d <= log.erection && styles.dotActive]} />)}
                  </View>
                </View>
                <View style={styles.logMetric}>
                  <Text style={styles.logMetricLabel}>Confidence</Text>
                  <View style={styles.logDots}>
                    {[1,2,3,4,5].map(d => <View key={d} style={[styles.dot, d <= log.confidence && styles.dotActive]} />)}
                  </View>
                </View>
                <View style={styles.logMetric}>
                  <Text style={styles.logMetricLabel}>Energy</Text>
                  <View style={styles.logDots}>
                    {[1,2,3,4,5].map(d => <View key={d} style={[styles.dot, d <= log.energy && styles.dotActive]} />)}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Text style={styles.fabText}>+ Log Session</Text>
      </TouchableOpacity>

      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Log Session</Text>
          <Text style={styles.modalSub}>Honest data = better insights. This stays private.</Text>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Duration (minutes)</Text>
            <View style={styles.durationRow}>
              <TouchableOpacity style={styles.durationBtn} onPress={() => setDuration(Math.max(1, duration - 1))}>
                <Text style={styles.durationBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.durationValue}>{duration}</Text>
              <TouchableOpacity style={styles.durationBtn} onPress={() => setDuration(duration + 1)}>
                <Text style={styles.durationBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Erection Quality (1-5)</Text>
            <RatingButtons value={erection} onChange={setErection} />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Confidence Level (1-5)</Text>
            <RatingButtons value={confidence} onChange={setConfidence} />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Energy Level (1-5)</Text>
            <RatingButtons value={energy} onChange={setEnergy} />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={addLog}>
            <Text style={styles.saveBtnText}>Save Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0a0a0a', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  statsRow: { flexDirection: 'row', margin: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb' },
  statNum: { fontSize: 24, fontWeight: '900', color: GREEN, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginTop: 3 },
  trendCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1.5, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0a0a0a', marginBottom: 16 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 110, marginBottom: 14 },
  chartBar: { alignItems: 'center', gap: 4 },
  chartBarValue: { fontSize: 10, fontWeight: '700', color: '#374151' },
  bar: { width: 32, borderRadius: 6 },
  chartBarDate: { fontSize: 9, color: '#9ca3af', fontWeight: '500' },
  trendNote: { fontSize: 13, color: '#166534', fontWeight: '500', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10 },
  logsSection: { marginHorizontal: 16 },
  logCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: '#e5e7eb', flexDirection: 'row', gap: 14 },
  logLeft: { alignItems: 'center', minWidth: 60 },
  logDate: { fontSize: 11, color: '#9ca3af', fontWeight: '600', marginBottom: 4 },
  logDuration: { fontSize: 20, fontWeight: '900', color: GREEN, letterSpacing: -0.5 },
  logMetrics: { flex: 1, gap: 8 },
  logMetric: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logMetricLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500', width: 80 },
  logDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e5e7eb' },
  dotActive: { backgroundColor: GREEN },
  fab: { position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: '#0a0a0a', padding: 17, borderRadius: 14 },
  fabText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 15 },
  modal: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 12 },
  modalHandle: { width: 36, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#0a0a0a', marginBottom: 6 },
  modalSub: { fontSize: 14, color: '#6b7280', marginBottom: 28, lineHeight: 20 },
  formSection: { marginBottom: 24 },
  formLabel: { fontSize: 15, fontWeight: '700', color: '#0a0a0a', marginBottom: 12 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  durationBtn: { width: 48, height: 48, backgroundColor: '#f9f9f9', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb' },
  durationBtnText: { fontSize: 22, color: '#374151', fontWeight: '600' },
  durationValue: { fontSize: 36, fontWeight: '900', color: '#0a0a0a', letterSpacing: -1, minWidth: 60, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f9f9f9', borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center' },
  ratingBtnActive: { backgroundColor: '#f0fdf4', borderColor: GREEN },
  ratingBtnText: { fontSize: 15, fontWeight: '700', color: '#9ca3af' },
  ratingBtnTextActive: { color: GREEN },
  saveBtn: { backgroundColor: '#0a0a0a', padding: 17, borderRadius: 14, marginBottom: 10 },
  saveBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 15 },
  cancelBtn: { padding: 14, borderRadius: 12 },
  cancelBtnText: { color: '#9ca3af', fontWeight: '600', textAlign: 'center' },
});
