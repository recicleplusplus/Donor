import { useState, useEffect } from 'react';
import { getMaterialsWithCache } from '../firebase/providers/materials';
import { Material } from '../firebase/instances/material';

interface Output {
  data: Record<string, Material>;
  loading: boolean;
  error: string | null;
  refreshMaterials: () => Promise<void>;
}

export function useGetMaterials(): Output {
  const [data, setData] = useState<Record<string, Material>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const activeMaterials = await getMaterialsWithCache();
      setData(activeMaterials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return {
    data,
    loading,
    error,
    refreshMaterials: fetchMaterials
  };
}