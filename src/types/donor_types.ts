import { ImageSourcePropType } from 'react-native';
import { ViewStyle, TextStyle } from 'react-native';

// Interface para o estado do doador
export interface DonorState {
  id: string;
  name: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

// Interface para endereço
export interface Address {
  name?: string;
  title?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  reference?: string;
  num?: number;
  cep?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Interface para dados recicláveis do doador (compatível com Firebase)
export interface RecyclableDonorData {
  id: string;
  name?: string;
  photoUrl?: string;
  types: string;
  weight: string;
  bags?: number;
  boxes?: number;
  address: Address;
  collector?: {
    id: string;
    name: string;
    photoUrl?: string;
  };
  observation?: string;
  status?: 'pending' | 'collected' | 'completed' | string;
  times?: string;
  weekDays?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para estatísticas do doador
export interface DonorStatistics {
  collectionsCompleted: number;
  eletronicKg: number;
  glassKg: number;
  metalKg: number;
  oilKg: number;
  paperKg: number;
  plasticKg: number;
}

// Interface para dados do gráfico de barras
export interface BarData {
  label: string;
  value: number;
  color: string;
  height: number;
}

// Interface para imagem do perfil
export type ProfileImage = {
  uri?: string;
} | ImageSourcePropType;

// Interface para o contexto do doador
export interface DonorContextType {
  donorState: DonorState;
  donorDispatch: React.Dispatch<any>;
}

// Interfaces para propriedades dos componentes
export interface HomeHeaderProps {
  donorName: string;
  image: ProfileImage;
}

export interface StatisticsCardProps {
  donorStatistics: DonorStatistics | null;
  styles: {
    main: ViewStyle;
    card: ViewStyle;
    barContainer: ViewStyle;
    bar: ViewStyle;
    barFill: ViewStyle;
    barText: TextStyle;
    legend: TextStyle;
  };
}

export interface HistorySectionProps {
  recyclableDonorData: RecyclableDonorData[] | null;
  styles: {
    containerEdit: ViewStyle;
  };
}

export interface Collector {
  id: string;
  name: string;
  photoUrl: string;
}

export interface DonorData {
  id: string;
  name: string;
  photoUrl: string;
  address: Address;
  bags: number;
  boxes: number;
  collector: Collector;
  observation: string;
  status: string;
  times: string;
  types: string;
  weekDays: string;
  weight: string;
}

// Interface para hook de imagem do perfil
export interface UseProfileImageReturn {
  image: ProfileImage;
  setImage: React.Dispatch<React.SetStateAction<ProfileImage>>;
}

// Interface para hook de dados recicláveis
export interface UseGetRecyclableDonorDataReturn {
  data: RecyclableDonorData[] | null;
  loading: boolean;
  error: string | null;
}

// Tipos de navegação (pode ser expandido conforme necessário)
export type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  reset: (state: any) => void;
};

// Tipos para Firebase
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}