import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Product } from "../../firebase/instances/products";

interface HorizontalProductsProps {
  products: Product[];
  onPressItem?: (product: Product) => void;
}

export default function HorizontalProducts({ products, onPressItem }: HorizontalProductsProps): JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.productsContainer, { paddingBottom: 10 }]}
    >
      {products.map((product) => (
        <TouchableOpacity key={product.id} style={styles.featuredProductCard} onPress={() => onPressItem?.(product)}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-25%</Text>
          </View>
          <Image source={product.imageUrl} style={styles.productImage} resizeMode="contain" />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>{product.originalPrice} 🍃</Text>
              <Text style={styles.productPrice}>{product.price} 🍃</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    margin: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedCategoryName: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  featuredProductCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f9f9f9',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});