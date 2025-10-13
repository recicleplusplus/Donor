import P from 'prop-types';
import { useReducer, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';

import { DonorContext } from "./context";
import { reducer } from "./reducer";
import { donor } from "./data";
import * as Types from "./types";

async function fetchUserData() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null; // Nenhum usuário logado, retorna nulo

    // Vamos buscar os dados principais do usuário e seus endereços de uma vez
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        addresses ( * )
      `) // Pede todos os dados do usuário E todos os seus endereços associados
      .eq('id', user.id)
      .single(); // Esperamos apenas um usuário

    // console.log('DADOS DO USUÁRIO CARREGADOS DO SUPABASE:', data);

    if (error) throw error;
    
    return data;

  } catch (error) {
    console.error("Erro ao buscar dados completos do doador:", error.message);
    return null;
  }
}


export const DonorProvider = ({children}) => {
  
    const [donorState, donorDispach] = useReducer(reducer, donor);

    useEffect(() => {
        const loadInitialData = async () => {
            const userData = await fetchUserData();

            if (userData) {
                // Se encontramos os dados do usuário, despachamos uma ação para
                // atualizar o estado global com os dados reais do banco.
                donorDispach({ type: Types.SET_DONOR_DATA, payload: userData });
            }
        };

        loadInitialData();
    }, []); // O array vazio garante que isso rode apenas uma vez.

    return (
        <DonorContext.Provider value={{donorState, donorDispach}}>
            {children}
        </DonorContext.Provider>
    );
};

export const useDonor = () => {
  const context = useContext(DonorContext);

  // verificar se o contexto existe
  if (context === undefined) {
    throw new Error('useDonor() precisa ser usado dentro de um DonorProvider');
  }

  return context;
};


DonorProvider.propTypes = {
    children: P.node.isRequired
};