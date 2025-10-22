import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SimpleIcon } from '../../components/icons';
import { Colors, Theme } from '../../constants/setting';

const Height = Dimensions.get("window").height;

interface StoreHeaderProps {
  title: string;
  setSearchText: (text: string) => void;
  setIsSearchVisible: (visible: boolean) => void;
  isSearchVisible: boolean;
  searchText: string;
}

export default function StoreHeader({
  title = 'Loja',
  setSearchText,
  searchText,
  setIsSearchVisible,
  isSearchVisible
}: StoreHeaderProps): JSX.Element {
  const navigation = useNavigation() as any;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerComponent}>
        <SimpleIcon
          name="chevron-left"
          color={Colors[Theme][7]}
          size={20}
        />
        <Text style={styles.headerTitle}>{title}</Text>
      </TouchableOpacity>

      <View style={styles.headerComponent}>
        {isSearchVisible && (
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus />
        )}
        <TouchableOpacity
          onPress={() => {
            setIsSearchVisible(!isSearchVisible);
            if (isSearchVisible) {
              setSearchText('');
            }
          }}
          style={{ marginRight: 15 }}
        >
          <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('cart')}>
          <View style={styles.cartBadge}>
            <Ionicons name="bag" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: Height * 0.12,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
  },
  cartBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
  },
});