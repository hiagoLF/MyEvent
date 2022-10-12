/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {AxiosError, AxiosResponse} from 'axios';
import React, {useEffect} from 'react';
import {Alert, FlatList, View} from 'react-native';
import {Card, Paragraph, Text} from 'react-native-paper';
import {useMutation} from 'react-query';
import {AppHeader} from '../../components/AppHeader';
import {findEventsOnApi} from '../../services/api/events';

const data = [
  {
    id: '342343',
    name: 'Aniversário de Dacueba',
    description: 'Vai ser top e você vai amar',
    valor: 12.9,
    imageUrl: 'https://picsum.photos/700',
  },
  {
    id: '23423423',
    name: 'Simpósio do Gamado',
    description: 'Tudo que você precisa em um só lugar vai ser aqui',
    valor: 20.95,
    imageUrl: 'https://picsum.photos/700',
  },
  {
    id: '4234234',
    name: 'Campeonato de Biriba',
    description:
      'A vida é curta e participar de um campeonato de birita é fundamental',
    valor: 30,
    imageUrl: 'https://picsum.photos/700',
  },
];

export const Home: React.FC = () => {
  const {navigate} = useNavigation();

  const eventsMutation = useMutation(findEventsOnApi, {
    onSuccess: handleGetEventsSuccess,
    onError: handleGetEventsError,
  });

  function handleGetEventsSuccess(eventsResponse: AxiosResponse) {
    console.log(eventsResponse.data);
  }

  function handleGetEventsError(responseError: AxiosError) {
    Alert.alert('Erro', responseError.response?.data || responseError.message);
  }

  useEffect(() => {
    eventsMutation.mutate(1);
  }, []);

  return (
    <View style={{flex: 1}}>
      <AppHeader title="Home" />

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{padding: 5}}>
            <Card
              elevation={5}
              onPress={() =>
                navigate('Event' as never, {id: item.id} as never)
              }>
              <Card.Cover source={{uri: item.imageUrl}} />
              <Card.Title title={item.name} />
              <Card.Content>
                <Paragraph>{item.description}</Paragraph>
                <Text variant="labelLarge">R$ {item.valor}</Text>
              </Card.Content>
            </Card>
          </View>
        )}
      />
    </View>
  );
};
