import { useState, useEffect } from 'react';
import { getDonorCurrentPoints } from '../../../firebase/providers/donor';

export const useDonorPoints = (donorId: string) => {
  const [donorPoints, setDonorPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorPoints = async () => {
      if (!donorId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const points = await getDonorCurrentPoints(donorId);
        setDonorPoints(points || 0);
      } catch (err) {
        console.error('Erro ao buscar pontos do doador:', err);
        setError('Erro ao carregar pontos');
        setDonorPoints(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorPoints();
  }, [donorId]);

  const refreshPoints = async () => {
    if (!donorId) return;

    try {
      setLoading(true);
      const points = await getDonorCurrentPoints(donorId);
      setDonorPoints(points || 0);
    } catch (err) {
      console.error('Erro ao atualizar pontos do doador:', err);
      setError('Erro ao atualizar pontos');
    } finally {
      setLoading(false);
    }
  };

  return {
    donorPoints,
    loading,
    error,
    refreshPoints
  };
};