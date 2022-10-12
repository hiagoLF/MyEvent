/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FAB} from 'react-native-paper';
import {AppHeader} from '../../components/AppHeader';
import LittleCard from '../../components/LittleCard';

const data = [
  {id: 'erwerwe', title: 'Evento Mascote', sell: 12},
  {id: '54534r', title: 'Simpósio UFBA saúde', sell: 16},
  {id: '234', title: 'Mandacarú Saúde', sell: 14},
  {id: '34234', title: 'Faisão das Viage', sell: 10},
  {id: 'eqwe', title: 'Faisão das Viage', sell: 10},
  {id: 'qweqw', title: 'Faisão das Viage', sell: 10},
  {id: '342qweqw34', title: 'Faisão das Viage', sell: 10},
  {id: 'qwe', title: 'Faisão das Viage', sell: 10},
  {id: 'qweqwe', title: 'Faisão das Viage', sell: 10},
  {id: 'dfsd', title: 'Faisão das Viage', sell: 10},
  {id: '432', title: 'Faisão das Viage', sell: 10},
];

export const MyEvents: React.FC = () => {
  const {navigate, goBack} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title="Meus Eventos"
        backAction
        onBackActionPress={() => goBack()}
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          zIndex: 5,
        }}
        variant="tertiary"
        onPress={() => console.log('Pressed')}
      />

      <FlatList
        style={{padding: 5}}
        data={data}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <View style={{marginBottom: 8}}>
            <LittleCard
              onPress={() =>
                navigate('MyEvent' as never, {id: item.id} as never)
              }
              title={item.title}
              subtitle={`Vendas: ${item.sell}`}
            />
          </View>
        )}
      />
    </View>
  );
};
