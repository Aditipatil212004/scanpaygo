import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const COLORS = {
  bg: '#FFFFFF',          // ✅ white background
  card: '#FFFFFF',
  border: '#E5E7EB',      // ✅ light border
  primary: '#16A34A',     // ✅ green
  text: '#0F172A',        // ✅ dark text
  muted: '#64748B',       // ✅ gray subtitle
};

/* ✅ Dummy products per category */
const CATEGORY_PRODUCTS = {
  Men: [
    {
      id: 'm1',
      name: 'Men T-Shirt',
      price: 499,
      off: '20% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
    {
      id: 'm2',
      name: 'Formal Shirt',
      price: 799,
      off: '15% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
  ],
  Women: [
    {
      id: 'w1',
      name: 'Summer Dress',
      price: 1499,
      off: '35% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
    {
      id: 'w2',
      name: 'Casual Shirt',
      price: 1899,
      off: '10% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
  ],
  Kids: [
    {
      id: 'k1',
      name: 'Kids Jacket',
      price: 999,
      off: '25% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
  ],
  Footwear: [
    {
      id: 'f1',
      name: 'Sports Shoes',
      price: 2499,
      off: '30% OFF',
      image: require('../../assets/products/shoes.png'),
    },
  ],
  Accessories: [
    {
      id: 'a1',
      name: 'Watch',
      price: 599,
      off: '12% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
    {
      id: 'a2',
      name: 'Titan Watch',
      price: 899,
      off: '18% OFF',
      image: require('../../assets/products/tshirt.png'),
    },
  ],
};

export default function CategoryProductsScreen({ route, navigation }) {
  const { categoryName = 'Men', storeName = 'Store' } = route?.params || {};
  const { addToCart, totals } = useCart();

  const products = useMemo(() => {
    return CATEGORY_PRODUCTS[categoryName] || [];
  }, [categoryName]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* ✅ Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.navTitle}>{categoryName}</Text>
          <Text style={styles.navSub}>{storeName}</Text>
        </View>

        {/* ✅ Cart button */}
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          {totals.count > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartCount}>
                {totals.count > 99 ? '99+' : totals.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ✅ Products List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.imageBox}>
              <Image
                source={item.image}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>

                <View style={styles.offBadge}>
                  <Text style={styles.offText}>{item.off}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              activeOpacity={0.9}
              onPress={() => addToCart(item)}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <Ionicons name="cube-outline" size={46} color={COLORS.primary} />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptySub}>
              This category has no products yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ✅ STYLES */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  navbar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  navTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },

  navSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },

  cartBtn: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartCount: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
  },

  productCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  imageBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  productImage: { width: 44, height: 44 },

  productName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },

  price: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
    marginRight: 10,
  },

  offBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },

  offText: { fontSize: 11, fontWeight: '900', color: COLORS.primary },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },

  emptyTitle: {
    marginTop: 10,
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
