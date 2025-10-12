import { Text, View, ScrollView } from "react-native";
import { useContext, useState, useEffect } from "react";

import { InputIcon,InputIconMask } from "../../components/inputs";
import { ContainerTopClean } from "../../components/containers";
import { DonorContext } from "../../contexts/donor/context";
import { ImageCircleIcon } from "../../components/images";
import * as ImagePicker from 'expo-image-picker';
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import { ButtonIcon, ButtonDefault } from "../../components/buttons";
import { Colors, Theme, ChangeTheme } from "../../constants/setting";
import { Size110, Size12, Size28 } from "../../constants/scales";
import { Styles } from "./style";
import * as Mask from "../../utils/marksFormat";
import * as Types from "../../contexts/donor/types";
import * as Errors from "../../constants/erros";
import * as Validation from "../../utils/validation";
import { RegisterAddress } from "../address";
import { AddressCard } from "../address/components/card";
import { Snackbar } from "react-native-paper";
import { supabase } from "../../lib/supabaseClient";

export function Profile() {
  const {donorState, donorDispach} = useContext(DonorContext)

  const [editProf, setEditProf]    = useState(false);

  const [name, setName]            = useState("");
  const [phone, setPhone]          = useState("")
  const [nameErr, setNameErr]      = useState("");
  const [phoneErr, setPhoneErr]    = useState("");

  const [error, setError]          = useState(false);
  const [loading, setloading]  = useState(false);
  const [register, setResgister]   = useState(false);
  const [index, setIndex]          = useState(-1);

  const basedImage                       = require("../../../assets/images/profile2.webp");;

  //snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarError, setIsSnackbarError] = useState(false);

  // UseEffect  functions
  useEffect(() => {
      if (donorState.name) setName(donorState.name);
      if (donorState.phone) setPhone(donorState.phone); 
    }, [donorState.name, donorState.phone]);

  const showSnackbar = (message, isError = false) => {
    setSnackbarMessage(message);
    setIsSnackbarError(isError);
    setSnackbarVisible(true);
  };

  // Image Profile functions
  async function changeProfileImage() {
    // 1. Abre a galeria para o usuário escolher a imagem
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (result.canceled) {
      return; // Usuário cancelou
    }
    
    setloading(true);
    try {
      const asset = result.assets[0];
      const fileExt = asset.uri.split('.').pop();
      const filePath = `${donorState.id}/profile.${fileExt}`; // Ex: 1234-abcd/profile.jpg

      // objeto FormData para o Supabase no React Native
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: `photo.${fileExt}`,
        // Ajuste para garantir um MimeType válido como 'image/jpeg' ou 'image/png'
        type: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
      });


      // 2. Faz o upload da imagem para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars') // Nome do "bucket" (pasta) no Storage
        .upload(filePath, formData, { upsert: true }); // upsert: true sobrescreve se já existir

      if (uploadError) throw uploadError;

      // 3. Pega a URL pública da imagem que acabamos de enviar
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

      // 4. Atualiza a coluna 'photo_url' do usuário na tabela 'users'
      const { error: updateError } = await supabase
        .from('users')
        .update({ photo_url: publicUrl })
        .eq('id', donorState.id);

      if (updateError) throw updateError;
      
      // 5. Avisa o reducer para atualizar a imagem na tela
      donorDispach({ type: Types.SETIMAGE, payload: publicUrl });
      showSnackbar("Imagem de perfil atualizada!");

    } catch (err) {
      
      console.error('ERRO NO UPLOAD:', JSON.stringify(err, null, 2));
      setError('Falha no upload da imagem. Verifique o console para mais detalhes.');
    } finally {
      setloading(false);
    }
  }


  // Edit Profile Functions
  function editProfile(){
    if(editProf){
      setName(donorState.name);
      setPhone(donorState.phone); 
    }
    setEditProf((value) => !value);
  }

  // Confirma a modificação do nome/numero de telefone do perfil
  async function confirmChanges() {
    if (!validation()) return; // A validação já mostra os erros
    
    setloading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: name, phone: phone })
        .eq('id', donorState.id);

      if (error) throw error;

      donorDispach({ 
        type: Types.SET_PROFILE_DATA, 
        payload: { name: name, phone: phone } 
      });
      
      showSnackbar("Perfil atualizado com sucesso!");
      setEditProf(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setloading(false);
    }
  }

  function validation(){
    let valid = true;
    if(Validation.nameValidation(name)) {
      setNameErr(Errors.nameErr);
      valid = false;
    }
    if(Validation.phoneValidation(phone)) {
      setPhoneErr(Errors.phoneErr);
      valid = false;
    }
    return valid;
  }

  // Signout Functions
  function signout(){
    donorDispach({type: Types.LOGOUT, cb:signoutCallBack})
  }
  function signoutCallBack (status, error = null) {
    if(status){
      donorDispach({type: Types.SETSIGNOUT});
    } else {
      setError(error);
    }
  }

  // Address Functions
  function openAddressModal(addressToEdit = null){
    // Se estamos editando, passamos o objeto. Se adicionando, passamos null.
    setIndex(addressToEdit); // Usaremos 'index' para armazenar o objeto a ser editado
    setResgister(true);
  }

  async function removeAddress(addressId) {
    setloading(true);
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      donorDispach({ type: Types.REMOVE_ADDRESS, payload: addressId });
      showSnackbar("Endereço removido com sucesso!");

    } catch (err) {
      showSnackbar("Erro ao remover endereço: " + err.message, true);
    } finally {
      setloading(false);
    }
  }

  function onSaveAddressCb(status, err, isEditing) {
    setResgister(false);
    setloading(false);
    if (status) { showSnackbar(err, true); }
    else {
      const message = isEditing ? "Endereço alterado com sucesso!" : "Endereço adicionado com sucesso!";
      showSnackbar(message);
    }
  }

  const imageSource = donorState.photoUrl ? { uri: donorState.photoUrl } : basedImage;

  return (
    <View style={{...Styles.container, flex: 1}}>

      {error && <Error error={error} closeFunc={()=>setError(false)}/>}
      {loading && <Loading/>}
        {register && <RegisterAddress
          addressToEdit={index}
          closeFunc={() => setResgister(false)}
          onSaveCallback={onSaveAddressCb}
          donorDispach={donorDispach}
        />}

      <ScrollView>
        <ContainerTopClean
          icon="exit-to-app"
          iconTxt="Sair"
          fun={signout}
        />

        <ImageCircleIcon
          size={Size110 * 1.25}
          sizeIcon={Size28}
          icon={"camera"}
          img={imageSource}
          fun={changeProfileImage}
          color={Colors[Theme][5]}
          bgColor={Colors[Theme][0]}
        />

          <ButtonIcon 
            btn = {true}
            name={"square-edit-outline"}
            color={Colors[Theme][5]}
            margin={22}
            size={Size28}
            fun={editProfile}
          />

        <View style={{...Styles.containerEdit, opacity: editProf ? 1 : 0.6}}>
          <InputIcon
            enable = {editProf} 
            onChangeText = {(value) => {setName(value); setNameErr("")}}
            value = {name}
            placeholder = {"Digite seu nome"}
            label = "Nome"
            icon = "account"
            errorMsg={nameErr}
          />
          <InputIconMask 
            enable = {editProf}
            onChangeText = {(value) => {setPhone(value); setPhoneErr("");}}
            value = {phone}
            placeholder = {"Digite seu contato"}
            keyboardType={"number-pad"}
            label = "Contato"
            icon = "cellphone"  
            mask={Mask.phoneMask}
            errorMsg={phoneErr}
          />

          {editProf && <ButtonDefault
            title={"Confirmar"}
            color={Colors[Theme][2]}
            fun={confirmChanges}
            width={1}
            radius={0}
            textColor={Colors[Theme][4]}
            padding={5}
            textSize={Size12}
          />}

        </View>

        

        <View style={Styles.rowAdd}>
          <Text style={Styles.titleAddress}>Endereços</Text>
          <ButtonIcon
            name={"plus"}
            color={Colors[Theme][4]}
            btn={true}
            size={Size28*1.3}
            fun={() => openAddressModal()}
          />
        </View>
        <View style={Styles.containerEdit}>
          {donorState.address && donorState.address.map((address) => {
            return (
              <AddressCard 
                address={address} 
                editFn={() => openAddressModal(address)}
                removeFn={() => removeAddress(address.id)}
                key={address.id}
              />
            );
          })}

        </View>

      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: isSnackbarError ? '#d32f2f' : '#4CAF50',
          marginBottom: 10
        }}
        action={{
          label: 'Fechar',
          textColor: '#FFFFFF',
          onPress: () => setSnackbarVisible(false),
        }}>
        <Text style={{ color: '#FFFFFF' }}>{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
}
