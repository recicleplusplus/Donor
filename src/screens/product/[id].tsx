import React, { useMemo, useState, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProductById } from '../../firebase/instances/products';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import { updateDonorPoints } from '../../firebase/providers/donor';
import { DonorContext } from '../../contexts/donor/context';
import * as Types from '../../contexts/donor/types';


export default function ProductPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = (route.params || {}) as { id: number | string };
  const donorContext = useContext(DonorContext as any) as any;
  const donorId = donorContext?.donorState?.id;
  const balance = donorContext?.donorState?.points ?? 0;
  const productId = useMemo(() => Number(id), [id]);
  const product = getProductById(productId);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const canSpend = (amount: number) => balance >= amount;

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#333' }}>Produto não encontrado.</Text>
        <TouchableOpacity style={[styles.ctaButton, { marginTop: 16 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.ctaText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRedeem = async () => {
    if (!product) return;
    if (!canSpend(product.price)) {
      setSnackbarMessage('Saldo insuficiente');
      setSnackbarVisible(true);
      return;
    }
    if (!donorId) {
      setSnackbarMessage('Não foi possível identificar o usuário.');
      setSnackbarVisible(true);
      return;
    }
    const newPoints = await updateDonorPoints(donorId, 0, product.price); // Subtrai os pontos
    if (typeof newPoints === 'number') {
      donorContext?.donorDispach?.({ type: Types.SETUPDATE, payload: { points: newPoints } });
      setSnackbarMessage('Resgate realizado com sucesso!');
      setSnackbarVisible(true);
    } else {
      setSnackbarMessage('Não foi possível atualizar seus pontos.');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.heroContainer}>
          {product.originalPrice > product.price && (
            <View style={styles.discountChip}>
              <Text style={styles.discountText}>
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Text>
            </View>
          )}
          <Image source={product.imageUrl as any} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{product.name}</Text>
          </View>

          {product.originalPrice ? (
            <Text style={styles.originalPrice}>{product.originalPrice} 🍃</Text>
          ) : null}
          <Text style={styles.price}>{product.price} 🍃</Text>

          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : null}
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Sustentabilidade</Text>
          <Text style={styles.sectionBody}>
            Produzido com materiais reciclados e cadeia de suprimentos com menor emissão de carbono.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>Saldo: <Text style={styles.balanceStrong}>{balance} 🍃</Text></Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, !canSpend(product.price) && styles.ctaButtonDisabled]}
          onPress={handleRedeem}
          disabled={!canSpend(product.price)}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>
            {canSpend(product.price) ? `Resgatar por ${product.price} 🍃` : 'Saldo insuficiente'}
          </Text>
        </TouchableOpacity>
      </View>

      <ProductSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => {
          setSnackbarVisible(false);
        }}
        onOk={() => {
          setSnackbarVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#F5F5F5',
  },
  discountChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF5722',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },

  originalPrice: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  price: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50',
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F3F4F6',
  },
  sectionBox: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  balanceRow: {
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 13,
    color: '#374151',
  },
  balanceStrong: {
    color: '#111827',
    fontWeight: '700',
  },
  ctaButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Snackbar overlay
export function ProductSnackbar({ visible, onDismiss, onOk, message }: { visible: boolean; onDismiss: () => void; onOk: () => void; message: string }) {
  return (
    <Snackbar visible={visible} onDismiss={onDismiss} duration={1500} action={{ label: 'OK', onPress: onOk }}>
      {message}
    </Snackbar>
  );
}
