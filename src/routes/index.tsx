import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Provider as PaperProvider } from 'react-native-paper';

import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

import { Colors, Theme } from "../constants/setting";
import { TabsRoutes } from "./tab.routes";
import { LogRoutes } from "./log.routes"; 
import { DonorProvider } from '../contexts/donor';

export function Routes() {
    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: Colors[Theme][2],
            background: Colors[Theme][1]
        }
    };

    // A LÓGICA DE AUTH AGORA VIVE AQUI
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        }).finally(() => {
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Enquanto carrega a sessão, mostramos um loading
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <PaperProvider>
            <NavigationContainer theme={MyTheme}>
                {session && session.user ? (
                    // Se o usuário está logado, RENDERIZAMOS O PROVIDER
                    // envolvendo apenas as rotas que precisam dele.
                    <DonorProvider>
                        <TabsRoutes />
                    </DonorProvider>
                ) : (
                    // Se não está logado, apenas as rotas de login.
                    <LogRoutes />
                )}
            </NavigationContainer>
        </PaperProvider>
    );
}