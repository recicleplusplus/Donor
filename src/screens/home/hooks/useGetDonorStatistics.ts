import { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { Firestore } from '../../../firebase/config/connection';
import {
  RecyclableDonorData,
} from '../../../types/donor_types';
import { Statistic } from '../../../firebase/instances/statistic';

interface Output {
  donorStatistics: Statistic | null;
  loading?: boolean;
  error?: Error | null;
}

export function useGetDonorStatistics(
  recyclableDonorData: RecyclableDonorData[] | null,
  donorId: string
): Output {
  const [donorStatistics, setDonorStatistics] = useState<Statistic | null>(null);

  const getDonorStatistics = (data: RecyclableDonorData[]): Statistic | null => {
    if (!data || data.length === 0) {
      return null;
    }

    const typesWeight: Record<string, number> = {};
    data.forEach(item => {
      const typesArray = item.types.split(',').map(type => type.trim());
      const weightMatch = item.weight.match(/\d+/);
      const weight = weightMatch ? parseInt(weightMatch[0], 10) : 0;

      typesArray.forEach(type => {
        if (typesWeight[type]) {
          typesWeight[type] += weight;
        } else {
          typesWeight[type] = weight;
        }
      });
    });

    return {
      collectionsCompleted: data.length,
      eletronicKg: typesWeight["Eletrônico"] || 0,
      glassKg: typesWeight["Vidro"] || 0,
      metalKg: typesWeight["Metal"] || 0,
      oilKg: typesWeight["Óleo"] || 0,
      paperKg: typesWeight["Papel"] || 0,
      plasticKg: typesWeight["Plástico"] || 0
    };
  };

  const setDonorStatistic = async (userId: string, statistic: Statistic): Promise<void> => {
    try {
      const donorDoc = doc(Firestore, "donor", userId);
      await updateDoc(donorDoc, { statistic });
    } catch (error) {
      console.error("Erro ao acessar o documento statistic:", error);
    }
  };

  useEffect(() => {
    if (recyclableDonorData && recyclableDonorData.length > 0) {
      const statistics = getDonorStatistics(recyclableDonorData);
      setDonorStatistics(statistics);
      if (donorId && statistics) {
        setDonorStatistic(donorId, statistics);
      }
    } else {
      setDonorStatistics(null);
    }
  }, [recyclableDonorData, donorId]);

  return { donorStatistics };
}