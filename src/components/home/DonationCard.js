import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Chip, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Theme } from "../../constants/setting"; // Ajuste o caminho se necessário
import { useNavigation } from '@react-navigation/native'; // Importe o hook de navegaçã

// O componente agora vive em seu próprio arquivo.
// Ele recebe um 'item' (a doação) como propriedade.
export const DonationCard = ({ item }) => {
  const navigation = useNavigation();

  // Mapeia o status do banco para um texto e cor
  const statusInfo = {
    pending: { text: 'Aguardando Coletor', color: '#f59e0b' },
    accepted: { text: 'Coleta Agendada', color: Colors[Theme][2] },
    completed: { text: 'Concluída', color: Colors[Theme][5] },
    cancelled: { text: 'Cancelada', color: Colors[Theme][8] },
  };

  const handleCardPress = () => {
    // Navega para a tela 'DonationDetails', passando o ID do item como parâmetro
    navigation.navigate('DonationDetails', { donationId: item.id });
  };

  // Formata a lista de materiais para exibição
  const materialsText = item.donation_items.map(di => di.materials.name).join(', ');

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Paragraph style={styles.cardDate}>
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </Paragraph>
            <Chip 
              style={{ backgroundColor: statusInfo[item.status]?.color || '#888' }} 
              textStyle={{ color: 'white', fontSize: 12 }}
            >
              {statusInfo[item.status]?.text || 'Desconhecido'}
            </Chip>
          </View>
          <Paragraph style={styles.cardMaterials}>{materialsText}</Paragraph>
          <View style={styles.cardRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors[Theme][5]} />
            <Text style={styles.cardAddressText}>{`${item.addresses.street}, ${item.addresses.num}`}</Text>
          </View>
          {item.collector && (
            <View style={styles.cardRow}>
              <MaterialCommunityIcons name="account-outline" size={16} color={Colors[Theme][5]} />
              <Text style={styles.cardAddressText}>{`Coletor(a): ${item.collector.name}`}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// Os estilos específicos do card agora vivem junto com o componente.
const styles = StyleSheet.create({
  card: {
    marginRight: 15,
    width: 280,
    backgroundColor: Colors[Theme][1],
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDate: {
    color: Colors[Theme][5],
    fontSize: 12,
  },
  cardMaterials: {
    color: Colors[Theme][4],
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardAddressText: {
    color: Colors[Theme][5],
    marginLeft: 8,
    fontSize: 12,
  },
});