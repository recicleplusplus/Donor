import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export function useGetDonationDetails(donationId) {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!donationId) {
      setLoading(false);
      return;
    }

    async function fetchDetails() {
      setLoading(true);
      
      // Esta query busca a doação e todos os seus dados relacionados de uma só vez
      const { data, error: fetchError } = await supabase
        .from('donations')
        .select(`
          id,
          status,
          created_at,
          notes,
          scheduled_days,
          scheduled_time_slots,
          address:addresses ( * ),
          collector:users!collector_id ( name, phone ),
          items:donation_items (
            weight_kg,
            material:materials ( name )
          )
        `)
        .eq('id', donationId)
        .single(); // .single() espera um único resultado

      if (fetchError) {
        console.error("Erro ao buscar detalhes da doação:", fetchError);
        setError(fetchError);
      } else {
        setDonation(data);
      }
      setLoading(false);
    }

    fetchDetails();
  }, [donationId]);

  return { donation, loading, error };
}