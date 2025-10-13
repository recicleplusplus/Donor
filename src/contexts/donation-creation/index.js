import React, { createContext, useReducer, useContext } from 'react';

// 1. Estado Inicial do formulário de doação
const initialState = {
  addressId: null,
  materials: [], // Será um array de objetos: { materialId, materialName, weight }
  notes: '',
  scheduledDays: [],
  scheduledTimeSlots: [],
};

// 2. Ações que podemos executar para modificar o estado
const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_ADDRESS':
      return { ...state, addressId: action.payload };
    case 'ADD_OR_UPDATE_MATERIAL':
      const existingMaterialIndex = state.materials.findIndex(m => m.materialId === action.payload.materialId);
      if (existingMaterialIndex > -1) {
        // Atualiza o peso se o material já existe
        const updatedMaterials = [...state.materials];
        updatedMaterials[existingMaterialIndex] = action.payload;
        return { ...state, materials: updatedMaterials };
      } else {
        // Adiciona o novo material
        return { ...state, materials: [...state.materials, action.payload] };
      }
    case 'REMOVE_MATERIAL':
      return { ...state, materials: state.materials.filter(m => m.materialId !== action.payload) };
    case 'SET_SCHEDULE_AND_NOTES':
      return {
        ...state,
        notes: action.payload.notes,
        scheduledDays: action.payload.scheduledDays,
        scheduledTimeSlots: action.payload.scheduledTimeSlots,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// 3. Criação do Contexto
const DonationCreationContext = createContext();

// 4. O Componente Provedor que irá "abraçar" nossas telas de cadastro
export const DonationCreationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DonationCreationContext.Provider value={{ donationState: state, donationDispatch: dispatch }}>
      {children}
    </DonationCreationContext.Provider>
  );
};

// 5. Um hook customizado para facilitar o uso do contexto nas telas
export const useDonationCreation = () => {
  return useContext(DonationCreationContext);
};