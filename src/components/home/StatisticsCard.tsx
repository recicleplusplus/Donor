import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { Colors, Theme } from "../../constants/setting";
import { StatisticsCardProps, BarData } from '../../types/donor_types';
import { buildBarGraphicData } from '../../screens/home/utils';
import SizedBox from '../SizedBox';

export function StatisticsCard({ donorStatistics, styles }: StatisticsCardProps): JSX.Element {
  const barData = buildBarGraphicData(donorStatistics);

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.card}>
          <View style={{ alignItems: 'center', minHeight: 125, justifyContent: 'center' }}>
            {!donorStatistics || donorStatistics.collectionsCompleted === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: Colors[Theme][2], textAlign: 'center', padding: 20, fontWeight: 'bold' }}>
                  Não há estatísticas...
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 }}>
                <View style={styles.barContainer}>
                  {barData.map((bar, index) => (
                    <View key={index} style={styles.bar}>
                      <View style={[styles.barFill, { height: Math.max(0, Number.isFinite(bar.height) ? bar.height : 0), backgroundColor: bar.color }]}>
                        <Text style={styles.barText}>{bar.value}</Text>
                      </View>
                      <Text style={styles.legend}>{bar.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <SizedBox vertical={2} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors[Theme][2], textAlign: 'right', padding: 20, fontWeight: 'bold' }}>{(donorStatistics?.collectionsCompleted ?? 0) + " Doações Concluídas"}</Text>
      </View>
    </>
  );
}