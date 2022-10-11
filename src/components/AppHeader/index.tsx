import {useNavigation, DrawerActions} from '@react-navigation/native';
import React from 'react';
import {Appbar} from 'react-native-paper';

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({title}) => {
  const {dispatch} = useNavigation();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Appbar.Action
          icon="menu"
          onPress={() => dispatch(DrawerActions.toggleDrawer())}
        />
      </Appbar.Header>
    </>
  );
};
