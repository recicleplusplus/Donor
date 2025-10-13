import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DonationCreationProvider } from '../contexts/donation-creation';
import { Step1_AddressAndMaterials } from '../screens/collection/Step1_AddressAndMaterials';
import { Step2_ScheduleAndConfirm } from '../screens/collection/Step2_ScheduleAndConfirm';

import { Home as HomeStack } from '../screens/home';
import { ChatScreen } from '../screens/chat';

const MainStack = createNativeStackNavigator();
const CreationStack = createNativeStackNavigator();

// Criação de Doação
function DonationCreationStack() {
  return (
    <DonationCreationProvider>
      <CreationStack.Navigator>
        <CreationStack.Screen 
          name="CollectionStep1" 
          component={Step1_AddressAndMaterials} 
          options={{ title: 'Passo 1: Endereço e Materiais' }} 
        />
        <CreationStack.Screen 
          name="CollectionStep2" 
          component={Step2_ScheduleAndConfirm} 
          options={{ title: 'Passo 2: Agendamento' }} 
        />
      </CreationStack.Navigator>
    </DonationCreationProvider>
  );
}

// Navegador principal
export function StackCollection() {
  return (
    <MainStack.Navigator initialRouteName='HomeStack'>
        {/* Tela Principal */}
        <MainStack.Screen 
          name="HomeStack" 
          component={HomeStack} 
          options={{ headerShown: false }}
        />
        
        {/* Tela de Chat */}
        <MainStack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ headerShown: false }}
        />

        {/* Fluxo de criação de doação (modal) */}
        <MainStack.Screen 
          name="DonationCreation" 
          component={DonationCreationStack} 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
    </MainStack.Navigator>
  );
}