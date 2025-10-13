import React, { useEffect, useState } from "react";
import { ScrollView, View, Image } from "react-native";
import { Text } from "react-native-paper";
import { Material } from "../../firebase/instances/material";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import TopDonatorsRanking from "./TopDonatorsRanking";
import SizedBox from "../../components/SizedBox";

interface PointsPageContentProps {
  materials: Record<string, Material>;
  donorPoints: number;
}

export default function PointsPageContent(Props: PointsPageContentProps) {
  const { materials, donorPoints } = Props;
  const navigation = useNavigation() as any;
  const materialValues = Object.values(materials);

  return (
    <>
      <Header
        title="Voltar"
        rightElementText="Loja"
        rightElementIcon="store"
        onRightElementPress={() => navigation.navigate('Store', { donorPoints })}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{
          padding: 20,
          backgroundColor: '#EFE9DD',
          borderRadius: 10,
          height: 200,
          marginBottom: 20
        }}>
          <View style={{ paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>Voce Possui:</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{donorPoints} 🍃</Text>
          </View>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>As folhas 🍃 são pontos que você ganha toda vez que doa materiais recicláveis. Com elas, você pode trocar por produtos incríveis na nossa loja e ainda fazer a diferença para o meio ambiente.</Text>
        </View>
        <SizedBox height={20} />

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>🏆 Ranking dos Top Doadores</Text>
        <TopDonatorsRanking />
        <SizedBox height={20} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Valores dos Materiais</Text>
        <View style={{
          padding: 20,
          backgroundColor: '#FEFDFB',
          borderRadius: 10,
          flex: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginBottom: 20
        }}>
          {materialValues.map((item, index) => (
            <React.Fragment key={index}>
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
                  <Image
                    source={{ uri: item.iconUrl }}
                    style={{ width: 40, height: 40, resizeMode: 'contain', marginRight: 10 }}
                  />
                  <Text
                    style={{ fontSize: 16, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' }}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                  {item.points.donor} 🍃
                </Text>
              </View>
              {index < materialValues.length - 1 && (
                <View style={{ height: 1, backgroundColor: '#e2e2e2', marginVertical: 4 }} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </>
  );
}