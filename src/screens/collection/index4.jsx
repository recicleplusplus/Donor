import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { ContainerTop, ContainerTopRegister4 } from "../../components/containers";
import { SizedBox } from 'sizedbox';
import { firebaseApp } from "firebase/firestore";
import { getDatabase, push, ref } from "firebase/database";
import { DonorContext } from "../../contexts/donor/context";
import { useContext, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Snackbar } from "react-native-paper";

export function Collection4({route}) {
  const {donorState, donorDispach} = useContext(DonorContext)
  const navigation = useNavigation();
  const database = getDatabase(firebaseApp);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { materialsData, endereco, dia, hora, observacao } = route.params;

  const addressArray = endereco.split(", ");

  const addressObj = {
    name: addressArray[0],
    street: addressArray[1],
    neighborhood: addressArray[2],
    city: addressArray[3],
    reference: addressArray[4],
    num: parseInt(addressArray[5]),
    cep: addressArray[6],
    latitude: parseFloat(addressArray[7]),
    longitude: parseFloat(addressArray[8]),
    state: addressArray[9],
  };

  const showSnackbar = () => {
    setSnackbarMessage("Documento adicionado com sucesso!");
    setVisible(true);
    setTimeout(() => setVisible(false), 2000); // Fecha após 2 segundos
  };

  async function addNewDocument(materialsData, dia, hora, observacao) {
    try {
      const userData = {
        id: donorState.id || "none",
        name: donorState.name || "none",
        photoUrl: donorState.photoUrl || "none",
      };
      
      const newDocRef = await push(ref(database, 'recyclable'), {
        materials: materialsData,
        times: hora,
        weekDays: dia,
        address: addressObj,
        observation: observacao,
        donor: userData,
        status: "pending",
        collector: {
          id: "none",
          name: "none",
          photoUrl: "none"
        },
      });
  
      console.log('Documento adicionado com ID:', newDocRef.key);
      showSnackbar();
      setTimeout(() => {
        navigation.navigate('HomeStack');
      }, 2000);
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView>
      <ContainerTop />
      <ContainerTopRegister4 />
      <View style={styles.container}>
        <Text style={styles.titleText}>Resumo da Coleta</Text>
        
        {/* Seção de Materiais */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📦 Materiais</Text>
          {materialsData.map((material, index) => (
            <View key={index} style={styles.materialItem}>
              <Text style={styles.materialName}>{material.label}</Text>
              <Text style={styles.materialDetailsText}>
                🛍️ {material.sacolas} sacolas  •  📦 {material.caixas} caixas  •  ⚖️ {material.peso} kg
              </Text>
            </View>
          ))}
        </View>

        {/* Seção de Endereço */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📍 Endereço</Text>
          <Text style={styles.infoText}>{endereco.split(', ').slice(0, 3).join(', ')}</Text>
          {endereco.split(', ').length > 3 && (
            <Text style={styles.infoTextSecondary}>{endereco.split(', ').slice(3).join(', ')}</Text>
          )}
        </View>

        {/* Seção de Disponibilidade */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📅 Disponibilidade</Text>
          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Dias:</Text>
            <Text style={styles.availabilityValue}>{dia || 'Não informado'}</Text>
          </View>
          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Horários:</Text>
            <Text style={styles.availabilityValue}>{hora || 'Não informado'}</Text>
          </View>
        </View>

        {/* Seção de Observação */}
        {observacao && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📝 Observações</Text>
            <Text style={styles.infoText}>{observacao}</Text>
          </View>
        )}

        <SizedBox vertical={20} />
        <TouchableOpacity
          style={styles.button2}
          onPress={() =>
            addNewDocument(
              materialsData,
              dia,
              hora,
              observacao
            )
          }
        >
          <Text style={styles.buttonText}>Confirmar Cadastro</Text>
        </TouchableOpacity>
        <SizedBox vertical={30} />
      </View>
    </ScrollView>
    <Snackbar
      visible={visible}
      onDismiss={() => setVisible(false)}
      action={{
        label: 'Fechar',
        onPress: () => setVisible(false),
      }}
    >
      {snackbarMessage}
    </Snackbar>
    </GestureHandlerRootView>

  );
}
