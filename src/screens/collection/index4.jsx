import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { ContainerTop, ContainerTopRegister4 } from "../../components/containers";
import { Colors,Theme } from "../../constants/setting";
import { SizedBox } from 'sizedbox';
import { firebaseApp } from "firebase/firestore";
import { getDatabase, push, ref } from "firebase/database";
import { DonorContext } from "../../contexts/donor/context";
import { useContext } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function Collection4({route}) {
  const {donorState, donorDispach} = useContext(DonorContext)
  const basedImage = require("../../../assets/images/profile2.webp");
  const navigation = useNavigation();
  const database = getDatabase(firebaseApp);

  const user = {
    id: donorState.id,
    name: donorState.name,
    photoUrl: donorState.photoUrl,
  };

  const coletor = {
    id: "none",
    name: "none",
    photoUrl: require("../../../assets/images/profile.jpg"),
  };

  const { tipo, endereco, caixas, sacolas, peso, dia, hora, observacao } = route.params;
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

  async function addNewDocument(tipo, caixas, dia, hora, endereco, observacao, peso, sacolas, user, coletor) {
    try {
      const userData = {
        id: user?.uid || "none",
        name: user?.name || "none",
        photoUrl: user?.photoUrl || require("../../../assets/images/profile.jpg"),
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
        collector: coletor,
      });
  
      console.log('Documento adicionado com ID:', newDocRef.key);
      navigation.navigate('Home');
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
        <Text style={styles.labelText}>Material: {tipo}</Text>
        <Text style={styles.labelText}>Quantidade: {caixas} caixas e {sacolas} sacolas</Text>
        <Text style={styles.labelText}>Endereço: {endereco}</Text>
        <Text style={styles.labelText}>Coletas: dia {dia} e hora {hora}</Text>
        <Text style={styles.labelText}>Observação: {observacao}</Text>
        <SizedBox vertical={30} />
        <TouchableOpacity style={styles.button2} onPress={() => addNewDocument(tipo, caixas, dia, hora, endereco, observacao, peso, sacolas, user, coletor)}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <SizedBox vertical={30} />
      </View>
    </ScrollView>
    </GestureHandlerRootView>

  );
}
