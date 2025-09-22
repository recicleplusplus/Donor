import { useNavigation } from "@react-navigation/native";
import { TextInput ,Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { styles, pickerSelectStyles } from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { ContainerTop, ContainerTopRegister } from "../../components/containers";
import { Colors,Theme } from "../../constants/setting";
import { useContext, useState, useEffect } from "react";
import * as sizedbox from 'sizedbox';
import { Checkbox } from 'react-native-paper';
import { DonorContext } from "../../contexts/donor/context";
import { AddressCard2 } from "../address/components/card";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function Collection({ route }) {
  const navigation = useNavigation();
  const [checkString, setCheckedString] = useState([]);
  const { donorState, donorDispatch } = useContext(DonorContext);
  const [checkedItems, setCheckedItems] = useState([]);

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
    const addressString = checkString.map((addressTitle) => {
      const address = donorState.address.find((item) => item.title === addressTitle);
      return `${address.title}, ${address.street}, ${address.neighborhood}, ${address.city}, ${address.reference}, ${address.num}, ${address.cep}, ${address.latitude}, ${address.longitude}, ${address.state}`;
    }).join(";");

    navigation.navigate('Collection2', { tipo: checkedItems, endereco: addressString });
  };

  const handleCheckboxChange = (item) => {
    const isChecked = checkedItems.some(checkedItem => checkedItem.value === item.value);
    if (isChecked) {
      setCheckedItems(checkedItems.filter((checkedItem) => checkedItem.value !== item.value));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
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
        </View>
        <View>
      {itens.map((item) => (
        <View
          key={item.value}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Checkbox
            status={checkedItems.some(checkedItem => checkedItem.value === item.value) ? 'checked' : 'unchecked'}
            onPress={()=>handleCheckboxChange(item)}
            color={'green'}
            uncheckColor={'red'}
          />
          <Text
            style={{
              marginLeft: 8,
              color: checkedItems.some(checkedItem => checkedItem.value === item.value) ? 'green' : 'black',
              fontWeight: checkedItems.some(checkedItem => checkedItem.value === item.value) ? 'bold' : 'normal',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
        <sizedbox.SizedBox vertical={30} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={nextPage}>
          <Text style={styles.text }>Cadastrar</Text>
        </TouchableOpacity>
            </View>
            <sizedbox.SizedBox vertical={30} />
      </ScrollView>
      </GestureHandlerRootView>

  );
}