import 'react-native-url-polyfill/auto'; // necessario para o supabase
import React from 'react';

import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";

import { Routes } from "./src/routes/index";

export default function App() {
  const [fontLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontLoaded) {
    return null; 
  }

  return <Routes />;
}