import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SimpleIcon } from '../components/icons'
import { Colors,Theme } from '../constants/setting'
import { Size28 } from '../constants/scales'

const Tab = createBottomTabNavigator();

import { Advice } from "../screens/advice"
import { Notice } from "../screens/notice"
import { Profile } from "../screens/profile"
import { StackCollection } from "./stack.routes";

function TabsRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[Theme][2],
        tabBarInactiveTintColor: Colors[Theme][5],
        tabBarStyle: { 
          borderTopColor: Colors[Theme][0],
          backgroundColor: Colors[Theme][0],
          opacity: 0.85,
          height: 55, 
          paddingBottom: 8,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={StackCollection} 
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => ( <SimpleIcon name="recycle" color={color}  size={Size28} />),
        }}
      />     
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (<SimpleIcon name="account" color={color} size={Size28} />),
        }}
      />
      <Tab.Screen 
        name="Advice" 
        component={Advice} 
        options={{
          title: "Avisos",
          tabBarIcon: ({ color }) => <SimpleIcon name="alert-octagon" color={color}  size={Size28} />,          
        }}
      />
      <Tab.Screen 
        name="Notice" 
        component={Notice} 
        options={{
          title: "Notificação",
          tabBarIcon: ({ color }) => ( <SimpleIcon name="bell" color={color} size={Size28} />),
        }}
      />
    </Tab.Navigator>
  );
}

export {TabsRoutes};