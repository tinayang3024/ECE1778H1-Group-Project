import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { RecipeData } from '../utils/types';
import { mealToRecipeData, mealFromFilterToRecipeData } from '../utils/mealMapper';
import RecipeDisplayList from './RecipeDisplayList';

type Props = {
  data?: RecipeData[]; // optional
  style?: ViewStyle;
  initialQuery?: string;
};

type SortOrder = 'newest' | 'oldest';
type FilterField = 'category' | 'ingredient' | 'area';

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

// mapping helpers moved to utils/mealMapper.ts

export default function RecipeDisplayWrapper({ data, style, initialQuery = '' }: Props) {
  const isPersonalCollectionPage = typeof data !== 'undefined'; // 👈 key flag

  // base data to show
  const [baseData, setBaseData] = useState<RecipeData[]>(data ?? []);
  const [loadingRandom, setLoadingRandom] = useState<boolean>(!isPersonalCollectionPage);

  // search, sort, filters
  const [query, setQuery] = useState(initialQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedField, setSelectedField] = useState<FilterField>('category');
  const [filterValue, setFilterValue] = useState('');

  // remote title search (ONLY when no external data)
  const [remoteRecipes, setRemoteRecipes] = useState<RecipeData[] | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // filter API result (ONLY when no external data)
  const [filterRecipes, setFilterRecipes] = useState<RecipeData[] | null>(null);
  const [loadingFilterFetch, setLoadingFilterFetch] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  // filter option lists
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [areaOptions, setAreaOptions] = useState<string[]>([]);
  const [ingredientOptions, setIngredientOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // sync external data later
  useEffect(() => {
    if (isPersonalCollectionPage) {
      setBaseData(data ?? []);
      setLoadingRandom(false);
    }
  }, [isPersonalCollectionPage, data]);

  // ----------------------------------------------------
  // If NO external data → fetch 20 random on mount
  // ----------------------------------------------------
  const fetchRandomMeals = useCallback(
    async (count: number, cancelledRef?: { current: boolean }) => {
      const RANDOM_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
      for (let i = 0; i < count; i++) {
        (async () => {
          try {
            const res = await fetch(RANDOM_URL);
            const json = await res.json();
            const meal = json?.meals?.[0];
            if (meal && !(cancelledRef?.current ?? false)) {
              const mapped = mealToRecipeData(meal);
              setBaseData((prev) => {
                if (prev.some((p) => p.id === mapped.id)) return prev;
                return [...prev, mapped];
              });
            }
          } catch (err) {
            console.log('random meal fetch failed', err);
          } finally {
            if (!(cancelledRef?.current ?? false)) {
              setLoadingRandom(false);
            }
          }
        })();
      }
    },
    [],
  );

  useEffect(() => {
    if (isPersonalCollectionPage) return; // 👈 DO NOT call random API
    const cancelled = { current: false };
    fetchRandomMeals(20, cancelled);
    return () => {
      cancelled.current = true;
    };
  }, [isPersonalCollectionPage, fetchRandomMeals]);

  // ----------------------------------------------------
  // Filter option lists
  // If we have external data, derive options from it.
  // If we don't, fetch from API.
  // ----------------------------------------------------
  useEffect(() => {
    // case 1: local-only mode (data provided)
    if (isPersonalCollectionPage) {
      const cats = new Set<string>();
      const areas = new Set<string>();
      const ings = new Set<string>();

      (data ?? []).forEach((r) => {
        if (r.category) cats.add(r.category);
        if (r.area) areas.add(r.area);
        (r.ingredients ?? []).forEach((it) => {
          if (it.ingredient) ings.add(it.ingredient);
        });
      });

      setCategoryOptions(Array.from(cats));
      setAreaOptions(Array.from(areas));
      setIngredientOptions(Array.from(ings));
      setLoadingOptions(false);
      return;
    }

    // case 2: online mode
    let cancelled = false;
    const fetchLists = async () => {
      try {
        setLoadingOptions(true);
        const [catRes, areaRes, ingRes] = await Promise.all([
          fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list'),
          fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list'),
          fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list'),
        ]);

        const catJson = await catRes.json();
        const areaJson = await areaRes.json();
        const ingJson = await ingRes.json();

        if (!cancelled) {
          const cats = Array.isArray(catJson.meals)
            ? catJson.meals.map((m: any) => m.strCategory)
            : [];
          const areas = Array.isArray(areaJson.meals)
            ? areaJson.meals.map((m: any) => m.strArea)
            : [];
          const ings = Array.isArray(ingJson.meals)
            ? ingJson.meals.map((m: any) => m.strIngredient)
            : [];

          setCategoryOptions(cats.filter(Boolean));
          setAreaOptions(areas.filter(Boolean));
          setIngredientOptions(ings.filter(Boolean));
        }
      } catch (e) {
        console.log('failed to fetch filter lists', e);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };

    fetchLists();
    return () => {
      cancelled = true;
    };
  }, [isPersonalCollectionPage, data]);

  // ----------------------------------------------------
  // Title search (ONLY when no external data)
  // ----------------------------------------------------
  useEffect(() => {
    if (isPersonalCollectionPage) {
      // in local mode, query just filters locally; no API
      return;
    }

    const hasFilter = filters.length > 0;
    if (hasFilter) return;

    if (!query.trim()) {
      setRemoteRecipes(null);
      setRemoteError(null);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingRemote(true);
        setRemoteError(null);
        const searchTerm = encodeURIComponent(query.trim());
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.meals) {
          setRemoteRecipes([]);
        } else {
          setRemoteRecipes(json.meals.map(mealToRecipeData));
        }
      } catch (err: any) {
        console.log('mealdb search error:', err);
        setRemoteError('Failed to fetch recipes.');
        setRemoteRecipes([]);
      } finally {
        setLoadingRemote(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, filters.length, isPersonalCollectionPage]);

  // ----------------------------------------------------
  // Local filtering / sorting
  // ----------------------------------------------------
  const localFilteredSorted = useMemo(() => {
    const filtered = baseData.filter((r) => {
      if (!includesCI(r.title, query)) return false;
      for (const f of filters) {
        if (f.field === 'category' && !includesCI(r.category, f.value)) return false;
        if (f.field === 'area' && !includesCI(r.area, f.value)) return false;
        if (
          f.field === 'ingredient' &&
          !(r.ingredients ?? []).some((it) => includesCI(it.ingredient, f.value))
        ) {
          return false;
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
  }, [baseData, query, filters, sortOrder]);

  // ----------------------------------------------------
  // Filter fetch (ONLY WHEN no external data)
  // ----------------------------------------------------
  const fetchFilteredMeals = async (field: FilterField, value: string) => {
    if (isPersonalCollectionPage) {
      // local-only mode: do NOT call remote filter API
      return;
    }

    const base = 'https://www.themealdb.com/api/json/v1/1/filter.php';
    let url = base;
    const encoded = encodeURIComponent(value.trim());

    if (field === 'ingredient') {
      url = `${base}?i=${encoded}`;
    } else if (field === 'category') {
      url = `${base}?c=${encoded}`;
    } else if (field === 'area') {
      url = `${base}?a=${encoded}`;
    }

    try {
      setLoadingFilterFetch(true);
      setFilterError(null);

      const res = await fetch(url);
      const json = await res.json();

      if (!json.meals) {
        setFilterRecipes([]);
      } else {
        setFilterRecipes(json.meals.map(mealFromFilterToRecipeData));
      }
    } catch (err: any) {
      console.log('filter fetch error:', err);
      setFilterError('Failed to fetch filtered recipes.');
      setFilterRecipes([]);
    } finally {
      setLoadingFilterFetch(false);
    }
  };

  // ----------------------------------------------------
  // Add filter (single)
  // ----------------------------------------------------
  const addFilter = async () => {
    const trimmed = filterValue ? filterValue.trim() : (categoryOptions[0] ?? '');
    if (!trimmed) return;
    if (filters.length >= 1) return;

    const newFilter: ActiveFilter = {
      id: `${selectedField}:${trimmed}:${Date.now()}`,
      field: selectedField,
      value: trimmed,
    };

    setFilters([newFilter]);
    setShowBuilder(false);
    setRemoteRecipes(null);
    setRemoteError(null);

    if (!isPersonalCollectionPage) {
      // online mode → fetch from API
      await fetchFilteredMeals(selectedField, trimmed);
    }
    // local mode → nothing else, localFilteredSorted will handle it
  };

  const removeFilter = (id: string) => {
    setFilters([]);
    setFilterRecipes(null);
    setFilterError(null);
  };

  const clearAll = () => {
    setQuery('');
    setSortOrder('newest');
    setFilters([]);
    setShowBuilder(false);
    setSelectedField('category');
    setFilterValue(currentOptions[0] ?? '');
    setRemoteRecipes(null);
    setRemoteError(null);
    setFilterRecipes(null);
    setFilterError(null);
  };

  const hasFilter = filters.length > 0;

  const currentOptions =
    selectedField === 'category'
      ? categoryOptions
      : selectedField === 'area'
        ? areaOptions
        : ingredientOptions;

  useEffect(() => {
    setFilterValue(
      selectedField === 'ingredient'
        ? ingredientOptions
          ? ingredientOptions[0]
          : ''
        : selectedField === 'area'
          ? areaOptions
            ? areaOptions[0]
            : ''
          : categoryOptions
            ? categoryOptions[0]
            : '',
    );
  }, [selectedField]);

  // ----------------------------------------------------
  // Refresh random (ONLY when no external data)
  // ----------------------------------------------------
  const refreshRandom = () => {
    if (isPersonalCollectionPage) return; // 👈 do nothing
    setBaseData([]);
    setLoadingRandom(true);
    const cancelled = { current: false };
    fetchRandomMeals(20, cancelled);
  };

  // ----------------------------------------------------
  // Decide final list to show
  // ----------------------------------------------------
  let listData: RecipeData[] = localFilteredSorted;

  if (!isPersonalCollectionPage) {
    // only in online mode we consider remote + filter results
    if (hasFilter) {
      listData = filterRecipes ?? [];
    } else if (query.trim().length > 0 && remoteRecipes !== null) {
      listData = remoteRecipes;
    }
  }

  const showInitialLoading =
    !isPersonalCollectionPage &&
    !hasFilter &&
    !query.trim() &&
    baseData.length === 0 &&
    (loadingRandom || loadingOptions) &&
    !loadingRemote;

  return (
    <View style={[styles.container, style]}>
      {/* Search */}
      <TextInput
        // style={styles.input}
        style={[styles.input, hasFilter && styles.inputDisabled]}
        placeholder="Search by title..."
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
        // in local mode we can still search; in filter mode we disable search (same behavior)
        editable={!hasFilter}
      />

      {/* Sort + (maybe refresh) */}
      {!isPersonalCollectionPage && (
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

          {/* refresh only in online mode */}
          {!isPersonalCollectionPage && (
            <Pressable onPress={refreshRandom} style={styles.refreshBtn}>
              <Ionicons
                name="refresh"
                size={20}
                color={!hasFilter ? '#1e90ff' : '#414141ff'}
                disabled={!hasFilter}
              />
            </Pressable>
          )}
        </View>
      )}

      {/* Filter row */}
      {!isPersonalCollectionPage && (
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Filter:</Text>

          {filters.length > 0 && (
            <Pressable onPress={clearAll} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear Filter</Text>
            </Pressable>
          )}

          {filters.length === 0 && (
            <Pressable onPress={() => setShowBuilder(true)} style={styles.addFilterBtn}>
              <Text style={styles.addFilterText}>+ Add Filter</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Active filters */}
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

      {/* Filter Builder */}
      {showBuilder && filters.length === 0 && (
        <View style={styles.builderCard}>
          <Text style={styles.builderTitle}>Add a filter</Text>

          <View style={styles.pickerRow}>
            <View style={styles.pickerWrapSmall}>
              <Picker
                selectedValue={selectedField}
                onValueChange={(v) => {
                  setSelectedField(v as FilterField);
                  setFilterValue(currentOptions[0] ?? '');
                }}
                style={styles.pickerSmall}
                itemStyle={{ fontSize: 12 }}
              >
                <Picker.Item label="Category" value="category" />
                <Picker.Item label="Ingredient" value="ingredient" />
                <Picker.Item label="Area" value="area" />
              </Picker>
            </View>

            <View style={styles.pickerWrapSmall}>
              <Picker
                enabled={!loadingOptions}
                selectedValue={filterValue || (currentOptions[0] ?? '')}
                onValueChange={(v) => setFilterValue(v)}
                style={styles.pickerSmall}
                itemStyle={{ fontSize: 12 }}
              >
                {loadingOptions ? (
                  <Picker.Item label="Loading..." value="" />
                ) : currentOptions.length > 0 ? (
                  currentOptions.map((opt) => <Picker.Item key={opt} label={opt} value={opt} />)
                ) : (
                  <Picker.Item label="No options" value="" />
                )}
              </Picker>
            </View>
          </View>

          <View style={styles.builderActions}>
            <Pressable
              onPress={() => {
                setShowBuilder(false);
                setFilterValue(currentOptions[0] ?? '');
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setQuery('');
                addFilter();
              }}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Loading states */}
      {showInitialLoading && (
        <View style={{ paddingVertical: 18 }}>
          <ActivityIndicator />
          <Text style={{ textAlign: 'center', marginTop: 6, color: '#666' }}>
            Loading recipes...
          </Text>
        </View>
      )}

      {loadingRemote && !isPersonalCollectionPage && !hasFilter && query.trim().length > 0 && (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator />
        </View>
      )}
      {remoteError && !isPersonalCollectionPage && !hasFilter && (
        <View style={{ paddingVertical: 8 }}>
          <Text style={{ color: 'red' }}>{remoteError}</Text>
        </View>
      )}

      {loadingFilterFetch && !isPersonalCollectionPage && hasFilter && (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator />
        </View>
      )}
      {filterError && !isPersonalCollectionPage && hasFilter && (
        <View style={{ paddingVertical: 8 }}>
          <Text style={{ color: 'red' }}>{filterError}</Text>
        </View>
      )}

      {/* Final list */}
      <RecipeDisplayList data={listData} loadingState={showInitialLoading} />
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

  refreshBtn: {
    marginLeft: 'auto',
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#edf4ff',
  },

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

  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  pickerWrapSmall: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  pickerSmall: {
    height: Platform.OS === 'ios' ? 140 : 60,
    fontSize: Platform.OS === 'ios' ? undefined : 12,
    transform: Platform.OS === 'ios' ? [{ scale: 0.85 }] : undefined,
  },

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
  inputDisabled: {
    backgroundColor: '#f1f1f1', 
    color: '#999',
    opacity: 0.7, 
  },
});
