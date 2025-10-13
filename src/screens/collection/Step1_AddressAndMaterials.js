import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton, Button, List } from 'react-native-paper';

import { supabase } from '../../lib/supabaseClient';
import { useDonor } from '../../contexts/donor';
import { useDonationCreation } from '../../contexts/donation-creation';
import { Colors, Theme } from '../../constants/setting';

export function Step1_AddressAndMaterials() {
  const navigation = useNavigation();
  const { donorState } = useDonor();
  const { donationState, donationDispatch } = useDonationCreation();

  const [allMaterials, setAllMaterials] = useState([]); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [weight, setWeight] = useState('');

  // Busca os materiais disponíveis no Supabase quando a tela é montada
  useEffect(() => {
    async function fetchMaterials() {
      const { data, error } = await supabase.from('materials').select('*').eq('active', true);
      if (!error) {
        setAllMaterials(data);
      }
    }
    fetchMaterials();
  }, []);

  const handleSelectAddress = (addressId) => {
    donationDispatch({ type: 'SELECT_ADDRESS', payload: addressId });
  };

  const handleSaveMaterial = () => {
    if (selectedMaterial && weight) {
      donationDispatch({
        type: 'ADD_OR_UPDATE_MATERIAL',
        payload: {
          materialId: selectedMaterial.id,
          materialName: selectedMaterial.name,
          weight: parseFloat(weight),
        },
      });
      setModalVisible(false);
      setSelectedMaterial(null);
      setWeight('');
    }
  };
  
  const handleRemoveMaterial = (materialId) => {
    donationDispatch({ type: 'REMOVE_MATERIAL', payload: materialId });
  };

  return (
    <View style={styles.container}>
      {/* SELETOR DE ENDEREÇO */}
      <Text style={styles.title}>Onde será a coleta?</Text>
      <RadioButton.Group onValueChange={handleSelectAddress} value={donationState.addressId}>
        {donorState.address.map(addr => (
          <View key={addr.id} style={styles.radioItem}>
            <RadioButton value={addr.id} color={Colors[Theme][2]} />
            <Text style={styles.radioLabel}>{`${addr.title} (${addr.street}, ${addr.num})`}</Text>
          </View>
        ))}
      </RadioButton.Group>

      {/* LISTA DE MATERIAIS ADICIONADOS */}
      <Text style={styles.title}>O que você quer doar?</Text>
      <FlatList
        data={donationState.materials}
        keyExtractor={(item) => item.materialId}
        renderItem={({ item }) => (
            <List.Item
            title={`${item.materialName}`}
            description={`${item.weight} kg`}
            
            titleStyle={{ color: Colors[Theme][4], fontWeight: 'bold' }}
            descriptionStyle={{ color: Colors[Theme][5], fontSize: 14 }}

            right={() => 
                <TouchableOpacity onPress={() => handleRemoveMaterial(item.materialId)}>
                <List.Icon icon="delete" color={Colors[Theme][8]} />
                </TouchableOpacity>
            }
            />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum material adicionado.</Text>}
        />
      <Button 
        icon="plus" 
        mode="contained" 
        onPress={() => setModalVisible(true)}
        buttonColor={Colors[Theme][2]}
        textColor={Colors[Theme][7]}
      >
        Adicionar Material
      </Button>

      {/* NAVEGAÇÃO */}
      <Button
        style={styles.navButton}
        mode="contained"
        onPress={() => navigation.navigate('CollectionStep2')}
        disabled={!donationState.addressId || donationState.materials.length === 0}
        buttonColor={Colors[Theme][2]}
        textColor={Colors[Theme][7]}
      >
        Avançar
      </Button>

      {/* MODAL PARA ADICIONAR MATERIAL E PESO */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Adicionar Material</Text>
            {allMaterials.map(mat => (
              <TouchableOpacity key={mat.id} onPress={() => setSelectedMaterial(mat)} style={selectedMaterial?.id === mat.id ? styles.selectedMaterial : styles.materialItem}>
                <Text>{mat.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.input}
              placeholder="Peso estimado (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Button
                onPress={handleSaveMaterial}
                textColor={Colors[Theme][2]}
                >
                Salvar
            </Button>
            <Button 
                onPress={() => setModalVisible(false)}
                textColor={Colors[Theme][5]}
              >
                Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  radioItem: { flexDirection: 'row', alignItems: 'center' },
  radioLabel: { flex: 1 },
  navButton: { marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  materialItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectedMaterial: { padding: 10, backgroundColor: '#a7f3d0' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginTop: 20, marginBottom: 10 },
});