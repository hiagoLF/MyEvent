/* eslint-disable react-native/no-inline-styles */
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Avatar, Drawer, Text} from 'react-native-paper';
import {useMutation} from 'react-query';
import {useAppContext} from '../../context/AppContext';
import {logoutRequest} from '../../services/api/token';

const DrawerMenu: React.FC<DrawerContentComponentProps> = props => {
  const currentScreen = props.state.routeNames.find(
    (route, key) => props.state.index === key,
  );

  const {reset} = useNavigation();

  const {removeAuth, auth} = useAppContext();

  const logoutMutation = useMutation(logoutRequest, {
    onSuccess: handleLogoutSuccessOrError,
    onError: handleLogoutSuccessOrError,
  });

  async function handleLogoutSuccessOrError() {
    await removeAuth();
    reset({
      routes: [
        {
          name: 'Start' as never,
          params: {},
        },
      ],
    });
  }

  async function handleLogoutButtonPress() {
    logoutMutation.mutate();
  }

  return (
    <DrawerContentScrollView style={{paddingTop: 20}} {...props}>
      <Drawer.Section
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Avatar.Text
          size={64}
          label={(auth?.user.name || '')
            .split(' ')
            .map(item => item[0])
            .join('')
            .substring(0, 2)}
        />
        <Text variant="titleLarge">{auth?.user.name}</Text>
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
          active={currentScreen === 'Purchases'}
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
          active={currentScreen === 'Sales'}
          onPress={() => props.navigation.navigate('Sales' as never)}
          icon="cash-multiple"
        />
        <Drawer.Item
          label="Sair"
          active={currentScreen === 'Start'}
          onPress={handleLogoutButtonPress}
          icon="exit-to-app"
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default DrawerMenu;
