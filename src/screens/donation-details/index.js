import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { List, Card, Button, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';

import { useGetDonationDetails } from '../home/hooks/useGetDonationDetails';
import { supabase } from '../../lib/supabaseClient';
import { Colors, Theme } from '../../constants/setting';

export function DonationDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { donationId } = route.params;

  const { donation: initialDonation, loading, error } = useGetDonationDetails(donationId);
  const [donationDetails, setDonationDetails] = useState(null);

  useEffect(() => {
    if (initialDonation) {
      setDonationDetails(initialDonation);
    }
  }, [initialDonation]);

  const handleCancelDonation = async () => {
    Alert.alert(
      "Confirmar Cancelamento",
      "Tem certeza de que deseja cancelar esta coleta?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim, Cancelar", style: "destructive", onPress: async () => {
            const { error: updateError } = await supabase
              .from('donations')
              .update({ status: 'cancelled' })
              .eq('id', donationId);

            if (updateError) {
              Alert.alert("Erro", "Não foi possível cancelar a coleta. Tente novamente.");
            } else {
              // SUCESSO!
              // Navega para a Home, enviando o sinal para atualizar e a mensagem.
              navigation.navigate('HomeStack', { 
                refresh: true,
                snackbarMessage: 'Coleta cancelada com sucesso!' 
              });
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color={Colors[Theme][2]} />;
  }
  if (error || !donationDetails) {
    return <Text style={styles.centeredText}>Erro ao carregar os detalhes da coleta.</Text>;
  }
  
  const { status, address, items, scheduled_days, scheduled_time_slots, notes, collector } = donationDetails;
  const canBeCancelled = status === 'pending' || status === 'accepted';
  const statusInfo = {
    pending: { text: 'Aguardando Coletor', color: '#f59e0b' },
    accepted: { text: 'Coleta Agendada', color: Colors[Theme][2] },
    completed: { text: 'Concluída', color: Colors[Theme][5] },
    cancelled: { text: 'Cancelada', color: Colors[Theme][8] },
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Status da Coleta"
          titleStyle={styles.cardTitle} // <<< CORREÇÃO
          right={() => <Chip style={{ backgroundColor: statusInfo[status]?.color }} textStyle={{color: 'white'}}>{statusInfo[status]?.text}</Chip>}
        />
        <Card.Content>
          <List.Section>
            <List.Subheader style={styles.subheader}>Materiais</List.Subheader>
            {items.map((item, index) => (
              <List.Item
                key={index}
                title={item.material.name}
                description={`${item.weight_kg} kg`}
                titleStyle={styles.listItemTitle} // <<< CORREÇÃO
                descriptionStyle={styles.listItemDescription} // <<< CORREÇÃO
                left={() => <List.Icon icon="recycle" color={Colors[Theme][2]} />}
              />
            ))}
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subheader}>Endereço</List.Subheader>
            <List.Item
              title={`${address.street}, ${address.num}`}
              description={`${address.neighborhood} - ${address.city}, ${address.state}`}
              titleStyle={styles.listItemTitle} // <<< CORREÇÃO
              descriptionStyle={styles.listItemDescription} // <<< CORREÇÃO
              left={() => <List.Icon icon="map-marker" color={Colors[Theme][2]} />}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subheader}>Agendamento</List.Subheader>
            <List.Item 
              title={scheduled_days.join(', ')} 
              titleStyle={styles.listItemTitle} // <<< CORREÇÃO
              left={() => <List.Icon icon="calendar" color={Colors[Theme][2]} />} 
            />
            <List.Item 
              title={scheduled_time_slots.join(', ')} 
              titleStyle={styles.listItemTitle} // <<< CORREÇÃO
              left={() => <List.Icon icon="clock-outline" color={Colors[Theme][2]} />} 
            />
          </List.Section>

          {collector && (
            <List.Section>
              <List.Subheader style={styles.subheader}>Coletor(a) Responsável</List.Subheader>
              <List.Item 
                title={collector.name} 
                titleStyle={styles.listItemTitle} // <<< CORREÇÃO
                left={() => <List.Icon icon="account" color={Colors[Theme][2]} />} 
              />
            </List.Section>
          )}

          {notes && (
            <List.Section>
              <List.Subheader style={styles.subheader}>Observações</List.Subheader>
              <Paragraph style={styles.notes}>{notes}</Paragraph>
            </List.Section>
          )}

        </Card.Content>
      </Card>
      
      {canBeCancelled && (
        <Button 
          mode="contained" 
          onPress={handleCancelDonation} 
          style={styles.cancelButton}
          buttonColor={Colors[Theme][8]}
          icon="cancel"
        >
          Cancelar Coleta
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors[Theme][0], padding: 10 },
  card: { backgroundColor: Colors[Theme][1], marginBottom: 20 },
  centeredText: { textAlign: 'center', marginTop: 50, color: Colors[Theme][5] },
  cancelButton: { margin: 10 },
  // --- ESTILOS ADICIONADOS/MODIFICADOS ---
  cardTitle: {
    color: Colors[Theme][6], // Cor do título principal do card (verde)
    fontWeight: 'bold',
  },
  subheader: {
    color: Colors[Theme][5], // Cor dos subtítulos (Endereço, Materiais, etc.)
    fontWeight: 'bold',
    fontSize: 14,
  },
  listItemTitle: {
    color: Colors[Theme][4], // Cor principal do texto (preto/cinza escuro)
    fontSize: 16,
  },
  listItemDescription: {
    color: Colors[Theme][5], // Cor secundária para descrições
    fontSize: 14,
  },
  notes: { 
    paddingHorizontal: 16, 
    color: Colors[Theme][4], // Cor principal para o texto de observações
    fontSize: 16
  },
});