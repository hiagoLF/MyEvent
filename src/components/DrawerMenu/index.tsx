/* eslint-disable react-native/no-inline-styles */
// import {useNavigation, useRoute} from '@react-navigation/native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import {Avatar, Drawer, Text} from 'react-native-paper';

const DrawerMenu: React.FC<DrawerContentComponentProps> = props => {
  // console.log(props.descriptors['MyEvents']);
  const currentScreen = props.state.routeNames.find(
    (route, key) => props.state.index === key,
  );

  return (
    <DrawerContentScrollView style={{paddingTop: 20}} {...props}>
      <Drawer.Section
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Avatar.Text size={64} label="HL" />
        <Text variant="titleLarge">Hiago Leão</Text>
      </Drawer.Section>

      <Drawer.Section>
        <Drawer.Item
          label="Início"
          active={currentScreen === 'Home'}
          onPress={() => props.navigation.navigate('Home' as never)}
          icon="home"
        />
        <Drawer.Item
          label="Compras"
          active={false}
          onPress={() => props.navigation.navigate('Purchases')}
          icon="shopping"
        />
        <Drawer.Item
          label="Meus Eventos"
          active={currentScreen === 'MyEvents'}
          onPress={() => props.navigation.navigate('MyEvents' as never)}
          icon="calendar-heart"
        />
        <Drawer.Item
          label="Vendas"
          active={false}
          onPress={() => props.navigation.navigate('Sales' as never)}
          icon="cash-multiple"
        />
        <Drawer.Item
          label="Sair"
          active={false}
          onPress={() => props.navigation.navigate('Start' as never)}
          icon="exit-to-app"
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default DrawerMenu;
