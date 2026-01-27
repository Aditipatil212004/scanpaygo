import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#FFFFFF',                 // ✅ WHITE BACKGROUND
  card: '#FFFFFF',
  border: '#E5E7EB',             // ✅ neutral border for white UI
  primary: '#16A34A',
  text: '#0F172A',               // ✅ dark for clean contrast
  muted: '#64748B',              // ✅ slate gray
  placeholder: '#94A3B8',        // ✅ light placeholder
};

/* ✅ STORES DATA */
const STORES = [
  {
    id: '1',
    name: 'Zudio',
    tagline: 'Fashion for Everyone',
    offer: 'Flat 50% Off',
    type: 'Fashion',
    rating: 4.4,
    location: 'Pune',
    logo: require('../../assets/stores/zudio_logo.png'),
  },
  {
    id: '2',
    name: 'Westside',
    tagline: 'Style & Comfort',
    offer: 'Buy 1 Get 1',
    type: 'Fashion',
    rating: 4.5,
    location: 'Mumbai',
    logo: require('../../assets/stores/westside_logo.png'),
  },
  {
    id: '3',
    name: 'Zara',
    tagline: 'Premium Fashion',
    offer: 'Up to 60% Off',
    type: 'Premium',
    rating: 4.6,
    location: 'Delhi',
    logo: require('../../assets/stores/zara_logo.png'),
  },
  {
    id: '4',
    name: 'H&M',
    tagline: 'Fashion & Quality',
    offer: 'Winter Sale 40–70%',
    type: 'Fashion',
    rating: 4.3,
    location: 'Bangalore',
    logo: require('../../assets/stores/hm.png'),
  },
  {
    id: '5',
    name: 'Reliance Trends',
    tagline: 'Everyday Fashion',
    offer: 'New Arrivals',
    type: 'Fashion',
    rating: 4.2,
    location: 'Nashik',
    logo: require('../../assets/stores/trends_logo.png'),
  },
  {
    id: '6',
    name: 'Reliance Smart',
    tagline: 'Groceries & More',
    offer: 'Weekly Savings',
    type: 'Grocery',
    rating: 4.1,
    location: 'Pune',
    logo: require('../../assets/stores/relaince_logo.png'),
  },
  {
    id: '7',
    name: 'DMart',
    tagline: 'Value for Money',
    offer: 'Best Deals',
    type: 'Grocery',
    rating: 4.7,
    location: 'Pune',
    logo: require('../../assets/stores/dmart_logo.png'),
  },
];

const FILTERS = ['All', 'Fashion', 'Grocery', 'Premium'];

export default function StoresScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredStores = useMemo(() => {
    const q = query.trim().toLowerCase();

    return STORES.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);

      const matchesFilter = filter === 'All' ? true : s.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [query, filter]);

  const topStores = useMemo(() => {
    return [...STORES].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* ===== Header ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>Stores</Text>
        <Text style={styles.subTitle}>
          Browse stores and start shopping smart
        </Text>
      </View>

      {/* ===== Search Bar ===== */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={COLORS.primary} />
        <TextInput
          placeholder="Search store, location..."
          placeholderTextColor={COLORS.placeholder}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.8}>
            <Ionicons name="close-circle" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ===== Filters ===== */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.9}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Ionicons
                  name={
                    f === 'All'
                      ? 'apps'
                      : f === 'Fashion'
                        ? 'shirt'
                        : f === 'Grocery'
                          ? 'basket'
                          : 'sparkles'
                  }
                  size={16}
                  color={active ? '#fff' : COLORS.primary}
                />

                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ===== Top Stores ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Stores</Text>
        <Text style={styles.sectionHint}>Most rated stores near you</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
      >
        {topStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={styles.topStoreCard}
            activeOpacity={0.92}
            onPress={() =>
              navigation.navigate('StoreOffers', {
                storeId: store.id,
                storeName: store.name,
              })
            }
          >
            <View style={styles.topLogoBox}>
              <Image source={store.logo} style={styles.topLogo} />
            </View>

            <Text style={styles.topStoreName} numberOfLines={1}>
              {store.name}
            </Text>

            <View style={styles.topMeta}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.topMetaText}>{store.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ===== All Stores List ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Stores</Text>
        <Text style={styles.sectionHint}>
          {filteredStores.length} store(s) found
        </Text>
      </View>

      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storeCard}
            activeOpacity={0.92}
            onPress={() =>
              navigation.navigate('StoreOffers', {
                storeId: item.id,
                storeName: item.name,
              })
            }
          >
            <View style={styles.storeRow}>
              <View style={styles.logoBox}>
                <Image source={item.logo} style={styles.logo} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.storeName}>{item.name}</Text>
                <Text style={styles.tagline}>{item.tagline}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaPill}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={COLORS.primary}
                    />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>

                  <View style={styles.metaPill}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.metaText}>{item.rating}</Text>
                  </View>

                  <View style={styles.typePill}>
                    <Text style={styles.typeText}>{item.type}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.rightSide}>
                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>{item.offer}</Text>
                </View>

                <View style={styles.arrowBtn}>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 30, alignItems: 'center' }}>
            <Ionicons
              name="storefront-outline"
              size={46}
              color={COLORS.primary}
            />
            <Text style={styles.emptyTitle}>No stores found</Text>
            <Text style={styles.emptySub}>Try changing search or filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
  },

  subTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
  },

  /* Search */
  searchBox: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },

  /* ✅ Filter Bar */
  filterWrap: {
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 12,
    borderRadius: 22,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  filterRow: {
    gap: 10,
    paddingHorizontal: 2,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },

  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.20,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.text,
  },

  filterChipTextActive: {
    color: '#fff',
  },

  /* Section Header */
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },

  sectionHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },

  /* Top Stores */
  topStoreCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  topLogoBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  topLogo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },

  topStoreName: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },

  topMeta: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  topMetaText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.text,
  },

  /* Store Card */
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBox: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  storeName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },

  tagline: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  metaText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.text,
  },

  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#16A34A15',
    borderWidth: 1,
    borderColor: '#16A34A25',
  },

  typeText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
  },

  rightSide: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  offerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },

  offerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
  },

  arrowBtn: {
    marginTop: 10,
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },

  emptySub: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
    textAlign: 'center',
  },
});
