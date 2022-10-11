/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
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

const MyEvents: React.FC = () => {
  return (
    <View>
      <AppHeader title="Meus Eventos" />

      <FlatList
        style={{padding: 5}}
        data={data}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <View style={{marginBottom: 8}}>
            <LittleCard title={item.title} subtitle={`Vendas: ${item.sell}`} />
          </View>
        )}
      />
    </View>
  );
};

export default MyEvents;
