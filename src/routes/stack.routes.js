import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home as HomeStack } from '../screens/home';
import { Collection } from '../screens/collection';
import { Collection2 } from '../screens/collection/index2';
import { Collection3 } from '../screens/collection/index3';
import { Collection4 } from '../screens/collection/index4';
import { ChatScreen } from '../screens/chat';
import { Home as PointsPage } from '../screens/points_page';

const Stack = createNativeStackNavigator();

function StackCollection() {
  return (
    <Stack.Navigator initialRouteName='HomeStack'>
        <Stack.Screen 
          name="HomeStack" 
          component={HomeStack} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PointsPage" 
          component={PointsPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Collection" 
          component={Collection} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Collection2" 
          component={Collection2} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Collection3" 
          component={Collection3} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Collection4" 
          component={Collection4} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}

export {StackCollection};