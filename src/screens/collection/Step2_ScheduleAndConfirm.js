import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, List, Checkbox, ActivityIndicator, Snackbar } from 'react-native-paper';

import { supabase } from '../../lib/supabaseClient';
import { useDonor } from '../../contexts/donor';
import { useDonationCreation } from '../../contexts/donation-creation';
import { Colors, Theme } from '../../constants/setting';

const DAYS_OPTIONS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const TIME_SLOTS_OPTIONS = ['Manhã (8h-12h)', 'Tarde (13h-18h)'];

export function Step2_ScheduleAndConfirm() {
  const navigation = useNavigation();
  const { donorState } = useDonor();
  const { donationState, donationDispatch } = useDonationCreation();

  const [notes, setNotes] = useState('');
  const [scheduledDays, setScheduledDays] = useState([]);
  const [scheduledTimeSlots, setScheduledTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const selectedAddress = useMemo(() => 
    donorState.address.find(addr => addr.id === donationState.addressId),
    [donorState.address, donationState.addressId]
  );

  const handleDayToggle = (day) => {
    setScheduledDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleTimeToggle = (time) => {
    setScheduledTimeSlots(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };
  
  async function handleConfirmDonation() {
    setLoading(true);
    const donationData = {
      p_address_id: donationState.addressId,
      p_materials: donationState.materials,
      p_notes: notes,
      p_scheduled_days: scheduledDays,
      p_scheduled_time_slots: scheduledTimeSlots
    };
    const { data, error } = await supabase.rpc('create_donation_request', donationData);
    setLoading(false);
    
    if (error) {
      console.error("Erro ao criar doação:", error);
      setSnackbar({ visible: true, message: 'Erro ao agendar a coleta. Tente novamente.' });
    } else {
      console.log("Doação criada com sucesso! ID:", data);
      donationDispatch({ type: 'RESET' }); // Limpa o formulário

      navigation.navigate('HomeStack', { 
      refresh: true, 
      snackbarMessage: 'Coleta agendada com sucesso!' 
      });
    }
  }

  if (!selectedAddress) {
    return <Text>Erro: Endereço não encontrado.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator animating={true} size="large" style={styles.loading} />}
      
      <Text style={styles.title}>Resumo da Coleta</Text>
      
      <List.Section>
        <List.Subheader style={styles.subheader}>Endereço</List.Subheader>
        <List.Item
          title={selectedAddress.title}
          description={`${selectedAddress.street}, ${selectedAddress.num} - ${selectedAddress.city}`}
          titleStyle={styles.listItemTitle}
          descriptionStyle={styles.listItemDescription}
          left={() => <List.Icon icon="map-marker" color={Colors[Theme][2]} />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader style={styles.subheader}>Materiais</List.Subheader>
        {donationState.materials.map(mat => (
          <List.Item
            key={mat.materialId}
            title={mat.materialName}
            description={`${mat.weight} kg`}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
            left={() => <List.Icon icon="recycle" color={Colors[Theme][2]} />}
          />
        ))}
      </List.Section>

      <Text style={styles.title}>Agendamento</Text>
      
      <List.Section>
        <List.Subheader style={styles.subheader}>Selecione os dias disponíveis</List.Subheader>
        {DAYS_OPTIONS.map(day => (
          <Checkbox.Item
            key={day}
            label={day}
            labelStyle={styles.checkboxLabel}
            status={scheduledDays.includes(day) ? 'checked' : 'unchecked'}
            onPress={() => handleDayToggle(day)}
            color={Colors[Theme][2]}
            uncheckedColor={Colors[Theme][5]}
          />
        ))}
      </List.Section>

      <List.Section>
        <List.Subheader style={styles.subheader}>Selecione os períodos</List.Subheader>
        {TIME_SLOTS_OPTIONS.map(time => (
          <Checkbox.Item
            key={time}
            label={time}
            labelStyle={styles.checkboxLabel}
            status={scheduledTimeSlots.includes(time) ? 'checked' : 'unchecked'}
            onPress={() => handleTimeToggle(time)}
            color={Colors[Theme][2]}
            uncheckedColor={Colors[Theme][5]}
          />
        ))}
      </List.Section>
      
      <TextInput
        style={styles.input}
        placeholder="Observações (opcional)... Ex: Deixar na portaria, material em 3 sacolas, etc."
        placeholderTextColor={Colors[Theme][5]}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button
        style={styles.navButton}
        mode="contained"
        onPress={handleConfirmDonation}
        disabled={loading || scheduledDays.length === 0 || scheduledTimeSlots.length === 0}
        buttonColor={Colors[Theme][9]}
        textColor={Colors[Theme][0]}
      >
        Confirmar agendamento de coleta
      </Button>
      
      <Snackbar visible={snackbar.visible} onDismiss={() => setSnackbar({ ...snackbar, visible: false })}>
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: Colors[Theme][0] },
    title: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: Colors[Theme][6] },
    subheader: { color: Colors[Theme][5] },
    listItemTitle: { color: Colors[Theme][4], fontWeight: 'bold' }, 
    listItemDescription: { color: Colors[Theme][5] }, 
    checkboxLabel: { color: Colors[Theme][4] }, 
    input: { 
        backgroundColor: Colors[Theme][1], 
        color: Colors[Theme][4],
        padding: 15, 
        marginVertical: 10, 
        borderRadius: 5, 
        minHeight: 100,
        textAlignVertical: 'top'
    },
    navButton: { marginTop: 20, marginBottom: 40 },
    loading: { position: 'absolute', top: '50%', left: '50%', zIndex: 10 },
});