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

  const basedImage                       = require("../../../assets/images/profile2.webp");
  const [image, setImage]                = useState(basedImage);

  // UseEffect  functions
  useEffect(()=>{
    setName(donorState.name);
    setPhone(donorState.phone); 
  },[]);

  useEffect(()=>{
    setImage(donorState.photoUrl 
      ? {uri: donorState.photoUrl} 
      : basedImage);
  },[donorState.photoUrl]);
   
  // Image Profile functions
  async function changeProfileImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });  

    if (!result.canceled) {
      const source = {uri: result.assets[0].uri}
      setImage(source);
      setloading(true);
      donorDispach({type: Types.LOADIMAGE, uri: source.uri, cb: changeImageCB})
    }
  }
  function changeImageCB (state, error) {
    if(state){
      setError(error);
    }else {
      donorDispach({type:Types.SETIMAGE, payload: error})
      donorDispach({type: Types.UPDATE, data: {...donorState, photoUrl: error}, dispatch: donorDispach, cb:updateCB});
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
  function confirmChanges(){
    if(validation()){
      donorDispach({type: Types.UPDATE, data: {...donorState, 'name': name, 'phone': phone}, dispatch: donorDispach, 
                            cb:updateCB});
      setloading(true);
    }
  }
  function updateCB(status, err){
    if(status){setError(err)};  
    setloading(false); 
    setEditProf(false)
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
  function addAddress(idex = -1){
    setIndex(idex);
    setResgister((last) => !last);
  }
  function removeAddress(index){
    let address = donorState.address;
    address.splice(index, 1)
    donorDispach({type: Types.UPDATEADDRESS, payload: address});
    donorDispach({type: Types.UPDATE, data: {...donorState, 'address':address}, dispatch: donorDispach, cb:removeAddressCb});
  }
  function removeAddressCb(status, err){
    if(status){setError(err)};  
      setloading(false); 
  }

  return (
    <View style={Styles.container}>

      {error && <Error error={error} closeFunc={()=>setError(false)}/>}
      {loading && <Loading/>}
      {register && <RegisterAddress data={donorState} dispach={donorDispach} closeFunc={() => setResgister(false)} idx={index}/>}

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
          img={image}
          fun={changeProfileImage}
          color={Colors[Theme][5]}
          bgColor={Colors[Theme][0]}
        />

        {/* <View style={Styles.row}>
          <ButtonIcon 
            btn = {true}
            name={ Theme == "dark" ? 'lightbulb-on-outline' : 'lightbulb-off-outline'}
            color={Colors[Theme][5]}
            margin={22}
            size={Size28}
            fun={ChangeTheme}
          /> */}
          <ButtonIcon 
            btn = {true}
            name={"square-edit-outline"}
            color={Colors[Theme][5]}
            margin={22}
            size={Size28}
            fun={editProfile}
          />
        {/* </View> */}

        <View style={{...Styles.containerEdit, opacity: editProf ? 1 : 0.6}}>
          <InputIcon
            enable = {editProf} 
            onChange = {(value) => {setName(value); setNameErr("")}}
            value = {name}
            placeholder = {"Digite seu nome"}
            label = "Nome"
            icon = "account"
            errorMsg={nameErr}
          />
          <InputIconMask 
            enable = {editProf}
            onChange = {(value) => {setPhone(value); setPhoneErr("");}}
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
            fun={addAddress}
          />
        </View>
        <View style={Styles.containerEdit}>
          {donorState.address.map((address, index) => {
            return (
              <AddressCard address={address} editFn={() => addAddress(index)} removeFn={() => removeAddress(index)} key={index}/>
            );
          })}

        </View>

      </ScrollView>
    </View>
  );
}
