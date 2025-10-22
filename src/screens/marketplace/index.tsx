import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BalanceCard from '../../components/store/BalanceCard';
import { Product } from '../../firebase/instances/products';
import HorizontalProducts from '../../components/store/HorizontalProducts';
import SizedBox from '../../components/SizedBox';
import StoreHeader from './storeHeader';
import { DonorContext } from '../../contexts/donor/context';
import { getAllProducts, getProductsWithDiscount, getProductsWithoutDiscount } from '../../firebase/providers/marketplace';

const { width: screenWidth } = Dimensions.get("window");

const categories = [
  { name: 'Todos', icon: 'grid', color: '#4CAF50' },
  { name: 'Casa', icon: 'home', color: '#4CAF50' },
  { name: 'Moda', icon: 'shirt', color: '#2196F3' },
  { name: 'Eletrônicos', icon: 'phone-portrait', color: '#FF9800' },
  { name: 'Livros', icon: 'book', color: '#9C27B0' },
  { name: 'Esportes', icon: 'football', color: '#F44336' },
  { name: 'Beleza', icon: 'flower', color: '#E91E63' },
];

export default function Store({ navigation }: { route: any, navigation: any }) {
  const donorContext = useContext(DonorContext as any) as any;
  const donorPoints = donorContext?.donorState?.points || 0;

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const promotionalProducts = getProductsWithDiscount(products);
  const popularProducts = getProductsWithoutDiscount(products);
  const featuredProducts = promotionalProducts.slice(0, 5); // Top 5 ofertas especiais

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getAllProducts();
      setProducts(Object.values(allProducts));
    }
    fetchProducts();
  }, []);

  const getFilteredProducts = (products: Product[]) => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchText.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const navigateToProductPage = (intId: number) => {
    const product = Object.values(products).find((p) => p.intId === intId);
    if (product) {
      navigation.navigate('Product', { product });
    }
  }

  return (
    <>
      {/* Header */}
      <StoreHeader
        title="Loja"
        setSearchText={setSearchText}
        searchText={searchText}
        setIsSearchVisible={setIsSearchVisible}
        isSearchVisible={isSearchVisible}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Search Results */}
        {searchText ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Resultados da busca "{searchText}"
            </Text>
            <SizedBox height={10} />

            {getFilteredProducts([...featuredProducts, ...popularProducts]).length > 0 ? (
              <View style={styles.popularGrid}>
                {getFilteredProducts([...featuredProducts, ...popularProducts]).map((product) => (
                  <TouchableOpacity
                    key={product.intId}
                    style={styles.popularProductCard}
                    onPress={() => navigateToProductPage(product.intId)}
                  >
                    <Image source={{ uri: product.imgUrl }} style={styles.popularProductImage} resizeMode="contain" />
                    <View style={styles.popularProductInfo}>
                      <Text style={styles.popularProductName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.popularProductPrice}>{product.currentPrice} 🍃</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  Nenhum produto encontrado para "{searchText}"
                </Text>
              </View>
            )}
          </View>
        )
          :
          <>
            <BalanceCard donorPoints={donorPoints} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categorias</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryCard
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <View style={[
                      styles.categoryIcon,
                      { backgroundColor: selectedCategory === category.name ? category.color : '#ddd' }
                    ]}>
                      <Ionicons name={category.icon as any} size={24} color="#fff" />
                    </View>
                    <Text style={[
                      styles.categoryName,
                      selectedCategory === category.name && styles.selectedCategoryName
                    ]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {selectedCategory === 'Todos' && (
              <View style={[styles.section, { paddingBottom: 15 }]}>
                <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
                <SizedBox height={10} />
                <HorizontalProducts
                  products={featuredProducts}
                  onPressItem={(product) => navigateToProductPage(product.intId)}
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Populares</Text>
              <SizedBox height={10} />

              <View style={styles.popularGrid}>
                {getFilteredProducts(popularProducts).map((product) => (
                  <TouchableOpacity
                    key={product.intId}
                    style={styles.popularProductCard}
                    onPress={() => navigateToProductPage(product.intId)}
                  >
                    <Image source={{ uri: product.imgUrl }} style={styles.popularProductImage} resizeMode="contain" />
                    <View style={styles.popularProductInfo}>
                      <Text style={styles.popularProductName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.popularProductPrice}>{product.currentPrice} 🍃</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        }
      </ScrollView>
    </>
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
  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 10,
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
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  popularProductCard: {
    width: (screenWidth - 50) / 2,
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
  popularProductImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f9f9f9',
  },
  popularProductInfo: {
    padding: 12,
  },
  popularProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  popularProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});