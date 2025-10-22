import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
          style={{ marginRight: 5 }}
        >
          <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color="#fff" />
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
    paddingHorizontal: 10,
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
  searchInput: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
  },
});