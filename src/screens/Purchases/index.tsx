/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {AppHeader} from '../../components/AppHeader';
import LittleCard from '../../components/LittleCard';
const data = [
  {id: 'erwerwe', title: 'Evento Mascote'},
  {id: '54534r', title: 'Simpósio UFBA saúde'},
  {id: '234', title: 'Mandacarú Saúde'},
  {id: '34234', title: 'Faisão das Viage'},
  {id: 'eqwe', title: 'Faisão das Viage'},
  {id: 'qweqw', title: 'Faisão das Viage'},
  {id: '342qweqw34', title: 'Faisão das Viage'},
  {id: 'qwe', title: 'Faisão das Viage'},
  {id: 'qweqwe', title: 'Faisão das Viage'},
  {id: 'dfsd', title: 'Faisão das Viage'},
  {id: '432', title: 'Faisão das Viage'},
];

export const Purchases: React.FC = () => {
  const {navigate} = useNavigation();

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Compras" />

      <FlatList
        style={{padding: 10}}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{marginBottom: 10}}>
            <LittleCard
              title={item.title}
              onPress={() =>
                navigate('MyPurchase' as never, {id: item.id} as never)
              }
            />
          </View>
        )}
      />
    </View>
  );
};
