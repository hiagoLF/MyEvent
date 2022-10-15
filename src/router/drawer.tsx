import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerMenu from '../components/DrawerMenu';
import {Home} from '../screens/Home';
import {MyEvents} from '../screens/MyEvents';
import {MyEvent} from '../screens/MyEvent';
import {CreateEditEvent} from '../screens/CreateEditEvent';
import {Purchases} from '../screens/Purchases';
import MyPurchase from '../screens/MyPurchase';
import Event from '../screens/Event';
import {PurchaseData} from '../screens/PurchaseData';
import {FinalizePurchase} from '../screens/FinalizePurchase';
import {Sales} from '../screens/Sales';
import {Transfer} from '../screens/Transfer';
import QrScanner from '../screens/QrScanner';

const DrawerNav = createDrawerNavigator();

export const DrawerRouter: React.FC = ({}) => {
  return (
    <DrawerNav.Navigator
      backBehavior="history"
      drawerContent={DrawerMenu}
      screenOptions={{headerShown: false}}>
      <DrawerNav.Screen name="Home" component={Home} />
      <DrawerNav.Screen name="MyEvents" component={MyEvents} />
      <DrawerNav.Screen name="MyEvent" component={MyEvent} />
      <DrawerNav.Screen name="CreateEditEvent" component={CreateEditEvent} />
      <DrawerNav.Screen name="Purchases" component={Purchases} />
      <DrawerNav.Screen name="MyPurchase" component={MyPurchase} />
      <DrawerNav.Screen name="Event" component={Event} />
      <DrawerNav.Screen name="PurchaseData" component={PurchaseData} />
      <DrawerNav.Screen name="FinalizePurchase" component={FinalizePurchase} />
      <DrawerNav.Screen name="Sales" component={Sales} />
      <DrawerNav.Screen name="Transfer" component={Transfer} />
      <DrawerNav.Screen name="QrScanner" component={QrScanner} />
    </DrawerNav.Navigator>
  );
};
