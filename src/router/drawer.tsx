import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerMenu from '../components/DrawerMenu';
import {Home} from '../screens/Home/Home';
import MyEvents from '../screens/MyEvents';

// const Stack = createNativeStackNavigator();
const DrawerNav = createDrawerNavigator();

export const DrawerRouter: React.FC = ({}) => {
  return (
    <DrawerNav.Navigator
      drawerContent={DrawerMenu}
      screenOptions={{headerShown: false}}>
      <DrawerNav.Screen name="Home" component={Home} />
      <DrawerNav.Screen name="MyEvents" component={MyEvents} />
    </DrawerNav.Navigator>
  );
};
