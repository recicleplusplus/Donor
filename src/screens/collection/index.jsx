import { useNavigation } from "@react-navigation/native";
import { TextInput ,Text, View, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView as RNScrollView } from "react-native";
import { styles, pickerSelectStyles } from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { ContainerTop, ContainerTopRegister } from "../../components/containers";
import { Colors,Theme } from "../../constants/setting";
import { useContext, useState, useEffect } from "react";
import * as sizedbox from 'sizedbox';
import { Checkbox, Portal, Modal, Button } from 'react-native-paper';
import { DonorContext } from "../../contexts/donor/context";
import { AddressCard2 } from "../address/components/card";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function Collection({ route }) {
  const navigation = useNavigation();
  const [checkString, setCheckedString] = useState([]);
  const { donorState, donorDispatch } = useContext(DonorContext);
  const [materialsData, setMaterialsData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [tempCaixas, setTempCaixas] = useState('');
  const [tempSacolas, setTempSacolas] = useState('');
  const [tempPeso, setTempPeso] = useState('');

  const itens = [
    { label: 'Plástico', value: 'plastico'},
    { label: 'Metal', value: 'metal' },
    { label: 'Papel', value: 'papel' },
    { label: 'Eletrônico', value: 'eletronico' },
    { label: 'Óleo', value: 'oleo' },
    { label: 'Vidro', value: 'vidro' },
  ];

  const checkBoxString = (value) => {
    if (checkString.includes(value)) {
      setCheckedString(checkString.filter((item) => item !== value));
    } else {
      setCheckedString([...checkString, value]);
    }
  };

  const nextPage = () => {
    if (checkString.length === 0) {
      alert('Por favor, selecione um endereço');
      return;
    }
    if (materialsData.length === 0) {
      alert('Por favor, adicione pelo menos um material com suas quantidades');
      return;
    }

    const addressString = checkString.map((addressTitle) => {
      const address = donorState.address.find((item) => item.title === addressTitle);
      return `${address.title}, ${address.street}, ${address.neighborhood}, ${address.city}, ${address.reference}, ${address.num}, ${address.cep}, ${address.latitude}, ${address.longitude}, ${address.state}`;
    }).join(";");

    navigation.navigate('Collection3', { materialsData, endereco: addressString });
  };

  const handleMaterialPress = (item) => {
    // Verifica se o material já tem dados cadastrados
    const existingMaterial = materialsData.find(m => m.value === item.value);
    if (existingMaterial) {
      // Carrega os dados existentes
      setTempCaixas(existingMaterial.caixas.toString());
      setTempSacolas(existingMaterial.sacolas.toString());
      setTempPeso(existingMaterial.peso.toString());
    } else {
      // Limpa os campos
      setTempCaixas('');
      setTempSacolas('');
      setTempPeso('');
    }
    setSelectedMaterial(item);
    setModalVisible(true);
  };

  const handleSaveMaterial = () => {
    if (!tempCaixas && !tempSacolas && !tempPeso) {
      alert('Por favor, preencha pelo menos um campo');
      return;
    }

    const newMaterialData = {
      label: selectedMaterial.label,
      value: selectedMaterial.value,
      caixas: parseInt(tempCaixas) || 0,
      sacolas: parseInt(tempSacolas) || 0,
      peso: tempPeso || '0',
    };

    // Remove o material anterior se existir e adiciona o novo
    setMaterialsData(prev => {
      const filtered = prev.filter(m => m.value !== selectedMaterial.value);
      return [...filtered, newMaterialData];
    });

    setModalVisible(false);
    setTempCaixas('');
    setTempSacolas('');
    setTempPeso('');
  };

  const handleRemoveMaterial = (materialValue) => {
    setMaterialsData(prev => prev.filter(m => m.value !== materialValue));
  };

  const isMaterialConfigured = (materialValue) => {
    return materialsData.some(m => m.value === materialValue);
  };

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <ContainerTop/>     
        <ContainerTopRegister/>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ color: Colors[Theme][2], textAlign: 'left', padding: 20, fontWeight: 'bold', fontSize: 20 }}>Cadastrar Coleta 1</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 15, paddingBottom: 0 }}>
          <Text style={{ color: Colors[Theme][2], textAlign: 'left', fontSize: 15 }}>Endereço</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: Colors[Theme][4], fontSize: 15, fontWeight: 500 }}>Cadastrar Endereço +</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.containerEdit}>
          {donorState.address.length > 0 ? (
            donorState.address.map((address) => (
              <View key={address.title} style={styles.containerEdit}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    value={checkString.includes(address.title)}
                    status={checkString.includes(address.title) ? 'checked' : 'unchecked'}
                    onPress={() => checkBoxString(address.title)}
                    color={Colors[Theme][2]}
                  />
                  <AddressCard2 address={address} editFn={() => AddressCard2(address)} key={address.title} />
                </View>
              </View>
            ))
            ) : (
            <View>
              <Text style={{ color: Colors[Theme][4], textAlign: 'left', paddingBottom: 15, fontSize: 15 }}>Nenhum endereço cadastrado</Text>
            </View>
          )}
       </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ color: Colors[Theme][2], textAlign: 'left', padding: 15, fontSize: 15 }}>Tipo de material</Text>
              <Text style={{ color: Colors[Theme][4], textAlign: 'left', paddingLeft: 15, fontSize: 12 }}>Toque no material para adicionar as quantidades</Text>
        </View>
        <View>
      {itens.map((item) => (
        <TouchableOpacity
          key={item.value}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: isMaterialConfigured(item.value) ? '#e8f5e9' : 'transparent',
            padding: 10,
            marginHorizontal: 15,
            marginVertical: 5,
            borderRadius: 8,
            borderWidth: isMaterialConfigured(item.value) ? 2 : 1,
            borderColor: isMaterialConfigured(item.value) ? 'green' : '#ccc',
          }}
          onPress={() => handleMaterialPress(item)}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: isMaterialConfigured(item.value) ? 'green' : 'black',
                fontWeight: isMaterialConfigured(item.value) ? 'bold' : 'normal',
                fontSize: 16,
              }}
            >
              {item.label}
            </Text>
            {isMaterialConfigured(item.value) && (
              <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                {materialsData.find(m => m.value === item.value)?.sacolas || 0} sacolas, {materialsData.find(m => m.value === item.value)?.caixas || 0} caixas, {materialsData.find(m => m.value === item.value)?.peso || 0} kg
              </Text>
            )}
          </View>
          {isMaterialConfigured(item.value) && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleRemoveMaterial(item.value);
              }}
              style={{ padding: 5 }}
            >
              <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
        <sizedbox.SizedBox vertical={30} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={nextPage}>
          <Text style={styles.text }>Próximo</Text>
        </TouchableOpacity>
            </View>
            <sizedbox.SizedBox vertical={30} />
      </ScrollView>

      {/* Modal/BottomSheet para inserir dados do material */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 15,
            maxHeight: '80%',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <RNScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: Colors[Theme][2] }}>
                {selectedMaterial?.label}
              </Text>
              
              <Text style={{ fontSize: 14, marginBottom: 10, color: Colors[Theme][2] }}>
                Informe as quantidades para este material:
              </Text>

              <Text style={{ fontSize: 14, marginTop: 15, marginBottom: 5, color: Colors[Theme][2] }}>
                Número de Sacolas
              </Text>
              <TextInput
                style={styles.inputModal}
                value={tempSacolas}
                onChangeText={setTempSacolas}
                placeholder="Ex: 2"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
              />

              <Text style={{ fontSize: 14, marginTop: 15, marginBottom: 5, color: Colors[Theme][2] }}>
                Número de Caixas
              </Text>
              <TextInput
                style={styles.inputModal}
                value={tempCaixas}
                onChangeText={setTempCaixas}
                placeholder="Ex: 1"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
              />

              <Text style={{ fontSize: 14, marginTop: 15, marginBottom: 5, color: Colors[Theme][2] }}>
                Peso Estimado (kg)
              </Text>
              <TextInput
                style={styles.inputModal}
                value={tempPeso}
                onChangeText={setTempPeso}
                placeholder="Ex: 4"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 10 }}>
                <TouchableOpacity
                  style={[styles.buttonModal, { backgroundColor: '#ccc' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonModal, { backgroundColor: Colors[Theme][2] }]}
                  onPress={handleSaveMaterial}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </RNScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
      </GestureHandlerRootView>

  );
}