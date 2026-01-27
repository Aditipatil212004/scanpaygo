import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useCart } from '../context/CartContext';

import { Ionicons } from '@expo/vector-icons';

const WISHLIST = [
  {
    id: '1',
    name: 'Cotton T-Shirt',
    price: '₹499',
    image: require('../../assets/products/bread.png'),
  },
  {
    id: '2',
    name: 'Handbag',
    price: '₹1899',
    image: require('../../assets/products/chips.png'),
  },
];

export default function WishlistScreen({ navigation }) {
    const { addToCart } = useCart();

  return (

    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={26} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Wishlist</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={WISHLIST}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imgBox}>
              <Image source={item.image} style={styles.img} resizeMode="contain" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>

            <TouchableOpacity style={styles.heartBtn} activeOpacity={0.9}>
              <Ionicons name="heart" size={18} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity
  style={styles.addCartBtn}
  activeOpacity={0.9}
  onPress={() => addToCart(item)}
>
  <Ionicons name="cart-outline" size={18} color="#fff" />
</TouchableOpacity>

          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={50} color="#16A34A" />
            <Text style={styles.emptyTitle}>No wishlist items</Text>
            <Text style={styles.emptySub}>Save products here for later!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },

  imgBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  img: { width: 44, height: 44 },

  name: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  price: { marginTop: 6, fontSize: 14, fontWeight: '900', color: '#16A34A' },

  heartBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCartBtn: {
  width: 42,
  height: 42,
  borderRadius: 16,
  backgroundColor: '#16A34A',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
},


  empty: { paddingTop: 70, alignItems: 'center' },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: '900', color: '#0F172A' },
  emptySub: { marginTop: 6, fontSize: 12, fontWeight: '700', color: '#64748B' },
});
