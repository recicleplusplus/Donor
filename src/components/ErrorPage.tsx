import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Theme } from '../constants/setting';

export function ErrorPage(): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons
          name="error-outline"
          size={80}
          color={Colors[Theme][8]}
        />
        <Text style={styles.message}>
          Erro ao carregar a página, tente novamente mais tarde
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[Theme][0],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  message: {
    fontSize: 18,
    color: Colors[Theme][4],
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
});