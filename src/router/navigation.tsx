import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DrawerRouter} from './drawer';
import {StackRouter} from './stack';

const Stack = createNativeStackNavigator();

export const Screens: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Start" component={StackRouter} />
        <Stack.Screen name="Application" component={DrawerRouter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
