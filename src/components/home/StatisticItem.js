import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Theme } from "../../constants/setting";

// Mapeamento de nomes de material (ou rótulos) para nomes de ícones
// Adicione mais mapeamentos conforme necessário
const iconMapping = {
  'Coletas Completadas': 'check-circle-outline',
  'Plástico': 'bottle-soda-classic-outline',
  'Papel': 'file-document-outline',
  'Metal': 'magnet',
  'Vidro': 'bottle-wine-outline',
  'Óleo': 'oil',
  'Eletrônico': 'power-plug-outline',
  default: 'recycle', 
};

export const StatisticItem = ({ label, value }) => {
  // Pega o nome do ícone com base no rótulo, ou usa o padrão
  const iconName = iconMapping[label] || iconMapping.default;

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={iconName} size={32} color={Colors[Theme][2]} />
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors[Theme][1], // Cor de fundo do card (branco/cinza claro)
    borderRadius: 8,
    padding: 15,
    margin: 8,
    alignItems: 'center', // Centraliza o conteúdo
    justifyContent: 'center',
    minWidth: 110, // Largura mínima para garantir bom espaçamento
    minHeight: 110, // Altura mínima
    elevation: 3, // Sombra (Android)
    shadowColor: '#000', // Sombra (iOS)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors[Theme][4], // Cor principal do texto
    marginTop: 8,
  },
  labelText: {
    fontSize: 12,
    color: Colors[Theme][5], // Cor secundária do texto
    marginTop: 4,
    textAlign: 'center', // Para rótulos com mais de uma palavra
  },
});