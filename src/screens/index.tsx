import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {DrawerRouter} from '../router/drawer';
// import {StackRouter} from '../router/stack';

export const Screens: React.FC = () => {
  return (
    <NavigationContainer>
      <DrawerRouter />
      {/* <StackRouter /> */}
    </NavigationContainer>
  );
};
