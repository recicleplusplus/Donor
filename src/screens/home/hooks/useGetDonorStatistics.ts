import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// --- DEFINIÇÃO DOS NOVOS TIPOS DE DADOS ---
// Este é o formato do array que virá dentro do JSON
interface MaterialTotal {
  name: string;
  totalKg: number;
}

// Este é o formato do objeto JSON completo que a função retorna
interface DynamicStatistic {
  collectionsCompleted: number;
  materialTotals: MaterialTotal[];
}

interface Output {
  statistics: DynamicStatistic | null;
  loading: boolean;
  error: Error | null;
}
// ------------------------------------------

export function useGetDonorStatistics(donorId: string): Output {
  const [statistics, setStatistics] = useState<DynamicStatistic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!donorId) {
      setLoading(false);
      return;
    }

    async function fetchStatistics() {
      setLoading(true);
      setError(null);
      
      // Chama a MESMA função 'get_donor_statistics', que agora retorna JSON
      const { data, error: rpcError } = await supabase.rpc('get_donor_statistics', {
        p_donor_id: donorId
      });

      if (rpcError) {
        console.error("Erro ao buscar estatísticas dinâmicas:", rpcError);
        setError(rpcError);
        setStatistics(null);
      } else {
        // 'data' agora NÃO é um array, é o próprio objeto JSON que pedimos
        setStatistics(data);
      }
      setLoading(false);
    }

    fetchStatistics();
  }, [donorId]);

  return { statistics, loading, error };
}