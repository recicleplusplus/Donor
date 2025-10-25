import React, { useContext, useState, useEffect, useCallback } from "react";
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';

import { DonorContext } from "../../contexts/donor/context";
import { useGetRecentDonations } from "./hooks/useGetRecentDonations";
import { HomePageContent } from "./homePageContent";
import { Loading } from "../../components/loading";
import { ErrorPage } from "../../components/ErrorPage";
import { useProfileImage } from "./hooks/useProfileImage";
import { Colors, Theme } from "../../constants/setting";

export function Home({ }) {
  const { donorState } = useContext(DonorContext);
  const { image } = useProfileImage(donorState.photoUrl);
  
  const { donations, loading: donationsLoading, error: donationsError, refetch: refetchDonations } = useGetRecentDonations(donorState.id);
  
  const navigation = useNavigation();
  const route = useRoute();
  
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  // Ele "escuta" por mudanças nos parâmetros da rota
  useEffect(() => {
    // Se o sinal 'refresh' chegar...
    if (route.params?.refresh) {
      console.log('Sinal de atualização recebido, recarregando doações...');
      refetchDonations(); // ...recarrega a lista de doações
      
      // Se uma mensagem foi enviada, mostra a snackbar.
      if (route.params.snackbarMessage) {
        setSnackbar({ visible: true, message: route.params.snackbarMessage });
      }
      
      // Limpa os parâmetros para que a atualização não aconteça de novo sem necessidade.
      navigation.setParams({ refresh: false, snackbarMessage: null });
    }
  }, [route.params?.refresh, navigation, refetchDonations]); // Dependências do efeito

  if (donationsLoading && !donations.length) { // Mostra o loading apenas na primeira carga
    return <Loading />;
  }

  if (donationsError) {
    return <ErrorPage />;
  }

  return (
    <View style={{ flex: 1 }}> 
      <HomePageContent 
        donorState={donorState} 
        userImage={image} 
        recentDonations={donations}
      />
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={10000}
        style={{ 
          backgroundColor: Colors[Theme][9],
          marginBottom: 20 
        }}
        theme={{ colors: { inversePrimary: '#FFFFFF', onSurface: '#FFFFFF' } }} 
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}