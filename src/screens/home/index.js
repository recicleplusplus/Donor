import React, { useContext, useState, useEffect } from "react";
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';

import { DonorContext } from "../../contexts/donor/context";
import { useGetRecyclableDonorData } from "./hooks/useGetRecyclabeDonorData";
import { HomePageContent } from "./homePageContent";
import { Loading } from "../../components/loading";
import { ErrorPage } from "../../components/ErrorPage";
import { useProfileImage } from "./hooks/useProfileImage";
import { Colors, Theme } from "../../constants/setting";

export function Home({ }) {
  const { donorState } = useContext(DonorContext);
  const { image } = useProfileImage(donorState.photoUrl);
  const { data: recyclableDonorData, loading, error } = useGetRecyclableDonorData(donorState.id);
  
  const navigation = useNavigation();
  const route = useRoute();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Este useEffect "escuta" por mudanças nos parâmetros da rota
  useEffect(() => {
    if (route.params?.donationCreated) {
      setSnackbarVisible(true);
      navigation.setParams({ donationCreated: false });
    }
  }, [route.params?.donationCreated, navigation]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <View style={{ flex: 1 }}> 
      <HomePageContent 
        donorState={donorState} 
        recyclableDonorData={recyclableDonorData} 
        userImage={image} 
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={10000}
        style={{ 
          backgroundColor: Colors[Theme][9],
          marginBottom: 15 
        }}
        theme={{ colors: { inversePrimary: '#FFFFFF', onSurface: '#ffffffff' } }} 
      >
        Coleta agendada com sucesso!
      </Snackbar>
    </View>
  );
}