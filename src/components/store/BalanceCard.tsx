import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BalanceCard({ donorPoints }: { donorPoints: number }): JSX.Element {
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceLabel}>Suas Folhas 🍃</Text>
        <Text style={styles.balanceAmount}>{donorPoints}</Text>
      </View>
      <Text style={styles.balanceDescription}>
        Continue doando materiais recicláveis para ganhar mais folhas!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  balanceDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});