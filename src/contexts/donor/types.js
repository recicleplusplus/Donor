// --- AÇÕES DE FLUXO DE DADOS ---
export const SET_DONOR_DATA = 'SET_DONOR_DATA'; // carregamento inicial dos dados
export const SET_PROFILE_DATA = 'SET_PROFILE_DATA'; // recarrega o nome e o numero na pagina de perfil

// --- AÇÕES DE CRUD DE ENDEREÇO ---
// Usado pelo RegisterAddress para adicionar um novo endereço ao estado
export const ADD_ADDRESS = 'ADD_ADDRESS';
// Usado pelo RegisterAddress para atualizar um endereço existente no estado
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
// Usado pela tela Profile para remover um endereço do estado
export const REMOVE_ADDRESS = 'REMOVE_ADDRESS';

// --- AÇÕES DE ESTADO GERAL ---
// Adiciona uma nova notificação à lista
export const ADDNOTIFICATION = 'ADDNOTIFICATION';
// Reseta o estado do usuário ao fazer logout
export const SETSIGNOUT = 'SETSIGNOUT';
// Atualiza o nome no estado (usado nos formulários)
export const SETNAME = 'SETNAME';
// Atualiza o email no estado (usado nos formulários)
export const SETEMAIL = 'SETEMAIL';
// Atualiza o telefone no estado (usado nos formulários)
export const SETPHONE = 'SETPHONE';
// Atualiza a URL da foto de perfil no estado
export const SETIMAGE = 'SETIMAGE';