import { View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { Height, Size20, Width } from "../../constants/scales";
import { Colors, Theme } from "../../constants/setting";
import { ButtonDefault } from "../../components/buttons";
import { TitleColorSmall } from "../../components/titles";
import { SizedBox } from "sizedbox";
import { InputIcon, InputIconMask } from "../../components/inputs";
import * as Mask from "../../utils/marksFormat";
import { cepValidation } from "../../utils/validation";
import { useEffect, useState } from "react";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import * as Types from "../../contexts/donor/types";
import { supabase } from "../../lib/supabaseClient";
import { useDonor } from "../../contexts/donor";



export const RegisterAddress = ({ addressToEdit, closeFunc, onSaveCallback, donorDispach }) => {

    const [title, setTitle]                 = useState("");
    const [cep, setCep]                     = useState("");
    const [street, setStreet]               = useState("");
    const [num, setNum]                     = useState("");
    const [city, setCity]                   = useState("");
    const [state, setState]                 = useState("");
    const [neighborhood, setNeighborhood]   = useState("");
    const [complement, setComplement]       = useState("");

    const [head, setHead]                   = useState("Cadastro de Endereço")
    const [error, setError]                 = useState(false);
    const [loading, setLoading]             = useState(false);

    const [titleErr, setTitleErr]           = useState("");
    const [cepErr, setCepErr]               = useState("");
    const [streetErr, setStreetErr]         = useState("");
    const [numErr, setNumErr]               = useState("");
    const [cityErr, setCityErr]             = useState("");
    const [stateErr, setStateErr]           = useState("");

    const isEditing = !!(addressToEdit && addressToEdit.id); // Determina se é modo de edição

    useEffect(() => {
        if (isEditing) {
            setTitle(addressToEdit.title)
            setCep(addressToEdit.cep)
            setStreet(addressToEdit.street)
            setNum(addressToEdit.num)
            setNeighborhood(addressToEdit.neighborhood)
            setCity(addressToEdit.city)
            setState(addressToEdit.state)
            setComplement(addressToEdit.complement)
            setHead("Edição de Endereço")
        } else {
            setHead("Cadastro de Endereço");
        }
    }, []);

    async function validation(){
        let res = true;
        const phase = "Campo Obrigatório"

        if(title  == ''){setTitleErr(phase);res = false;}
        if(street == ''){setStreetErr(phase); res = false;}
        if(num    == ''){setNumErr(phase); res = false;}
        if(state  == ''){setStateErr(phase); res = false;}
        if(city   == ''){setCityErr(phase); res = false;}
        if(cepValidation(cep)) {setCepErr("Cep inválido"); res = false;}

        // função de validação não depende mais da API de geolocalização
        if (res) {
            await getGeoLocation();
        }

        return res;
    }

    // Botão confirmar foi pressionado
    async function confirmPressed() {
        
        setLoading(true);
        try {

             // Validação
            if (!await validation()) {
                setLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();

            const addressData = {
                title: title.trim(),
                cep: cep.replace(/[^0-9]/g, ""), 
                street: street.trim(),
                num: num.trim(),
                neighborhood: neighborhood.trim(),
                city: city.trim(),
                state: state.trim(),
                complement: complement.trim(),
                user_id: user.id // associar ao usuário logado
            };

            const { data: savedAddress, error } = isEditing 
            ? await supabase.from('addresses').update(addressData).eq('id', addressToEdit.id).select().single()
            : await supabase.from('addresses').insert(addressData).select().single();

            if (error) throw error;

            // Sucesso!
            // Despacha a ação para atualizar o estado global
            const actionType = isEditing ? Types.UPDATE_ADDRESS : Types.ADD_ADDRESS;
            donorDispach({ type: actionType, payload: savedAddress });
            
            // Chama o callback de sucesso para o Profile.js
            onSaveCallback(false, null, isEditing); 

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function updateCB(status, err){
        setLoading(false); 
        onSaveCallback(status, err);
        closeFunc();
    }
    function apiCep(){
        const nCep = cep.replace(/[^0-9]/gi, "");
        return `https://viacep.com.br/ws/${nCep}/json/`;
    }
    function getCepInf(){
        fetch(apiCep())
            .then((responseObj) => {
            responseObj.json()
                .then((data) => {
                    if(!data.erro){
                        setNeighborhood(data.bairro);
                        setCity(data.localidade);
                        setStreet(data.logradouro.substring(3));
                        setState(data.uf);
                    }
                });
        });
    }

    async function apiGeoLocation() {

        // parâmetros estruturados para passar para API
        const params = {
            city: city.trim(),
            state: state.trim(),
            country: 'Brazil',
            postalcode: cep.replace(/[^0-9]/gi, ""),
            format: 'json' 
        };

        const queryString = new URLSearchParams(params).toString();
        const url = `https://nominatim.openstreetmap.org/search?${queryString}`;
        
        // console.log("URL Estruturada:", url);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'seu-app/1.0'
            }
        });
        return response;
    }
    
    async function getGeoLocation() {
    try {
        console.log("Tentando obter geolocalização...");
        let responseObj = await apiGeoLocation();
        let data = await responseObj.json();

        // Se a API encontrar algo, preenchemos as variáveis
        if (data && data.length > 0) {
            latitud = `${data[0].lat}`;
            longitud = `${data[0].lon}`;
            console.log("Geolocalização encontrada:", latitud, longitud);
        } else {
            // Se não encontrar, apenas avisamos no console e seguimos em frente
            console.warn("API de geolocalização não encontrou coordenadas para este endereço.");
        }
        } catch (err) {
            // Se houver um erro de rede, também só avisamos e seguimos em frente
            console.error("Falha na chamada da API de geolocalização:", err);
        }
    }

    return(
        <View style={Style.default}>
            {loading && <Loading/>}
            {error && <Error error={error} closeFunc={()=>setError(false)}/>}

            <TouchableOpacity style={{...Style.default, ...Style.container}} onPress={closeFunc}></TouchableOpacity>
            <View style={Style.subcontainer}>
                <ScrollView>

                    <TitleColorSmall align={"center"} content={head}/>
                    <SizedBox vertical={5}/>

                    <InputIcon 
                        onChangeText = {(value) => {setTitle(value), setTitleErr("")}}
                        value = {title}
                        placeholder = {"Digite o título"}
                        label = "Titulo *"
                        flexS={0.78}
                        errorMsg={titleErr}
                    />

                    <View style={Style.row}>
                        <InputIconMask 
                            onChangeText = {(value) => {setCep(value); setCepErr('')}}
                            value = {cep}
                            placeholder = {"Digite o CEP"}
                            keyboardType={"number-pad"}
                            label = "CEP *"
                            mask={Mask.cepMask}
                            flexS={0.4}
                            errorMsg={cepErr}
                            onBlur={getCepInf}
                        />
                        <InputIcon 
                            onChangeText = {(value) => {setNum(value);setNumErr('')}}
                            value = {num}
                            placeholder = {"Digite o Nº"}
                            keyboardType={"number-pad"}
                            label = "Nº Endereço *"
                            flexS={0.35}
                            errorMsg={numErr}
                        />
                    </View>

                    <InputIcon 
                        onChangeText = {(value) => {setStreet(value); setStreetErr('')}}
                        value = {street}
                        placeholder = {"Digite o nome da rua"}
                        label = "Rua *"
                        flexS={0.78}
                        errorMsg={streetErr}
                    />

                    <View style={Style.row}>
                        <InputIcon 
                            onChangeText = {(value) => {setState(value); setStateErr('')}}
                            value = {state}
                            placeholder = {"Nome do estado"}
                            label = "Estado *"
                            flexS={0.375}
                            errorMsg={stateErr}
                        />
                        <InputIcon 
                            onChangeText = {(value) => {setCity(value); setCityErr('')}}
                            value = {city}
                            placeholder = {"Nome da cidade"}
                            label = "Cidade *"
                            flexS={0.375}
                            errorMsg={cityErr}
                        />
                    </View>

                    <View style={Style.row}>
                       <InputIcon 
                            onChangeText = {setNeighborhood}
                            value = {neighborhood}
                            placeholder = {"Nome do bairro"}
                            label = "Bairro"
                            flexS={0.375}
                        />
                         <InputIcon 
                            onChangeText = {setComplement}
                            value = {complement}
                            placeholder = {"Ex: Ap. 621, Fundo."}
                            label = "Complemento"
                            flexS={0.375}
                        />
                    </View>

                    <SizedBox vertical={5}/>
                    <View style={Style.row}>
                        <ButtonDefault
                            title={"Cancelar"}
                            padding={5}
                            width={0.35}
                            color={Colors[Theme][8]}
                            textColor={Colors[Theme][1]}
                            radius={16}
                            textSize={Size20*0.9}
                            fun={closeFunc}
                        />
                        <ButtonDefault
                            title={"Confirmar"}
                            padding={5}
                            width={0.35}
                            color={Colors[Theme][2]}
                            textColor={Colors[Theme][1]}
                            radius={16}
                            textSize={Size20*0.9}
                            fun={confirmPressed}
                        />
                    </View>
                </ScrollView>
                
            </View>
        </View>
    );
}

const Style = StyleSheet.create({
    default: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        elevation: 1,
        zIndex: 1,
        justifyContent: "center"
    },

    row:{
        width: Width*0.9-45,
        display: "flex",
        flexDirection:"row",
        justifyContent:"space-between",        
    },

    container:{  
        backgroundColor: Colors[Theme][4],
        opacity: 0.3,
        alignItems:"center",
    },
    
    subcontainer:{
        position: "absolute",
        elevation: 1,
        zIndex: 1,
        width: Width*0.9,
        maxHeight: Height*0.85,
        //height: Height * 0.4,
        backgroundColor: Colors[Theme][1],
        alignSelf: "center",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
})