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

  const { tipo, endereco, caixas, sacolas, peso, dia, hora, observacao } = route.params;
  const materialsTypes = tipo.map(type => type.label).join(", ");
  const materialsTypesValues = tipo.map(type => type.value).join(", ");

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

  async function addNewDocument(tipo, caixas, dia, hora, observacao, peso, sacolas) {
    try {
      const userData = {
        id: donorState.id || "none",
        name: donorState.name || "none",
        photoUrl: donorState.photoUrl || "none",
      };
      
      const newDocRef = await push(ref(database, 'recyclable'), {
        types: tipo,
        boxes: parseInt(caixas),
        times: hora,
        weekDays: dia,
        address: addressObj,
        observation: observacao,
        weight: peso,
        bags: parseInt(sacolas),
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
        <Text style={styles.labelText}>Material: {materialsTypes}</Text>
        <Text style={styles.labelText}>Quantidade: {caixas} caixas e {sacolas} sacolas</Text>
        <Text style={styles.labelText}>Endereço: {endereco}</Text>
        <Text style={styles.labelText}>Coletas: dia {dia} e hora {hora}</Text>
        <Text style={styles.labelText}>Observação: {observacao}</Text>
        <SizedBox vertical={30} />
        <TouchableOpacity
          style={styles.button2}
          onPress={() =>
            addNewDocument(
              materialsTypesValues,
              caixas,
              dia,
              hora,
              observacao,
              peso,
              sacolas
            )
          }
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
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
