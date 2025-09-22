import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { RealTime } from "../../../firebase/config/connection";
import { Address } from '../../../firebase/instances/address';
import { DonorData } from '../../../types/donor_types';

interface Output {
  data: DonorData[];
  loading: boolean;
  error: Error | null;
}

// Percorre todas as entradas em "recyclable" e filtra aquelas que pertencem ao donorId fornecido
export function useGetRecyclableDonorData(donorId: string | null | undefined): Output {
  const [data, setDonorData] = useState<DonorData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!donorId) return;
    const recyclableRef = ref(RealTime, "recyclable");

    setLoading(true);
    setError(null);

    get(recyclableRef)
      .then(snapshot => {
        const data = snapshot.val();
        if (data) {
          const donorArray: DonorData[] = [];
          for (const id in data) {
            const donorInfo = data[id];
            if (donorInfo && donorInfo.donor && donorInfo.donor.id === donorId) {
              const donor = donorInfo.donor;
              donorArray.push({
                id: donor.id,
                name: donor.name,
                photoUrl: donor.photoUrl,
                address: donorInfo.address,
                bags: donorInfo.bags,
                boxes: donorInfo.boxes,
                collector: {
                  id: donorInfo.collector.id,
                  name: donorInfo.collector.name,
                  photoUrl: donorInfo.collector.photoUrl
                },
                observation: donorInfo.observation,
                status: donorInfo.status,
                times: donorInfo.times,
                types: donorInfo.types,
                weekDays: donorInfo.weekDays,
                weight: donorInfo.weight
              });
            }
          }
          setDonorData(donorArray);
        } else {
          setDonorData([]);
        }
      })
      .catch((error: Error) => {
        console.error('Erro ao ler os dados:', error);
        setError(error);
        setDonorData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [donorId]);

  return { data, loading, error };
}