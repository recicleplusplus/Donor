import * as Types from "./types";
import { donor } from "./data";

export const reducer = (state, action) => {
    console.log(`[REDUCER] Ação recebida: ${action.type}`);

    switch(action.type){

        // Ação para adicionar um endereço à lista
        case Types.ADD_ADDRESS: {
            return {
                ...state,
                // Cria um NOVO array com os endereços antigos + o novo
                address: [...state.address, action.payload],
            };
        }
        // Ação para atualizar um endereço existente na lista
        case Types.UPDATE_ADDRESS: {
            return {
                ...state,
                // .map() cria um NOVO array, substituindo apenas o item com o ID correspondente
                address: state.address.map(addr =>
                    addr.id === action.payload.id ? action.payload : addr
                ),
            };
        }
        // Ação para remover um endereço da lista
        case Types.REMOVE_ADDRESS: {
            return {
                ...state,
                // .filter() cria um NOVO array, sem o item com o ID correspondente
                address: state.address.filter(addr => addr.id !== action.payload),
            };
        }

        // --- AÇÕES DE ESTADO GERAL ---
        case Types.ADDNOTIFICATION: {
            // Forma imutável de adicionar um item a um array.
            // Em vez de modificar o array existente, criamos um novo.
            return {
                ...state, 
                notifications: [...state.notifications, action.payload]
            };
        }
        case Types.SETSIGNOUT: {
            // Reseta o estado para o inicial, marcando como deslogado
            return {...donor, logged: false};
        }
        case Types.SETNAME: {
            return {...state, name: action.payload};
        }
        case Types.SETEMAIL: {
            return {...state, email: action.payload};
        }
        case Types.SETPHONE: {
            return {...state, phone: action.payload};
        }
        case Types.SETIMAGE: {
            return {...state, photoUrl: action.payload};
        }

        // Esta ação é chamada pelo DonorProvider para popular o estado inicial
        // com os dados do usuário e seus endereços vindos do Supabase.
        case Types.SET_DONOR_DATA: {
            if (!action.payload) return state; // Proteção caso o payload seja nulo

            // Evitar problemas de letras maiusculas ou minusculas na URL
            const photoUrlFromPayload = action.payload.photo_url || action.payload.photoUrl;

            const { addresses, ...userData } = action.payload;

            return { 
                ...state, 
                ...userData, 
                photoUrl: photoUrlFromPayload,
                address: addresses || [] 
            };
        }

        case Types.SET_PROFILE_DATA: {
            return {
                ...state,
                name: action.payload.name,
                phone: action.payload.phone,
            };
        }

        default: {
            console.warn(`[REDUCER] Ação não reconhecida: ${action.type}`);
            return state;
        }
    }
}