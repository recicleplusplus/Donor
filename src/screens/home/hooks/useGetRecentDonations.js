import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient'; // Verifique o caminho

export function useGetRecentDonations(donorId) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const fetchDonations = useCallback(async () => {
        if (!donorId) {
        setLoading(false);
        return;
        }

        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
        .from('donations')
        .select(`
            id,
            status,
            created_at,
            addresses ( street, num, neighborhood ),
            collector:users!collector_id ( name ),
            donation_items (
            materials ( name )
            )
        `)
        .eq('donor_id', donorId)
        .order('created_at', { ascending: false })
        .limit(5);

        if (fetchError) {
        console.error("Erro ao buscar histórico de doações:", fetchError);
        setError(fetchError);
        } else {
        setDonations(data);
        }
        setLoading(false);
    }, [donorId]); // A função será recriada se o donorId mudar

    useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return { donations, loading, error, refetch: fetchDonations };
}

