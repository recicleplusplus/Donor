import { useEffect, useState } from "react";
import { getTopDonorsByDonations } from "../../firebase/providers/donor";
import { View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";

interface TopDonor {
  id: string;
  name: string;
  collectionsCompleted: number;
  points: number;
}

export default function TopDonatorsRanking() {
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        console.log('Buscando os 5 doadores com mais doações...');
        const topDonorsData = await getTopDonorsByDonations();
        console.log('Top 5 doadores com detalhes:', topDonorsData);

        setTopDonors(topDonorsData);
        setLoadingRanking(false);
      } catch (error) {
        console.error('Erro ao buscar top doadores:', error);
        setLoadingRanking(false);
      }
    };

    fetchTopDonors();
  }, []);

  const getRankingEmoji = (position: number): string => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}º`;
    }
  };

  return (
    <View style={{
      padding: 20,
      backgroundColor: '#FEFDFB',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginBottom: 20
    }}>
      {loadingRanking ? (
        <Text style={{ textAlign: 'center', color: '#666', fontSize: 16 }}>
          Carregando ranking...
        </Text>
      ) : topDonors.length > 0 ? (
        topDonors.map((donor, index) => (
          <React.Fragment key={donor.id}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 15,
              minHeight: 60
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                marginRight: 10
              }}>
                <View style={{
                  width: 50,
                  alignItems: 'center',
                  marginRight: 10
                }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: index < 3 ? '#FFD700' : '#666'
                  }}>
                    {getRankingEmoji(index + 1)}
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' }}
                  numberOfLines={2}
                >
                  {donor.name}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4CAF50' }}>
                  {donor.collectionsCompleted} doações
                </Text>
              </View>
            </View>
            {index < topDonors.length - 1 && (
              <View style={{ height: 1, backgroundColor: '#e2e2e2', marginVertical: 4 }} />
            )}
          </React.Fragment>
        ))
      ) : (
        <Text style={{ textAlign: 'center', color: '#666', fontSize: 16 }}>
          Nenhum doador encontrado no ranking ainda.
        </Text>
      )}
    </View>
  );
}