// components/RecipeDisplayList.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RecipeDisplayItem from './RecipeDisplayItem';
import { RecipeData } from '../utils/types';

type Props = {
  data: RecipeData[];
  style?: ViewStyle;
  initialQuery?: string;
};

type SortOrder = 'newest' | 'oldest';
type FilterField = 'category' | 'ingredient' | 'area' | 'tag';

type ActiveFilter = {
  id: string;
  field: FilterField;
  value: string;
};

const parseDateSafe = (d?: string) => {
  if (!d) return 0;
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
};

const includesCI = (hay: string | undefined | null, needle: string) => {
  if (!needle) return true;
  if (!hay) return false;
  return hay.toLowerCase().includes(needle.toLowerCase());
};

export default function RecipeDisplayList({ data, style, initialQuery = '' }: Props) {
  // search + sort
  const [query, setQuery] = useState(initialQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // filters
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedField, setSelectedField] = useState<FilterField>('category');
  const [filterValue, setFilterValue] = useState('');

  const addFilter = () => {
    const trimmed = filterValue.trim();
    if (!trimmed) return;

    const exists = filters.some(
      (f) => f.field === selectedField && f.value.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setFilterValue('');
      setShowBuilder(false);
      return;
    }

    setFilters((prev) => [
      ...prev,
      { id: `${selectedField}:${trimmed}:${Date.now()}`, field: selectedField, value: trimmed },
    ]);
    setFilterValue('');
    setShowBuilder(false);
  };

  const removeFilter = (id: string) => setFilters((prev) => prev.filter((f) => f.id !== id));

  const clearAll = () => {
    setQuery('');
    setSortOrder('newest');
    setFilters([]);
    setShowBuilder(false);
    setSelectedField('category');
    setFilterValue('');
  };

  const filteredSorted = useMemo(() => {
    const filtered = data.filter((r) => {
      if (!includesCI(r.title, query)) return false;

      for (const f of filters) {
        if (f.field === 'category') {
          if (!includesCI(r.category, f.value)) return false;
        } else if (f.field === 'area') {
          if (!includesCI(r.area, f.value)) return false;
        } else if (f.field === 'ingredient') {
          const ok = (r.ingredients ?? []).some((it) => includesCI(it.ingredient, f.value));
          if (!ok) return false;
        } else if (f.field === 'tag') {
          const ok = (r.tags ?? []).some((t) => includesCI(t, f.value));
          if (!ok) return false;
        }
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const ta = parseDateSafe(a.dateModified);
      const tb = parseDateSafe(b.dateModified);
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });

    return sorted;
  }, [data, query, filters, sortOrder]);

  return (
    <View style={[styles.container, style]}>
      {/* Search */}
      <TextInput
        style={styles.input}
        placeholder="Search by title..."
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Sort + Clear + Add Filter */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>

        <Pressable
          onPress={() => setSortOrder('newest')}
          style={[styles.pill, sortOrder === 'newest' && styles.pillActive]}
        >
          <Text style={[styles.pillText, sortOrder === 'newest' && styles.pillTextActive]}>
            Newest
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSortOrder('oldest')}
          style={[styles.pill, sortOrder === 'oldest' && styles.pillActive]}
        >
          <Text style={[styles.pillText, sortOrder === 'oldest' && styles.pillTextActive]}>
            Oldest
          </Text>
        </Pressable>
      </View>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Filter:</Text>

        {filters.length > 0 && (
          <Pressable onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear Filter</Text>
          </Pressable>
        )}

        <Pressable onPress={() => setShowBuilder(true)} style={styles.addFilterBtn}>
          <Text style={styles.addFilterText}>+ Add Filter</Text>
        </Pressable>
      </View>

      {/* Active filters (always visible) */}
      {filters.length > 0 && (
        <View style={styles.chipsWrap}>
          {filters.map((f) => (
            <View key={f.id} style={styles.chip}>
              <Text style={styles.chipText}>
                {f.field}={f.value}
              </Text>
              <Pressable onPress={() => removeFilter(f.id)} style={styles.chipX}>
                <Text style={styles.chipXText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Filter Builder (only when adding) */}
      {showBuilder && (
        <View style={styles.builderCard}>
          <Text style={styles.builderTitle}>Add a filter</Text>

          {/* iOS needs tall wheel; Android can be compact */}
          <View
            style={[
              styles.pickerWrap,
              Platform.OS === 'ios' ? styles.pickerWrapIOS : styles.pickerWrapAndroid,
            ]}
          >
            <Picker
              selectedValue={selectedField}
              onValueChange={(v) => setSelectedField(v as FilterField)}
              style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
            >
              <Picker.Item label="Category" value="category" />
              <Picker.Item label="Ingredient" value="ingredient" />
              <Picker.Item label="Area" value="area" />
              <Picker.Item label="Tag" value="tag" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder={`Enter ${selectedField}…`}
            value={filterValue}
            onChangeText={setFilterValue}
            autoCorrect={false}
            autoCapitalize="none"
          />

          <View style={styles.builderActions}>
            <Pressable
              onPress={() => {
                setShowBuilder(false);
                setFilterValue('');
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={addFilter} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeDisplayItem recipe={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No recipes match your filters.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },

  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sortLabel: { fontSize: 14, color: '#444', marginRight: 4 },
  pill: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  pillActive: { borderColor: '#1e90ff', backgroundColor: '#e9f3ff' },
  pillText: { fontSize: 13, color: '#333' },
  pillTextActive: { color: '#1e90ff', fontWeight: '700' },

  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
  },
  clearText: { fontSize: 13, color: '#666' },

  addFilterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e90ff',
  },
  addFilterText: { color: '#fff', fontWeight: '700' },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f0f4ff',
    borderWidth: 1,
    borderColor: '#cfe0ff',
  },
  chipText: { color: '#275ea6', fontSize: 13, fontWeight: '600' },
  chipX: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#275ea6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipXText: { color: '#fff', fontSize: 12, lineHeight: 12, fontWeight: '700' },

  // Builder card (only visible when adding a filter)
  builderCard: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  builderTitle: { fontWeight: '700', marginBottom: 8 },

  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  pickerWrapAndroid: { height: 40, overflow: 'hidden' },
  pickerAndroid: { height: 40 },
  pickerWrapIOS: { height: 216, overflow: 'visible' },
  pickerIOS: { height: 216 },

  builderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },
  cancelText: { color: '#444', fontWeight: '600' },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },

  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#666' },
});
