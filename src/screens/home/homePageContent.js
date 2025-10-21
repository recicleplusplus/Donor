import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGetDonorStatistics } from "./hooks/useGetDonorStatistics";
import { Colors, Theme } from "../../constants/setting";
import { View, ScrollView, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from 'react';
import { HomeHeader } from '../../components/home/HomeHeader';
import { DonationCard } from '../../components/home/DonationCard';

export function HomePageContent({ donorState, userImage, recentDonations }) {
    const navigation = useNavigation();
    const { statistics, loading: statsLoading, error: statsError } = useGetDonorStatistics(donorState.id);

    const renderStatistics = () => {
        if (statsLoading) {
            return <ActivityIndicator size="large" color={Colors[Theme][2]} style={{ marginVertical: 20 }} />;
        }
        if (statsError || !statistics || statistics.collectionsCompleted === 0) {
            return (
                <View style={styles.centeredMessage}>
                    <Text style={styles.emptyText}>
                        Nenhuma doação completada ainda. Cadastre sua primeira coleta ou aguarde até que sua coleta cadastrada seja coletada!
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.statisticsContainer}>
                <View style={styles.statisticItem}>
                    <Text style={styles.statisticValue}>{statistics.collectionsCompleted}</Text>
                    <Text style={styles.statisticLabel}>Coletas Completadas</Text>
                </View>
                {statistics.materialTotals.map((material) => (
                    material.totalKg > 0 && (
                        <View style={styles.statisticItem} key={material.name}>
                            <Text style={styles.statisticValue}>{material.totalKg.toFixed(2)} kg</Text>
                            <Text style={styles.statisticLabel}>{material.name}</Text>
                        </View>
                    )
                ))}
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors[Theme][0] }}>
            <ScrollView>
                <HomeHeader donorName={donorState.name} userImage={userImage} />
                
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Minhas Estatísticas</Text>
                </View>
                {renderStatistics()}

                <View style={styles.mainButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DonationCreation')}>
                        <MaterialCommunityIcons name="recycle" size={28} color="white" />
                        <Text style={styles.buttonText}>Agendar Nova Coleta</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Últimas Coletas</Text>
                </View>
                <FlatList
                  horizontal
                  data={recentDonations}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <DonationCard item={item} />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum histórico para exibir.</Text>
                  }
                />
            </ScrollView>
        </GestureHandlerRootView>
    );
}

// --- ESTILOS CORRIGIDOS ---
const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 20,
    // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
    // Aumentamos a margem superior para criar mais espaço abaixo do header.
    marginTop: 50, 
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors[Theme][2],
    fontWeight: 'bold',
    fontSize: 18,
  },
  centeredMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: Colors[Theme][5],
    paddingLeft: 20, // Adicionado padding para o texto de "nenhum histórico"
  },
  mainButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20, // Aumentado o espaço abaixo do botão
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors[Theme][2],
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statisticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  statisticItem: {
    alignItems: 'center',
    margin: 10,
    minWidth: 100,
  },
  statisticValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors[Theme][4],
  },
  statisticLabel: {
    fontSize: 12,
    color: Colors[Theme][5],
    marginTop: 2,
  },
});