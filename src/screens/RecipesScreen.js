import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SMOOTHIE_RECIPES } from '../data/foods';

const GREEN = '#22c55e';

const GOALS = ['All', 'Blood Flow', 'Testosterone', 'Stamina', 'Libido & Mood', 'Overall Performance'];

export default function RecipesScreen() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'All' ? SMOOTHIE_RECIPES : SMOOTHIE_RECIPES.filter(r => r.goal === filter);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Smoothie Arsenal</Text>
          <Text style={styles.headerSub}>15 performance-boosting recipes. Pick 3 and rotate.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {GOALS.map(g => (
            <TouchableOpacity key={g} style={[styles.filterChip, filter === g && styles.filterChipActive]} onPress={() => setFilter(g)}>
              <Text style={[styles.filterChipText, filter === g && styles.filterChipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((r) => (
            <TouchableOpacity key={r.id} style={styles.recipeCard} onPress={() => setSelected(r)} activeOpacity={0.85}>
              <View style={[styles.recipeColorBar, { backgroundColor: r.color }]} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeEmoji}>{r.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recipeName}>{r.name}</Text>
                  <Text style={styles.recipeGoal}>{r.goal}</Text>
                </View>
                <View style={styles.recipeScoreBadge}>
                  <Text style={styles.recipeScore}>{r.score}</Text>
                </View>
              </View>
              <View style={styles.recipeMeta}>
                <Text style={styles.recipeTime}>⏱ {r.time}</Text>
                <Text style={styles.recipeTiming}>{r.timing.split(' or ')[0]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.modalHero, { backgroundColor: selected.color + '22' }]}>
                <Text style={styles.modalEmoji}>{selected.emoji}</Text>
                <Text style={styles.modalName}>{selected.name}</Text>
                <View style={styles.modalBadgeRow}>
                  <View style={[styles.modalBadge, { backgroundColor: selected.color + '33', borderColor: selected.color }]}>
                    <Text style={[styles.modalBadgeText, { color: selected.color }]}>{selected.goal}</Text>
                  </View>
                  <View style={styles.modalScoreBadge}>
                    <Text style={styles.modalScoreText}>{selected.score}/100</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {selected.ingredients.map((ing, i) => (
                  <View key={i} style={styles.ingredientRow}>
                    <Text style={styles.ingredientBullet}>•</Text>
                    <Text style={styles.ingredientText}>{ing}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Why It Works</Text>
                <Text style={styles.whyText}>{selected.why}</Text>
              </View>

              <View style={styles.metaSection}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⏱</Text>
                  <Text style={styles.metaLabel}>Prep Time</Text>
                  <Text style={styles.metaValue}>{selected.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>🕐</Text>
                  <Text style={styles.metaLabel}>Best Timing</Text>
                  <Text style={styles.metaValue}>{selected.timing}</Text>
                </View>
              </View>

              <View style={styles.howTo}>
                <Text style={styles.sectionTitle}>How to Make It</Text>
                <Text style={styles.howToText}>1. Add all ingredients to a blender{'\n'}2. Blend on high for 60 seconds{'\n'}3. Drink immediately — do not store{'\n'}4. Include seeds if the recipe calls for them</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Text style={styles.closeBtnText}>Close</Text>
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
  filterRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb' },
  filterChipActive: { backgroundColor: GREEN, borderColor: GREEN },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  filterChipTextActive: { color: '#fff' },
  grid: { padding: 16, gap: 12 },
  recipeCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1.5, borderColor: '#e5e7eb' },
  recipeColorBar: { height: 4 },
  recipeContent: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  recipeEmoji: { fontSize: 32 },
  recipeName: { fontSize: 15, fontWeight: '800', color: '#0a0a0a', marginBottom: 3 },
  recipeGoal: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  recipeScoreBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#bbf7d0' },
  recipeScore: { fontSize: 16, fontWeight: '900', color: GREEN },
  recipeMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14 },
  recipeTime: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  recipeTiming: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  modal: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 12 },
  modalHandle: { width: 36, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHero: { borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 20 },
  modalEmoji: { fontSize: 52, marginBottom: 10 },
  modalName: { fontSize: 22, fontWeight: '900', color: '#0a0a0a', textAlign: 'center', letterSpacing: -0.3, marginBottom: 12 },
  modalBadgeRow: { flexDirection: 'row', gap: 10 },
  modalBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1.5 },
  modalBadgeText: { fontSize: 12, fontWeight: '700' },
  modalScoreBadge: { backgroundColor: '#f0fdf4', borderWidth: 1.5, borderColor: '#bbf7d0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  modalScoreText: { fontSize: 12, fontWeight: '700', color: GREEN },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0a0a0a', marginBottom: 12 },
  ingredientRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  ingredientBullet: { color: GREEN, fontWeight: '900', fontSize: 16 },
  ingredientText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
  whyText: { fontSize: 14, color: '#374151', lineHeight: 21 },
  metaSection: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metaItem: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: '#e5e7eb' },
  metaIcon: { fontSize: 20, marginBottom: 6 },
  metaLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  metaValue: { fontSize: 13, fontWeight: '700', color: '#374151' },
  howTo: { marginBottom: 24 },
  howToText: { fontSize: 14, color: '#374151', lineHeight: 22 },
  closeBtn: { backgroundColor: '#0a0a0a', padding: 16, borderRadius: 14, marginBottom: 20 },
  closeBtnText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 15 },
});
