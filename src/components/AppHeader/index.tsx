import {useNavigation, DrawerActions} from '@react-navigation/native';
import React from 'react';
import {Appbar} from 'react-native-paper';

interface AppHeaderProps {
  title: string;
  backAction?: boolean;
  onBackActionPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  backAction,
  onBackActionPress,
}) => {
  const {dispatch} = useNavigation();

  return (
    <>
      <Appbar.Header elevated>
        {backAction && <Appbar.BackAction onPress={onBackActionPress} />}
        <Appbar.Content title={title} />
        <Appbar.Action
          icon="menu"
          onPress={() => dispatch(DrawerActions.toggleDrawer())}
        />
      </Appbar.Header>
    </>
  );
};
