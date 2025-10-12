import { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { SizedBox } from 'sizedbox';
import { supabase } from "../../lib/supabaseClient";

import { ContainerTop, ContainerData } from "../../components/containers";
import { InputIcon, InputIconMask } from "../../components/inputs";
import { ButtonDefault } from "../../components/buttons";
import { Colors, Theme } from "../../constants/setting";
import { Loading } from "../../components/loading";
import { Size20 } from "../../constants/scales";
import { Error } from "../../components/error";
import { Styles } from "./style";

import * as Validation from "../../utils/validation";
import * as Errors from "../../constants/erros";
import * as Mask from "../../utils/marksFormat";

export function Sign() {
  
    const [name, setName]     = useState("");
    const [phone, setPhone]   = useState("");
    const [email, setEmail]   = useState("");
    const [pass, setPass]     = useState("");

    const [hide, setHide]         = useState(true);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(false);

    const [nameErr, setNameErr]   = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [phoneErr, setPhoneErr] = useState("");
    const [passErr, setPassErr]   = useState("");

    function validation() {
        let hasError = false;
        if (Validation.nameValidation(name)) { setNameErr(Errors.nameErr); hasError = true; }
        if (Validation.emailValidation(email)) { setEmailErr(Errors.emailErr); hasError = true; }
        if (Validation.phoneValidation(phone)) { setPhoneErr(Errors.phoneErr); hasError = true; }
        if (Validation.passValidation(pass)) { setPassErr(Errors.passErr); hasError = true; }
        return hasError;
    }

    async function sign() {
        if (validation()) return;
        setLoading(true);
        try {
            const { data, error: authError } = await supabase.auth.signUp({ email, password: pass });
            if (authError) throw authError;

            const { error: profileError } = await supabase.from('users').insert({
                id: data.user.id,
                name: name,
                email: email,
                phone: phone,
                role: 'donor',
            });
            if (profileError) throw profileError;

            Alert.alert("Cadastro realizado!", "Verifique seu e-mail para confirmar a conta.");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={Styles.container}>
            {error && <Error error={error} closeFunc={() => setError(false)} />}
            {loading && <Loading />}
            <ScrollView>
                <ContainerTop />
                <ContainerData title={"Cadastro"}>
                    <InputIcon
                        onChangeText={(value) => { setName(value); setNameErr("") }}
                        value={name}
                        placeholder={"Digite seu nome"}
                        label="Nome"
                        icon="account"
                        errorMsg={nameErr}
                    />
                    <InputIconMask
                        onChangeText={(value) => { setPhone(value); setPhoneErr("") }}
                        value={phone}
                        placeholder={"Digite seu contato"}
                        keyboardType={"number-pad"}
                        label="Contato"
                        icon="cellphone"
                        mask={Mask.phoneMask}
                        errorMsg={phoneErr}
                    />
                    <InputIcon
                        onChangeText={(value) => { setEmail(value); setEmailErr("") }}
                        value={email}
                        placeholder={"Digite seu email"}
                        label="Email"
                        icon="email-outline"
                        errorMsg={emailErr}
                    />
                    <InputIcon
                        onChangeText={(value) => { setPass(value); setPassErr("") }}
                        value={pass}
                        placeholder={"Digite sua senha"}
                        label="Senha"
                        icon={hide ? "eye-outline" : "eye-off-outline"}
                        errorMsg={passErr}
                        btn={true}
                        cb={() => setHide(!hide)} // Lógica de esconder/mostrar senha
                        secureTextEntry={hide}
                    />
                    <SizedBox vertical={10} />
                    <ButtonDefault
                        title={"Cadastrar"}
                        color={Colors[Theme][2]}
                        textColor={Colors[Theme][7]}
                        textSize={Size20}
                        width={0.7}
                        fun={sign}
                    />
                </ContainerData>
            </ScrollView>
        </View>
    );
}