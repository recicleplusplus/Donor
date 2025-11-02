import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Product } from '../../firebase/instances/products';

interface ProductCardProps {
  product: Product;
  onPress: (intId: number) => void;
}

export default function ProductCard({
  product, onPress
}: ProductCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product.intId)}
    >
      <Image source={{ uri: product.imgUrl }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{product.currentPrice} 🍃</Text>
        {Number(product.originalPrice) > Number(product.currentPrice) && (
          <Text style={[styles.price, { textDecorationLine: 'line-through', color: '#999', fontSize: 12 }]}>
            {product.originalPrice} 🍃
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f9f9f9',
  },
  info: {
    padding: 12,
    minHeight: 90,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    height: 36,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
});
