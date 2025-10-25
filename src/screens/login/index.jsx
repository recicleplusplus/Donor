import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { SizedBox } from 'sizedbox';
import { supabase } from "../../lib/supabaseClient";

import { Size20, Size50, Size16, FontRegular } from "../../constants/scales";
import { ContainerTop, ContainerData } from "../../components/containers";
import { ButtonDefault, ButtonImage } from "../../components/buttons";
import { Colors, Theme } from "../../constants/setting";
import { InputIcon } from "../../components/inputs";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import { Styles } from "./style";
import { useTheme } from 'react-native-paper';

export function Login() {

    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [pass, setPass]   = useState("");

    const [hide, setHide]       = useState(true);
    const navigation            = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(false);
    const [emailErr, setEmailErr] = useState("");
    const [passErr, setPassErr]   = useState("");
    const img = require("../../../assets/images/googleLogo.png");

    function openScreen() {
        navigation.navigate('Sign');
    }

    async function login() {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: pass,
            });
            if (error) throw error;
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }
    
    function loginWithGoogle() {
        alert("Login com Google ainda não implementado.");
    }

    return (
        <View style={Styles.container}>
            {error && <Error error={error} closeFunc={() => setError(false)} />}
            {loading && <Loading />}
            <ScrollView>
                <ContainerTop />
                <ContainerData title={"Login"}>
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
                        cb={() => setHide(!hide)}
                        secureTextEntry={hide}
                    />
                    <SizedBox vertical={10} />
                    <ButtonDefault
                        title={"Entrar"}
                        fun={login}
                        color={theme.colors.secondaryButtonColor}
                        textColor={theme.colors.buttonTextColor}
                        textSize={Size20}
                        width={0.7}
                    />
                    <SizedBox vertical={5} />
                    <ButtonDefault
                        title={"Cadastrar"}
                        fun={openScreen}
                        color={theme.colors.secondaryButtonColor}
                        textColor={theme.colors.buttonTextColor}
                        textSize={Size20}
                        width={0.7}
                        opacity={0.7}
                    />
                    <SizedBox vertical={Size20} />
                    <Text style={{ marginBottom: Size16, fontSize: Size16, color: Colors[Theme][5], ...FontRegular }}> Ou, fazer login com </Text>
                    <ButtonImage
                        imageSrc={img}
                        width={Size50}
                        height={Size50}
                        fun={loginWithGoogle}
                    />
                </ContainerData>
            </ScrollView>
        </View>
    );
}